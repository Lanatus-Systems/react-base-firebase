/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Article, ArticleDetail, Content, Story } from "src/model/article";
import * as api from "src/api/article";
import { uploadImage } from "src/api/storage";
import { useAsync, useMultiLanguage } from "src/hooks";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";
import { AuthContext, GlobalContext, LayoutContext } from "src/context";

import dayjs from "dayjs";

import parseHtml from "html-react-parser";
import StoryItem from "./story-item";
import ContentItem from "./content-item";
import TextEdit from "../editables/TextEdit";
import ImageEdit from "../editables/ImageEdit";
import { MultiLanguage } from "src/model/common";
import { zipObj } from "ramda";
import ImagePlaceholder from "../image-placeholder";
import TextPlaceholder from "../text-placeholder";
import SocialMediaLinks from "../social-media-links";

interface Iparams {
  id: string;
}
interface IrouteState {
  article: Article;
}

interface Iprops {}

const mapImageToPromise = (
  image: MultiLanguage,
  uploadImage: (img: Blob) => Promise<string>
) => {
  return Promise.all(
    Object.values(image).map((item) =>
      item && item.startsWith("blob:")
        ? fetch(item)
            .then((r) => r.blob())
            .then((file) => uploadImage(file))
        : Promise.resolve(item || "")
    )
  ).then((results) => {
    return zipObj(Object.keys(image), results);
  });
};

