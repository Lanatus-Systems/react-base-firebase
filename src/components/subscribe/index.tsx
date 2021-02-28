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

const MagazineSlider = lazy(() => import("./magazine-slider"));

const Subscribe = () => {
  // const { isMobile } = useContext(LayoutContext);

  const { roles } = useContext(AuthContext);

  const { derive } = useMultiLanguage();
  const [pageData, setPageData] = useState<SubscribePage>();

  const [saveSubscriptionPageData, saving] = useAsync(api.savePageData);

  const [uploadImageData, uploadingImg] = useAsync(uploadImage);
  const [uploadPdfData, uploadingPdf] = useAsync(uploadPdf);

  useEffect(() => {
    api.getSubscribePageData().then(setPageData);
  }, []);

  console.log({ pageData });
  const saveData = () => {
    if (pageData != null) {
      const uploadedImages = Promise.all(
        pageData.packages
          .map((pkg) => pkg.image)
          .map((image) => image && mapImageToPromise(image, uploadImageData))
      );

      const uploadedPdfs = Promise.all(
        pageData.packages
          .map((pkg) => pkg.pdf)
          .map((pdf) => pdf && mapImageToPromise(pdf, uploadPdfData))
      );

      const uploadedPackages = Promise.all([uploadedImages, uploadedPdfs]).then(
        ([imgUrls, pdfUrls]) => {
          return pageData.packages.map((item, index) => ({
            ...item,
            image: imgUrls[index] || {},
            pdf: pdfUrls[index] || {},
          }));
        }
      );

      const uploadedSlides = Promise.all(
        pageData.sliderImages.map(
          (image) => image && mapImageToPromise(image, uploadImageData)
        )
      ).then((urls) => {
        return pageData.sliderImages.map((item, index) => urls[index]);
      });

      // const uploadedPdfs = Promise.all(
      //   pageData.packages
      //     .map((pkg) => pkg.pdf)
      //     .map((pdf) => pdf && mapImageToPromise(pdf, uploadPdfData))
      // ).then((urls) => {
      //   return pageData.packages.map((item, index) => ({
      //     ...item,
      //     pdf: urls[index] || {},
      //   }));
      // });

      Promise.all([
        mapImageToPromise(pageData.subHeadCoverImage, uploadImageData),
        uploadedSlides,
        uploadedPackages,
      ]).then(([resolvedImage, slides, packages]) => {
        console.log({ resolvedImage, slides, pageData, packages });
        saveSubscriptionPageData({
          ...pageData,
          sliderImages: slides,
          subHeadCoverImage: resolvedImage,
          packages: packages,
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
          {pageData.packages?.map((item, index) => (
            <SubscribePackage
              key={index}
              value={item}
              onChange={(item) =>
                setPageData((val) => {
                  if (val == null) {
                    return val;
                  }
                  const current = val.packages || [];
                  current[index] = item;
                  return { ...val, packages: current };
                })
              }
              onRemove={() =>
                setPageData((val) => {
                  if (val == null) {
                    return val;
                  }
                  const current = val.packages || [];
                  const updated = current.filter((_, i) => i !== index);
                  return { ...val, packages: updated };
                })
              }
            />
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
                setPageData((val) => {
                  if (val == null) return val;
                  const current = val.packages || [];
                  const updated = current.concat({} as SubscriptionPackage);
                  return {
                    ...val,
                    packages: updated,
                  };
                })
              }
            >
              Add Package
            </button>
          </div>
        )}
      </div>
      {roles.admin && (
        <div style={{ margin: 20 }}>
          {saving || uploadingImg || uploadingPdf ? (
            "Saving...."
          ) : (
            <button onClick={saveData}>Save</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Subscribe;
