import { useContext, useEffect, useMemo, useState } from "react";
import { Article } from "src/model/article";
import * as api from "src/api/article";
import ArticleSummary from "./article-summary";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "src/context";

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

const PAGE_SIZE = 3;

const ArticleList = ({ category }: Iprops) => {
  const [articles, setArticles] = useState<Article[]>([]);

  const { subCategoryMap } = useContext(GlobalContext);

  const derivedCategories = useMemo(() => {
    const subcategories =
      Object.keys(subCategoryMap).length > 0
        ? subCategoryMap[category]?.map((item) => item.id)
        : undefined;

    return [category, ...(subcategories || [])];
  }, [category, subCategoryMap]);

  const [currentPage, setCurrentPage] = useState(1);

  const history = useHistory();

  useEffect(() => {
    console.log("loading.... ");

    // console.log({ derivedCategories });
    api.resetPagingFor(derivedCategories);

    clearCache(derivedCategories);

    api.getArticles(derivedCategories, PAGE_SIZE).then(setArticles);

    setCurrentPage(1);
  }, [derivedCategories]);

  const nextPage = () => {
    storePrevPage(derivedCategories, articles);
    const cachedNext = getCachedNextPage(derivedCategories);
    console.log({ cachedNext, pagingCache });
    if (cachedNext) {
      setArticles(cachedNext);
    } else {
      api.getArticles(derivedCategories, PAGE_SIZE).then(setArticles);
    }
    setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    storeNextPage(derivedCategories, articles);
    setArticles(getCachedPrevPage(derivedCategories));
    setCurrentPage((p) => p - 1);
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
      <button onClick={prevPage} disabled={currentPage <= 1}>
        prev page
      </button>
      {currentPage}
      <button onClick={nextPage} disabled={articles.length === 0}>
        next page
      </button>
    </div>
  );
};

export default ArticleList;