const ArticleContent = (props: Iprops) => {
  const { id } = useParams<Iparams>();

  const location = useLocation<IrouteState>();

  const { derive, deriveImage } = useMultiLanguage();

  const { categoryMap, categories } = useContext(GlobalContext);

  const { isMobile } = useContext(LayoutContext);

  const { roles } = useContext(AuthContext);

  const [article, setArticle] = useState<Article>(location.state?.article);
  const [articleContent, setArticleContent] = useState<ArticleDetail>();

  useEffect(() => {
    if (location.state?.article == null) {
      api.getArticle(id).then(setArticle);
    }
    api.getArticleContent(id).then(setArticleContent);
    window.scrollTo(0, 0);
  }, [id, location]);

  const [uploadImageData, uploadingImg] = useAsync(uploadImage);
  const [updateArticle, loadingArt] = useAsync(api.updateArticle);
  const [updateArticleContent, loadingArtC] = useAsync(
    api.updateArticleContent
  );

  console.log({ article, articleContent });
  const saveData = () => {
    if (articleContent != null) {
      console.log({ article, articleContent });

      mapImageToPromise(article.image, uploadImageData).then(
        (resolvedImage) => {
          console.log({ resolvedImage });
          updateArticle({
            ...article,
            storyCount: articleContent.stories.length,
            image: resolvedImage,
          });
        }
      );

      const uploadedContent = Promise.all(
        articleContent.content
          .map((content) => content.image)
          .map((image) => image && mapImageToPromise(image, uploadImageData))
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
          .map((image) => image && mapImageToPromise(image, uploadImageData))
      ).then((urls) => {
        return articleContent.stories.map((item, index) => ({
          ...item,
          image: urls[index] || {},
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
    <div key={id} css={{ padding: isMobile ? "5vw 0vw" : "3vw 5vw" }}>
      <div
        css={{
          display: "flex",
          borderBottom: "2px solid lightgrey",
          flexDirection: isMobile ? "column" : "row",
          padding: isMobile ? "5vw 0vw" : "",
        }}
      >
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            width: isMobile ? "100vw" : "50vw",
            minHeight: 300,
            justifyContent: "center",
            padding: isMobile ? 0 : "2vw",
          }}
        >
          <div
            css={{
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            {!isMobile && (
              <div
                css={{
                  height: "10%",
                  width: "100%",
                  position: "absolute",
                  top: "-3%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  css={{
                    backgroundColor: "rgb(238, 0, 0)",
                    width: "30%",
                    height: "100%",
                    mixBlendMode: "multiply",
                    opacity: 1,
                  }}
                />
              </div>
            )}
            {deriveImage(article?.image) ? (
              <img
                src={deriveImage(article.image)}
                alt="Not Available"
                width="100%"
                height="100%"
              />
            ) : (
              <ImagePlaceholder />
            )}
            <ImageEdit
              title="Edit Cover Image"
              value={article?.image}
              onChange={(url) => setArticle((val) => ({ ...val, image: url }))}
            />
          </div>
        </div>
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            width: isMobile ? "96vw" : "50vw",
            padding: isMobile ? "2vw" : "2vw",
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
              <div
                style={{
                  margin: 10,
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "bold",
                  color: "rgb(108, 110, 112)",
                }}
              >
                {roles.editor ? (
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
                ) : (
                  derive(
                    categoryMap[article.category]?.label
                  ).toLocaleUpperCase()
                )}
              </div>
              <div style={{ padding: 10, position: "relative" }}>
                <span css={{ fontSize: 40 }}>{derive(article.title)}</span>
                <MultiLangTextEdit
                  multiline
                  title="Edit Title"
                  value={article.title}
                  onChange={(updated) =>
                    setArticle((val) => ({ ...val, title: updated }))
                  }
                />
              </div>
              <div css={{ display: "flex", justifyContent: "center" }}>
                <div
                  css={{
                    borderTop: "4px solid red",
                    width: "10%",
                    marginTop: 15,
                  }}
                />
              </div>
              <div css={{ position: "relative", padding: 5 }}>
                <div
                  css={{
                    padding: 1,
                    fontFamily: "'Montserrat', sans-serif",
                    color: "rgb(108, 110, 112)",
                    fontSize: 14,

                    fontWeight: "bold",
                  }}
                >
                  {`By ${article.author || "-"}`}{" "}
                </div>
                <TextEdit
                  title="Edit Author"
                  value={article.author}
                  onChange={(updated) =>
                    setArticle((val) => ({ ...val, author: updated }))
                  }
                />
              </div>
              <div css={{ position: "relative", padding: 5 }}>
                <div
                  css={{
                    padding: 1,
                    fontFamily: "'Montserrat', sans-serif",
                    color: "rgb(108, 110, 112)",
                    fontSize: 14,
                  }}
                >
                  {dayjs(article.date)
                    .format("DD MMMM YYYY")
                    .toLocaleUpperCase()}
                </div>
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
                  {(articleContent.detail || roles.editor) && (
                    <div
                      css={{
                        display: "flex",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      {articleContent.detail ? (
                        parseHtml(derive(articleContent.detail))
                      ) : (
                        <TextPlaceholder style={{ height: 50 }} />
                      )}
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
                  )}
                  <div
                    css={{
                      marginTop: isMobile ? 20 : 50,
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
                      <SocialMediaLinks />
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
          borderBottom: "2px solid lightgrey",
        }}
      >
        <div css={{ padding: isMobile ? "" : "0vw 10vw" }}>
          {articleContent?.content?.map((item, index) => (
            <ContentItem
              key={index}
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
              onRemove={() =>
                setArticleContent((val) => {
                  if (val == null) {
                    return val;
                  }
                  const current = val.content || [];
                  const updated = current.filter((_, i) => i !== index);
                  return { ...val, content: updated };
                })
              }
            />
          ))}
        </div>
        {roles.editor && (
          <button
            onClick={() => {
              console.log("clicked....");
              // setArticleContent(val => {

              //   console.log({val})
              //   return val
              // })
              setArticleContent((val) => {
                if (val == null) return val;
                const current = val.content || [];
                const updated = current.concat({ type: "text" } as Content);
                return {
                  ...val,
                  content: updated,
                };
              });
            }}
          >
            Add Content
          </button>
        )}
      </div>

      <div>
        <div style={{ padding: isMobile ? 0 : 20, margin: "5vh 0vw" }}>
          {articleContent?.stories?.map((item, index, all) => (
            <StoryItem
              key={index}
              storyIndex={index + 1}
              storyCount={all.length}
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
              onRemove={() =>
                setArticleContent((val) => {
                  if (val == null) {
                    return val;
                  }
                  const current = val.stories || [];
                  const updated = current.filter((_, i) => i !== index);
                  return { ...val, stories: updated };
                })
              }
            />
          ))}
        </div>
        {roles.editor && (
          <button
            onClick={() =>
              setArticleContent((val) => {
                if (val == null) return val;
                const current = val.stories || [];
                const updated = current.concat({} as Story);
                return {
                  ...val,
                  stories: updated,
                };
              })
            }
          >
            Add Story
          </button>
        )}
      </div>

      {roles.editor && (
        <div style={{ margin: 20 }}>
          {uploadingImg || loadingArt || loadingArtC ? (
            "Saving...."
          ) : (
            <button onClick={saveData}>Save</button>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleContent;
