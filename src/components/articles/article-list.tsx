import { useEffect, useState } from "react";
import { Article } from "src/model/article";
import * as api from "src/api/article";
import ArticleSummary from "./article-summary";
import { useHistory } from "react-router-dom";

interface Iprops {
  category: string;
}
const ArticleList = ({ category }: Iprops) => {
  const [articles, setArticles] = useState<Article[]>([]);

  const history = useHistory();

  useEffect(() => {
    console.log("loading.... ");
    api.getArticles([category]).then(setArticles);
  }, [category]);

  const addItem = () => {
    api.addArticle({ category, date: new Date() } as Article).then((val) => {
      if (val?.id) history.push(`/article-content/${val.id}`);
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
