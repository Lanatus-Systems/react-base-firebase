/** @jsxImportSource @emotion/react */
import { Content, ContentType } from "src/model/article";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";
import { useMultiLanguage } from "src/hooks";
import TextEdit from "../editables/TextEdit";
import { useContext, useEffect, useState } from "react";

import { Article } from "src/model/article";

import * as api from "src/api/article";
import { MultiLanguage } from "src/model/common";
import ImageEdit from "../editables/ImageEdit";
import ImagePlaceholder from "../image-placeholder";
import TextPlaceholder from "../text-placeholder";
import { AuthContext, LayoutContext } from "src/context";
import { PlainLink } from "src/base";

import ReactPlayer from "react-player/lazy";
import VideoPlaceholder from "../video-placeholder";
import parseQuillHtml from "src/utils/quill-parser";

interface Iprops {
  value: Content;
  onChange: (item: Content) => void;
  onRemove: () => void;
}

const ContentItem = ({ value, onChange, onRemove }: Iprops) => {
  const { derive, deriveImage, deriveVideo, localize } = useMultiLanguage();

  const { roles } = useContext(AuthContext);

  const { isMobile } = useContext(LayoutContext);

  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    if (value.id) {
      api.getArticle(value.id).then(setArticle);
    }
  }, [value.id]);

  return (
    <div
      style={{
        padding: isMobile ? "2vw 0vw" : 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: value.type === "article" ? 100 : 250,
        width: isMobile ? "90vw" : "70vw",
      }}
    >
      {roles.editor && (
        <div>
          <select
            value={value.type}
            onChange={(e) =>
              onChange({ ...value, type: e.target.value as ContentType })
            }
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="article">Article</option>
          </select>
          <button
            onClick={() => {
              window.confirm("Are you sure you want to remove content?") &&
                onRemove();
            }}
          >
            remove
          </button>
        </div>
      )}
      {value.type === "text" && (
        <div style={{ width: isMobile ? "100%" : "70%", position: "relative" }}>
          {value.content ? (
            parseQuillHtml(derive(value.content as MultiLanguage))
          ) : (
            <TextPlaceholder />
          )}
          <MultiLangTextEdit
            rich
            title="Edit Content"
            value={value.content as MultiLanguage}
            onChange={(updated) => onChange({ ...value, content: updated })}
          />
        </div>
      )}

      {value.type === "article" && (
        <div
          style={{
            width: isMobile ? "" : "70%",
            position: "relative",
          }}
        >
          {article && (
            <PlainLink to={`/article-content/${article.id}`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid lightgrey",
                  borderBottom: "1px solid lightgrey",
                  width: isMobile ? "" : "100%",
                  padding: 10,
                }}
              >
                <div
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "flex-start",
                  }}
                >
                  <div>{localize("read_more")}</div>
                  <div css={{ fontSize: 20 }}>{derive(article.title)}</div>
                  <div>By {article.author}</div>
                </div>
                <img
                  src={deriveImage(article.image)}
                  width="100px"
                  height="100px"
                  alt="resource"
                />
              </div>
            </PlainLink>
          )}
          <TextEdit
            title="Provide Article Id"
            value={value.id || ""}
            onChange={(updated) => onChange({ ...value, id: updated })}
          />
        </div>
      )}

      {value.type === "image" && (
        <div
          style={{
            display: "flex",
            padding: isMobile ? "" : "2vw",
            flexDirection: isMobile ? "column" : "row",
            width: "100%",
          }}
        >
          <div
            style={{
              maxWidth: isMobile ? "90vw" : "50vw",
              maxHeight: "90vh",
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {value.image ? (
              <img
                src={deriveImage(value.image)}
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
              value={value.image || {}}
              onChange={(url) => onChange({ ...value, image: url })}
            />
          </div>
          <div style={{ position: "relative", padding: 10 }}>
            <div css={{ width: "5vw", borderTop: "5px solid red" }} />
            <div>
              {value.content ? (
                parseQuillHtml(derive(value.content as MultiLanguage))
              ) : (
                <TextPlaceholder />
              )}
              <MultiLangTextEdit
                rich
                title="Edit Detail"
                value={value.content as MultiLanguage}
                onChange={(updated) => onChange({ ...value, content: updated })}
              />
            </div>
          </div>
        </div>
      )}

      {value.type === "video" && (
        <div style={{ width: isMobile ? "100%" : "70%", position: "relative" }}>
          {value.video &&
          deriveVideo(value.video as MultiLanguage).startsWith("http") ? (
            // Lazy load the YouTube player
            <ReactPlayer
              url={deriveVideo(value.video as MultiLanguage)}
              controls
              width="100%"
              height={isMobile ? "60vw" : "30vw"}
            />
          ) : (
            <VideoPlaceholder />
          )}
          <MultiLangTextEdit
            title="Provide Video links"
            value={value.video as MultiLanguage}
            onChange={(updated) => onChange({ ...value, video: updated })}
          />
        </div>
      )}
    </div>
  );
};

export default ContentItem;
