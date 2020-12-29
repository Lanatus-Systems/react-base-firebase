/** @jsxImportSource @emotion/react */
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

const PAGE_SIZE = 24;

const ArticleList = ({ category }: Iprops) => {
  const history = useHistory();
  const [articles, setArticles] = useState<Article[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const { subCategoryMap } = useContext(GlobalContext);

  const derivedCategories = useMemo(() => {
    const subcategories =
      Object.keys(subCategoryMap).length > 0
        ? subCategoryMap[category]?.map((item) => item.id)
        : undefined;

    return [category, ...(subcategories || [])];
  }, [category, subCategoryMap]);

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

  const articleGroups = useMemo(() => {
    return articles.reduce((acc: Article[][], val, index) => {
      const groupId = Math.floor(index / 6);
      const current = acc[groupId] || [];
      current.push(val);
      acc[groupId] = current;
      return acc;
    }, []);
  }, [articles]);

  console.log({ articleGroups });

  return (
    <div>
      <button onClick={addItem}>Add</button>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {articleGroups.map((groupList, index) => {
          const first = groupList[0];
          const second = groupList[1];
          const third = groupList[2];
          const forth = groupList[3];
          const fifth = groupList[4];
          const sixth = groupList[5];

          const firstColumn = [first];
          const secondColumn = [second, forth, sixth].filter((item) => item);
          const thirdColumn = [third, fifth].filter((item) => item);

          return (
            <div
              key={index}
              css={{
                display: "flex",
                margin: 20,
                justifyContent: "center",
              }}
            >
              <div
                css={{
                  display: "flex",
                  width: "40vw",
                  flexDirection: "column",
                }}
              >
                {firstColumn.map((item) => (
                  <ArticleSummary
                    key={item.id}
                    article={item}
                    height={450}
                    variant="lg"
                  />
                ))}
              </div>
              <div
                css={{
                  display: "flex",
                  width: "20vw",
                  flexDirection: "column",
                }}
              >
                {secondColumn.map((item, index) => (
                  <ArticleSummary
                    key={item.id}
                    article={item}
                    variant={index === 2 ? "md" : "sm"}
                  />
                ))}
              </div>
              <div
                css={{
                  display: "flex",
                  width: "20vw",
                  flexDirection: "column",
                }}
              >
                {thirdColumn.map((item) => (
                  <ArticleSummary key={item.id} article={item} variant="md" />
                ))}
              </div>
            </div>
          );
        })}
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
