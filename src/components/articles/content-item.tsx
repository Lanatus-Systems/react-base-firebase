/** @jsxImportSource @emotion/react */
import { Content, ContentType } from "src/model/article";
import parseHtml from "html-react-parser";
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
import { AuthContext } from "src/context";
import { PlainLink } from "src/base";

interface Iprops {
  value: Content;
  onChange: (item: Content) => void;
}

const ContentItem = ({ value, onChange }: Iprops) => {
  const { derive, deriveImage, localize } = useMultiLanguage();

  const { roles } = useContext(AuthContext);

  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    if (value.id) {
      api.getArticle(value.id).then(setArticle);
    }
  }, [value.id]);

  return (
    <div
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: value.type === "article" ? 100 : 250,
        width: "70vw",
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
            <option value="article">Article</option>
          </select>
        </div>
      )}
      {value.type === "text" && (
        <div style={{ width: "70%", position: "relative" }}>
          {value.content ? (
            parseHtml(derive(value.content as MultiLanguage))
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
            width: "70%",
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
                  width: "100%",
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
            padding: 30,
            width: "100%",
          }}
        >
          <div
            style={{
              width: "70%",
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
                parseHtml(derive(value.content as MultiLanguage))
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
    </div>
  );
};

export default ContentItem;
