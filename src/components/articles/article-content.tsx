import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Article, ArticleDetail } from "src/model/article";
import * as api from "src/api/article";
import { uploadImage } from "src/api/storage";
import { useAsync, useMultiLanguage } from "src/hooks";
import TextEdit from "../editables/TextEdit";
import { GlobalContext } from "src/context";

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

  const [file, setFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>();
  useEffect(() => {
    const url = file && URL.createObjectURL(file);
    url && setImageUrl(url);
    return () => {
      url && URL.revokeObjectURL(url);
    };
  }, [file]);

  const [uploadImageData, loadingImg] = useAsync(uploadImage);
  const [updateArticle, loadingArt] = useAsync(api.updateArticle);
  const [updateArticleContent, loadingArtC] = useAsync(
    api.updateArticleContent
  );

  console.log({ article, articleContent });
  const saveData = () => {
    if (file) {
      uploadImageData(file).then((url) => {
        updateArticle({ ...article, image: url });
        if (articleContent != null) {
          updateArticleContent(articleContent);
        }
      });
    } else {
      updateArticle(article);
      if (articleContent != null) {
        updateArticleContent(articleContent);
      }
    }
  };

  console.log({ file });
  return (
    <div key={id} style={{ margin: 10 }}>
      {article && (
        <>
          <div>
            <div style={{ padding: 10 }}>
              {derive(article.title)}
              <TextEdit
                title="Edit Title"
                value={article.title}
                onChange={(updated) =>
                  setArticle((val) => ({ ...val, title: updated }))
                }
              />
            </div>
            <div style={{ margin: 10 }}>
              {derive(categoryMap[article.category]?.label)}
              <select
                value={article.category}
                onChange={(e) =>
                  setArticle((val) => ({ ...val, category: e.target.value }))
                }
              >
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {derive(categoryMap[item.id]?.label)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {article?.image && (
            <img
              src={imageUrl || article.image}
              alt="welcome"
              width="200px"
              height="200px"
            />
          )}

          <input
            type="file"
            onChange={(e) => {
              const f = e.target.files;
              if (f != null) {
                setFile(f[0]);
              }
            }}
          />
        </>
      )}
      {articleContent && (
        <div>
          <div style={{ margin: 10 }}>
            {derive(articleContent.detail)}
            <TextEdit
              multiline
              title="Edit Detail"
              value={articleContent.detail}
              onChange={(updated) =>
                setArticleContent((val) => val && { ...val, detail: updated })
              }
            />
          </div>
        </div>
      )}

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
