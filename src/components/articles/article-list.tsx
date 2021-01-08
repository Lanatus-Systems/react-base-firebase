/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useMemo, useState } from "react";
import { Article } from "src/model/article";
import * as api from "src/api/article";
import ArticleSummary from "./article-summary";
import { useHistory } from "react-router-dom";
import { AuthContext, GlobalContext, LayoutContext } from "src/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";

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

  const { roles } = useContext(AuthContext);

  const { subCategoryMap } = useContext(GlobalContext);

  const { isMobile } = useContext(LayoutContext);

  const [currentPage, setCurrentPage] = useState(1);

  const derivedCategories = useMemo(() => {
    const subcategories =
      Object.keys(subCategoryMap).length > 0
        ? subCategoryMap[category]?.map((item) => item.id)
        : undefined;

    return [category, ...(subcategories || [])];
  }, [category, subCategoryMap]);

  // console.log({derivedCategories , category})
  useEffect(() => {
    console.log("loading.... ");

    console.log({ derivedCategories });
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

  const prevPageDisabled = currentPage <= 1;
  const nextPageDisabled = articles.length === 0;
  return (
    <div>
      {roles.editor && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={addItem}>Add New</button>
        </div>
      )}
      <div css={{ minHeight: "50vh", margin: isMobile ? 0 : "0px 10vw" }}>
        {nextPageDisabled ? (
          <div
            css={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <h1>No Stories Available</h1>
          </div>
        ) : (
          <div
            css={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {articleGroups.map((groupList, index) => {
              const first = groupList[0];
              const second = groupList[1];
              const third = groupList[2];
              const forth = groupList[3];
              const fifth = groupList[4];
              const sixth = groupList[5];

              const firstColumn = [first];
              const secondColumn = [second, forth, sixth].filter(
                (item) => item
              );
              const thirdColumn = [third, fifth].filter((item) => item);

              return (
                <div
                  key={index}
                  css={{
                    display: "flex",
                    margin: isMobile ? "5vw 0vw" : "2vw",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "center",
                  }}
                >
                  <div
                    css={{
                      display: "flex",
                      width: isMobile ? "100vw" : "34vw",
                      flexDirection: "column",
                    }}
                  >
                    {firstColumn.map((item) => (
                      <ArticleSummary
                        key={item.id}
                        article={item}
                        variant={isMobile ? "md" : "lg"}
                      />
                    ))}
                  </div>
                  <div
                    css={{
                      display: "flex",
                      width: isMobile ? "100vw" : "23vw",
                      flexDirection: "column",
                    }}
                  >
                    {secondColumn.map((item, index) => (
                      <div
                        css={{
                          borderBottom: isMobile ? "1px solid lightgrey" : "",
                          padding: isMobile ? "2vw" : 0,
                        }}
                      >
                        <ArticleSummary
                          key={item.id}
                          article={item}
                          variant={
                            isMobile ? "mobile" : index === 1 ? "md" : "sm"
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div
                    css={{
                      display: "flex",
                      width: isMobile ? "100vw" : "23vw",
                      flexDirection: "column",
                    }}
                  >
                    {thirdColumn.map((item) => (
                      <div
                        css={{
                          borderBottom: isMobile ? "1px solid lightgrey" : "",
                          padding: isMobile ? "2vw" : 0,
                        }}
                      >
                        <ArticleSummary
                          key={item.id}
                          article={item}
                          variant={isMobile ? "mobile" : "md"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div css={{ padding: "0px 40px" }}>
        <div
          css={{
            borderTop: "2px solid lightgrey",
            padding: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FontAwesomeIcon
            icon={faChevronCircleLeft}
            onClick={prevPageDisabled ? () => {} : prevPage}
            size="3x"
            css={{
              cursor: prevPageDisabled ? "unset" : "pointer",
              color: prevPageDisabled ? "lightgrey" : "red",
              ":hover": prevPageDisabled ? {} : { color: "black" },
            }}
          />
          <div
            css={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 80,
            }}
          >
            Page {currentPage}
          </div>
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            onClick={nextPageDisabled ? () => {} : nextPage}
            size="3x"
            css={{
              cursor: nextPageDisabled ? "unset" : "pointer",
              color: nextPageDisabled ? "lightgrey" : "red",
              ":hover": nextPageDisabled ? {} : { color: "black" },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
