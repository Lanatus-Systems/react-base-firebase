import { useEffect, useState } from "react";
import { Article } from "src/model/article";
import * as api from "src/api/article";
import ArticleSummary from "./article-summary";

interface Iprops {
  category: string;
}
const ArticleList = ({ category }: Iprops) => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    console.log("loading.... ");
    api.getArticles([category]).then(setArticles);
  }, [category]);

  const addItem = () => {
    api.addArticle({ category } as Article).then((val) => {
      api.getArticles([category]).then(setArticles);
    });
  };

  return (
    <div>
      <button onClick={addItem}>Add</button>
      <div style={{ display: "flex" }}>
        {articles.map((item) => (
          <ArticleSummary key={item.id} article={item} />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
