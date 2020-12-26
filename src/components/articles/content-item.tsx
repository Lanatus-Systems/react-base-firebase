import { Content, ContentType } from "src/model/article";
import parseHtml from "html-react-parser";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";
import { useMultiLanguage } from "src/hooks";
import TextEdit from "../editables/TextEdit";
import { useEffect, useState } from "react";

import { Article } from "src/model/article";

import * as api from "src/api/article";
import { MultiLanguage } from "src/model/common";
import ImageEdit from "../editables/ImageEdit";

interface Iprops {
  value: Content;
  onChange: (item: Content) => void;
}

const ContentItem = ({ value, onChange }: Iprops) => {
  const { derive } = useMultiLanguage();

  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    if (value.id) {
      api.getArticle(value.id).then(setArticle);
    }
  }, [value.id]);

  return (
    <div style={{ padding: 10 }}>
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
      {value.type === "text" && (
        <div>
          {parseHtml(derive(value.content as MultiLanguage))}
          <MultiLangTextEdit
            rich
            title="Edit Content"
            value={value.content as MultiLanguage}
            onChange={(updated) => onChange({ ...value, content: updated })}
          />
        </div>
      )}

      {value.type === "article" && (
        <div>
          {article && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div>{derive(article.title)}</div>
                <div>By {article.author}</div>
              </div>
              <img
                src={article.image}
                width="100px"
                height="100px"
                alt="resource"
              />
            </div>
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
          }}
        >
          <div
            style={{
              width: "80%",
              position: "relative",
            }}
          >
            {value?.image && (
              <img src={value.image} alt="welcome" width="100%" height="100%" />
            )}

            <ImageEdit
              style={{ position: "absolute", right: 10, cursor: "pointer" }}
              title="Edit Story Image"
              value={value.image || ""}
              onChange={(url) => onChange({ ...value, image: url })}
            />
          </div>
          <div>
            {parseHtml(derive(value.content as MultiLanguage))}
            <MultiLangTextEdit
              rich
              title="Edit Detail"
              value={value.content as MultiLanguage}
              onChange={(updated) => onChange({ ...value, content: updated })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentItem;
