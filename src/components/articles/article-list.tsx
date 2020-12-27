import { useEffect, useState } from "react";
import { Article } from "src/model/article";
import * as api from "src/api/article";
import ArticleSummary from "./article-summary";
import { useHistory } from "react-router-dom";

interface Iprops {
  category: string;
}

const pagingCache: Record<string, Article[][]> = {};

const storePrevPage = (categories: string[], data: Article[]) => {
  const key = JSON.stringify(categories);
  const array = pagingCache[key] || [];
  array.push(data);
  pagingCache[key] = array;
};

const storeNextPage = (categories: string[], data: Article[]) => {
  const key = JSON.stringify(categories) + "__next__";
  const array = pagingCache[key] || [];
  array.push(data);
  pagingCache[key] = array;
};

const getCachedPrevPage = (categories: string[]) => {
  const key = JSON.stringify(categories);
  const array = pagingCache[key] || [];
  return array.pop() || [];
};

const getCachedNextPage = (categories: string[]) => {
  const key = JSON.stringify(categories) + "__next__";
  const array = pagingCache[key] || [];
  return array.pop();
};

const clearCache = (categories: string[]) => {
  const key = JSON.stringify(categories);
  delete pagingCache[key];
};

const ArticleList = ({ category }: Iprops) => {
  const [articles, setArticles] = useState<Article[]>([]);

  const history = useHistory();

  useEffect(() => {
    console.log("loading.... ");
    const categories = [category];
    api.resetPagingFor(categories);
    clearCache(categories);
    api.getArticles(categories, 1).then(setArticles);
  }, [category]);

  const nextPage = () => {
    storePrevPage([category], articles);
    const cachedNext = getCachedNextPage([category]);
    console.log({ cachedNext, pagingCache });
    if (cachedNext) {
      setArticles(cachedNext);
    } else {
      api.getArticles([category], 1).then(setArticles);
    }
  };

  const prevPage = () => {
    storeNextPage([category], articles);
    setArticles(getCachedPrevPage([category]));
  };

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
      <button onClick={prevPage}>prev page</button>
      <button onClick={nextPage}>next page</button>
    </div>
  );
};

export default ArticleList;
