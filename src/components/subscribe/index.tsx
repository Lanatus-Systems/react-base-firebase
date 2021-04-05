/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState, lazy, Suspense } from "react";
import { AuthContext } from "src/context";
import { useAsync, useMultiLanguage } from "src/hooks";
import { SubscribePage, SubscriptionPackage } from "src/model/app-pages";
import * as api from "../../api/app-pages";
// import ImageEdit from "../editables/ImageEdit";
// import ImagePlaceholder from "../image-placeholder";
import Loading from "../../base/Loading";
import TextPlaceholder from "../text-placeholder";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";
import parseQuillHtml from "src/utils/quill-parser";
import { uploadImage, uploadPdf } from "src/api/storage";
import { mapImageToPromise } from "../articles/article-content";
import SubscribePackage from "./subscribe-package";
import * as articleApi from "src/api/article";
// import { firestore } from "src/firebase";

const MagazineSlider = lazy(() => import("./magazine-slider"));

const Subscribe = () => {
  // const { isMobile } = useContext(LayoutContext);

  const { roles } = useContext(AuthContext);

  const { derive } = useMultiLanguage();
  const [pageData, setPageData] = useState<SubscribePage>();

  const [saveSubscriptionPageData, saving] = useAsync(api.savePageData);

  const [uploadImageData, uploadingImg] = useAsync(uploadImage);
  const [uploadPdfData, uploadingPdf] = useAsync(uploadPdf);

  const [subscriptionPackages, setSubscriptionPackages] = useState<
    SubscriptionPackage[]
  >();

  console.log({ subscriptionPackages });

  useEffect(() => {
    api.getSubscribePageData().then((data) => {
      // console.log({ data });
      // const packages = (data as any).packages as any;
      // packages.map((item: any) => {
      //   firestore.collection("magazines").add({...item, enabled:true});
      //   return item;
      // });
      setPageData(data);
    });
  }, []);

  useEffect(() => {
    if (roles.admin) {
      articleApi.getAllSubscriptionPackages().then(setSubscriptionPackages);
    } else {
      articleApi.getEnabledSubscriptionPackages().then(setSubscriptionPackages);
    }
  }, [roles.admin]);

  console.log({ pageData });
  const saveData = () => {
    if (pageData != null) {
      const uploadedSlides = Promise.all(
        pageData.sliderImages.map(
          (image) => image && mapImageToPromise(image, uploadImageData)
        )
      ).then((urls) => {
        return pageData.sliderImages.map((item, index) => urls[index]);
      });

      Promise.all([
        mapImageToPromise(pageData.subHeadCoverImage, uploadImageData),
        uploadedSlides,
      ]).then(([resolvedImage, slides]) => {
        console.log({ resolvedImage, slides, pageData });
        saveSubscriptionPageData({
          ...pageData,
          sliderImages: slides,
          subHeadCoverImage: resolvedImage,
        } as SubscribePage);
      });
    }
  };

  if (pageData == null) {
    return <Loading />;
  }
  return (
    <div css={{ paddingBottom: 50 }}>
      <div css={{ minHeight: 200, padding: "2vh 2vw" }}>
        <Suspense fallback={<Loading />}>
          <MagazineSlider
            slides={pageData.sliderImages}
            updateSlides={(slides) =>
              setPageData((val) => val && { ...val, sliderImages: slides })
            }
          />
        </Suspense>
      </div>
      <div
        css={{
          display: "flex",
          padding: "2vw 5vw",
          paddingTop: 0,
          // flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",

          // width: "100%",
        }}
      >
        {/* <div
          css={{
            display: "flex",
            justifyContent: "center",
            width: isMobile ? "" : "30vw",
          }}
        >
          <div
            style={{
              maxHeight: "50vh",
              minWidth: "40vh",
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {pageData.subHeadCoverImage ? (
              <img
                src={deriveImage(pageData.subHeadCoverImage)}
                alt="Not Available"
                width="100%"
                height="100%"
              />
            ) : (
              <ImagePlaceholder style={{ position: "absolute" }} />
            )}

            <ImageEdit
              style={{ position: "absolute", right: 10, cursor: "pointer" }}
              title="Edit Story Image"
              value={pageData.subHeadCoverImage}
              onChange={(url) =>
                setPageData((val) => val && { ...val, subHeadCoverImage: url })
              }
            />
          </div>
        </div> */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", padding: 10 }}>
            {pageData.subHeadInfo ? (
              parseQuillHtml(derive(pageData.subHeadInfo))
            ) : (
              <TextPlaceholder />
            )}
            <MultiLangTextEdit
              rich
              title="Edit Subscription Header"
              value={pageData.subHeadInfo}
              onChange={(updated) =>
                setPageData((val) => val && { ...val, subHeadInfo: updated })
              }
            />
          </div>
        </div>
      </div>
      {roles.admin && (
        <div style={{ margin: 20 }}>
          {saving || uploadingImg || uploadingPdf ? (
            "Saving...."
          ) : (
            <button onClick={saveData}>Save Page Details</button>
          )}
        </div>
      )}
      <div
        css={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          css={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {subscriptionPackages?.map((item, index) => (
            <>
              <SubscribePackage
                key={index}
                value={item}
                onChange={(updated) => {
                  const uploadedImage = mapImageToPromise(
                    updated.image,
                    uploadImageData
                  );
                  const uploadedPdf = mapImageToPromise(
                    updated.pdf || {},
                    uploadPdfData
                  );

                  Promise.all([uploadedImage, uploadedPdf]).then(
                    ([imgUrl, pdfUrl]) => {
                      const finalObj = {
                        ...updated,
                        image: imgUrl || "",
                        pdf: pdfUrl || "",
                      };

                      articleApi
                        .updateSubscriptionPackage(finalObj)
                        .then(() => {
                          setSubscriptionPackages((val) => {
                            const current = val ? [...val] : [];
                            current[index] = finalObj;
                            return current;
                          });
                        });
                    }
                  );
                }}
                onRemove={() => {
                  articleApi.removeSubscriptionPackage(item.id).then(() => {
                    setSubscriptionPackages((val) => {
                      const current = val ? [...val] : [];
                      const updated = current.filter((_, i) => i !== index);
                      return updated;
                    });
                  });
                }}
              />
            </>
          ))}
        </div>
        {roles.admin && (
          <div
            css={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div>
              The values you can see inside box for packages, won't be shown in
              user mode, and will be used to perform transaction
            </div>
            <button
              onClick={() =>
                articleApi.addSubscriptionPackage().then((item) => {
                  setSubscriptionPackages((packages) =>
                    packages?.concat({ id: item.id } as SubscriptionPackage)
                  );
                })
              }
            >
              Add Package
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribe;
