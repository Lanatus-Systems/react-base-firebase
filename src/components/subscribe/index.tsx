/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
import { AuthContext, LayoutContext } from "src/context";
import { useAsync, useMultiLanguage } from "src/hooks";
import { SubscribePage } from "src/model/app-pages";
import * as api from "../../api/app-pages";
import ImageEdit from "../editables/ImageEdit";
import ImagePlaceholder from "../image-placeholder";
import Loading from "../Loading";
import TextPlaceholder from "../text-placeholder";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";
import parseQuillHtml from "src/utils/quill-parser";
import { uploadImage } from "src/api/storage";
import { mapImageToPromise } from "../articles/article-content";

const Subscribe = () => {
  const { isMobile } = useContext(LayoutContext);

  const { roles } = useContext(AuthContext);

  const { deriveImage, derive } = useMultiLanguage();
  const [pageData, setPageData] = useState<SubscribePage>();

  const [saveSubscriptionPageData, saving] = useAsync(api.savePageData);

  const [uploadImageData, uploadingImg] = useAsync(uploadImage);

  useEffect(() => {
    api.getSubscribePageData().then(setPageData);
  }, []);

  console.log({ pageData });
  const saveData = () => {
    if (pageData != null) {
      mapImageToPromise(pageData.subHeadCoverImage, uploadImageData).then(
        (resolvedImage) => {
          console.log({ resolvedImage, pageData });
          saveSubscriptionPageData({
            ...pageData,
            subHeadCoverImage: resolvedImage,
          });
        }
      );
    }
  };

  if (pageData == null) {
    return <Loading />;
  }
  return (
    <div>
      <div
        style={{
          display: "flex",
          padding: isMobile ? "5vw" : "5vw 20vw",
          flexDirection: isMobile ? "column" : "row",
          // width: "100%",
        }}
      >
        <div css={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              // maxWidth: isMobile ? "50vw" : 300,
              width: 200,
              maxHeight: "30vh",
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
        </div>
        <div style={{ position: "relative", padding: 10 }}>
          <div>
            {pageData.subHeadInfo ? (
              <div className="ql-editor">
                {parseQuillHtml(derive(pageData.subHeadInfo))}
              </div>
            ) : (
              <TextPlaceholder />
            )}
            <MultiLangTextEdit
              rich
              title="Edit Detail"
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
          {saving || uploadingImg ? (
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
