/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Article, ArticleDetail, Content, Story } from "src/model/article";
import * as api from "src/api/article";
import { uploadImage } from "src/api/storage";
import { useAsync, useMultiLanguage } from "src/hooks";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";
import { GlobalContext } from "src/context";

import dayjs from "dayjs";

import parseHtml from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import StoryItem from "./story-item";
import ContentItem from "./content-item";
import TextEdit from "../editables/TextEdit";
import ImageEdit from "../editables/ImageEdit";

interface Iparams {
  id: string;
}
interface IrouteState {
  article: Article;
}

interface Iprops {}
const ArticleContent = (props: Iprops) => {
  const { id } = useParams<Iparams>();

  const location = useLocation<IrouteState>();

  const { derive } = useMultiLanguage();

  const { categoryMap, categories } = useContext(GlobalContext);

  const [article, setArticle] = useState<Article>(location.state?.article);
  const [articleContent, setArticleContent] = useState<ArticleDetail>();

  useEffect(() => {
    if (location.state?.article == null) {
      api.getArticle(id).then(setArticle);
    }
    api.getArticleContent(id).then(setArticleContent);
  }, [id, location]);

  const [uploadImageData, loadingImg] = useAsync(uploadImage);
  const [updateArticle, loadingArt] = useAsync(api.updateArticle);
  const [updateArticleContent, loadingArtC] = useAsync(
    api.updateArticleContent
  );

  console.log({ article, articleContent });
  const saveData = () => {
    console.log({ article, articleContent });

    let imageUrl = new Promise<string>((resolve) => resolve(article.image));

    if (article.image && article.image.startsWith("blob:")) {
      imageUrl = fetch(article.image)
        .then((r) => r.blob())
        .then((file) => uploadImageData(file));
    }
    imageUrl.then((url) => {
      console.log({ url });
      updateArticle({ ...article, image: url });
    });

    if (articleContent != null) {
      const uploadedContent = Promise.all(
        articleContent.content
          .map((content) => content.image)
          .map((url) =>
            url && url.startsWith("blob:")
              ? fetch(url)
                  .then((r) => r.blob())
                  .then((file) => uploadImageData(file))
              : new Promise<string | undefined>((resolve) => resolve(url))
          )
      ).then((urls) => {
        return articleContent.content.map((item, index) =>
          urls[index]
            ? {
                ...item,
                image: urls[index],
              }
            : item
        );
      });

      const uploadedStories = Promise.all(
        articleContent.stories
          .map((story) => story.image)
          .map((url) =>
            url.startsWith("blob:")
              ? fetch(url)
                  .then((r) => r.blob())
                  .then((file) => uploadImageData(file))
              : new Promise<string>((resolve) => resolve(url))
          )
      ).then((urls) => {
        return articleContent.stories.map((story, index) => ({
          ...story,
          image: urls[index] || "-",
        }));
      });

      Promise.all([uploadedContent, uploadedStories]).then(
        ([contentList, stories]) => {
          const finalContent = {
            ...articleContent,
            content: contentList,
            stories,
          };
          updateArticleContent(finalContent);
        }
      );
    }
  };

  return (
    <div key={id} css={{ padding: "5vw" }}>
      <div css={{ display: "flex", borderBottom: "2px solid lightgrey" }}>
        <div
          css={{
            display: "flex",
            // flexDirection: "column",
            width: "50vw",
            justifyContent: "center",
            padding: 30,
          }}
        >
          <div
            css={{
              width: "100%",
              position: "relative",
            }}
          >
            {article?.image && (
              <img
                src={article.image}
                alt="welcome"
                width="100%"
                height="100%"
              />
            )}

            <ImageEdit
              style={{ position: "absolute", right: 10, cursor: "pointer" }}
              title="Edit Cover Image"
              value={article?.image}
              onChange={(url) => setArticle((val) => ({ ...val, image: url }))}
            />
          </div>
        </div>
        <div
          css={{
            display: "flex ",
            flexDirection: "column",
            width: "50vw",
            padding: 30,
          }}
        >
          {article && (
            <div
              css={{
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
            >
              <div style={{ margin: 10 }}>
                {derive(categoryMap[article.category]?.label)}
                <select
                  value={article.category}
                  onChange={(e) =>
                    setArticle((val) => ({
                      ...val,
                      category: e.target.value,
                    }))
                  }
                >
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {derive(categoryMap[item.id]?.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ padding: 10, fontSize: 40 }}>
                {derive(article.title)}
                <MultiLangTextEdit
                  multiline
                  title="Edit Title"
                  value={article.title}
                  onChange={(updated) =>
                    setArticle((val) => ({ ...val, title: updated }))
                  }
                />
              </div>
              <div>
                {`By ${article.author || "-"}`}{" "}
                <TextEdit
                  title="Edit Author"
                  value={article.author}
                  onChange={(updated) =>
                    setArticle((val) => ({ ...val, author: updated }))
                  }
                />
              </div>
              <div>
                {dayjs(article.date).format("DD MMMM YYYY")}
                <TextEdit
                  title="Edit Date"
                  type="datetime-local"
                  value={dayjs(article.date).format("YYYY-MM-DDTHH:mm:ss")}
                  onChange={(updated) =>
                    setArticle((val) => ({ ...val, date: new Date(updated) }))
                  }
                />
              </div>
              {articleContent && (
                <div>
                  <div style={{ margin: 10 }}>
                    {parseHtml(derive(articleContent.detail))}
                    <MultiLangTextEdit
                      rich
                      title="Edit Detail"
                      value={articleContent.detail}
                      onChange={(updated) =>
                        setArticleContent(
                          (val) => val && { ...val, detail: updated }
                        )
                      }
                    />
                  </div>
                  <div
                    css={{
                      marginTop: 50,
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      css={{
                        width: 200,
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faFacebook}
                        size="3x"
                        css={{
                          backgroundColor: "black",
                          color: "white",
                          borderRadius: 25,
                        }}
                      />
                      <FontAwesomeIcon icon={faTwitter} size="3x" />
                      <FontAwesomeIcon
                        icon={faPinterest}
                        size="3x"
                        css={{
                          backgroundColor: "black",
                          color: "white",
                          borderRadius: 25,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div css={{ paddingRight: "10vw", paddingLeft: "10vw" }}>
          {articleContent?.content?.map((item, index) => (
            <ContentItem
              value={item}
              onChange={(item) =>
                setArticleContent((val) => {
                  if (val == null) {
                    return val;
                  }
                  const current = val.content || [];
                  current[index] = item;
                  return { ...val, content: current };
                })
              }
            />
          ))}
        </div>
        <button
          onClick={() =>
            setArticleContent((val) => {
              if (val == null) return val;
              return {
                ...val,
                content: [...(val.content || []), { type: "text" } as Content],
              };
            })
          }
        >
          Add Content
        </button>
      </div>

      <div>
        <div style={{ padding: 20 }}>
          {articleContent?.stories?.map((item, index) => (
            <StoryItem
              value={item}
              onChange={(item) =>
                setArticleContent((val) => {
                  if (val == null) {
                    return val;
                  }
                  const current = val.stories || [];
                  current[index] = item;
                  return { ...val, stories: current };
                })
              }
            />
          ))}
        </div>
        <button
          onClick={() =>
            setArticleContent((val) => {
              if (val == null) return val;
              return {
                ...val,
                stories: [...(val.stories || []), {} as Story],
              };
            })
          }
        >
          Add Story
        </button>
      </div>

      <div style={{ margin: 20 }}>
        {loadingImg || loadingArt || loadingArtC ? (
          "Saving...."
        ) : (
          <button onClick={saveData}>Save</button>
        )}
      </div>
    </div>
  );
};

export default ArticleContent;
