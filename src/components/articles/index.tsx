/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
import { Article } from "src/model/article";

import Sticky from "react-sticky-el";
import * as api from "src/api/article";
import { GlobalContext } from "src/context";
import ArticleSummary from "./article-summary";
import { useMultiLanguage } from "src/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { PlainLink } from "src/base";
interface Iprops {
  pageSize: number;
  categoryQueryString: string;
  variant: "vertical" | "horizontal";
  label: string;
  category: string;
}

const ArticleGroup = ({
  pageSize,
  categoryQueryString,
  variant,
  label,
  category,
}: Iprops) => {
  const [articles, setArticles] = useState<Article[]>([]);

  const { localize } = useMultiLanguage();

  useEffect(() => {
    const categories = JSON.parse(categoryQueryString) as string[];

    if (categories.length !== 0) {
      console.log({ categoryQueryString });
      api.resetPagingFor(categories);
      api.getArticles(categories, pageSize).then(setArticles);
    }
  }, [categoryQueryString, pageSize]);

  if (articles.length === 0) {
    return null;
  }

  console.log({ variant });
  if (variant === "horizontal") {
    return (
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          borderBottom: "1px solid black",
          position: "relative",
        }}
      >
        <div
          css={{
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: 60,
          }}
        >
          <div
            css={{
              fontWeight: "bold",
              fontSize: 50,
              borderTop: "10px solid black",
            }}
          >
            {label}
          </div>
        </div>
        <div
          css={{
            display: "flex",
            margin: 20,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {articles.map((article, index) => {
            return (
              <div css={{ width: "22vw" }}>
                <ArticleSummary
                  key={article.id}
                  article={article}
                  variant={index % 2 === 0 ? "md" : "sm"}
                />
              </div>
            );
          })}
        </div>
        <div
          css={{
            position: "absolute",
            bottom: "5%",
            right: "10%",
          }}
        >
          <PlainLink to={`articles/${category}`}>
            <div
              css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                css={{
                  padding: 10,
                  fontWeight: "bold",
                  color: "black",
                  ":hover": { color: "red" },
                }}
              >{`${localize(
                "more"
              ).toLocaleUpperCase()} ${label.toLocaleUpperCase()}`}</div>
              <FontAwesomeIcon
                icon={faChevronCircleRight}
                size="3x"
                css={{
                  cursor: "pointer",
                  color: "red",
                }}
              />
            </div>
          </PlainLink>
        </div>
      </div>
    );
  }

  const firstColumn = articles.slice(0, 1).filter((item) => item);
  const secondColumn = articles.slice(1, 5).filter((item) => item);
  const thirdColumn = articles.slice(5).filter((item) => item);

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid black",
      }}
    >
      <div
        css={{
          display: "flex",
          justifyContent: "flex-start",
          marginLeft: 60,
        }}
      >
        <div
          css={{
            fontWeight: "bold",
            fontSize: 50,
            borderTop: "10px solid black",
          }}
        >
          {label}
        </div>
      </div>
      <div
        css={{
          display: "flex",
          margin: 20,
          justifyContent: "center",
        }}
      >
        <div
          className="block"
          css={{
            position: "relative",
            display: "flex",
            width: "45vw",
            flexDirection: "column",
            margin: 20,
          }}
        >
          <Sticky boundaryElement=".block" hideOnBoundaryHit={false}>
            {firstColumn.map((item) => (
              <ArticleSummary
                key={item.id}
                article={item}
                variant="sticky"
                style={{ margin: 0 }}
              />
            ))}
          </Sticky>
        </div>
        <div
          css={{
            display: "flex",
            width: "23vw",
            flexDirection: "column",
          }}
        >
          {secondColumn.map((item, index) => (
            <ArticleSummary
              key={item.id}
              article={item}
              variant={index % 2 === 0 ? "sm" : "md"}
            />
          ))}
        </div>
        <div
          css={{
            display: "flex",
            width: "23vw",
            flexDirection: "column",
          }}
        >
          {thirdColumn.map((item) => (
            <ArticleSummary key={item.id} article={item} variant="md" />
          ))}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { subCategoryMap, categories, categoryMap } = useContext(GlobalContext);

  const { derive, localize } = useMultiLanguage();

  const getDerivedCategories = (category: string) => {
    if (category === "__all__") {
      return JSON.stringify(categories.map((item) => item.id));
    }
    const subcategories =
      Object.keys(subCategoryMap).length > 0
        ? subCategoryMap[category]?.map((item) => item.id)
        : undefined;
    return JSON.stringify([category, ...(subcategories || [])]);
  };

  return (
    <div>
      <ArticleGroup
        categoryQueryString={getDerivedCategories("__all__")}
        pageSize={7}
        variant="vertical"
        label={localize("top_stories")}
        category={"__all__"}
      />
      {Object.keys(subCategoryMap).map((category, i) => {
        return (
          <ArticleGroup
            key={category}
            categoryQueryString={getDerivedCategories(category)}
            pageSize={i % 2 === 0 ? 4 : 7}
            variant={i % 2 === 0 ? "horizontal" : "vertical"}
            label={derive(categoryMap[category]?.label)}
            category={category}
          />
        );
      })}
    </div>
  );
};

export default Home;
