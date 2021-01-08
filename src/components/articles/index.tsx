/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import { Article } from "src/model/article";

import Sticky from "react-sticky-el";
import * as api from "src/api/article";
import { GlobalContext, LayoutContext } from "src/context";
import ArticleSummary from "./article-summary";
import { useMultiLanguage } from "src/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { PlainLink } from "src/base";

interface ItitleProps {
  label: string;
}

const ArticleGroupTitle = ({ label }: ItitleProps) => {
  const { isMobile } = useContext(LayoutContext);
  return (
    <div
      css={{
        display: "flex",
        justifyContent: "flex-start",
        marginLeft: "5vw",
      }}
    >
      <div
        css={{
          fontWeight: isMobile ? "normal" : "bold",
          fontSize: isMobile ? 30 : 50,
          borderTop: "10px solid black",
        }}
      >
        {label}
      </div>
    </div>
  );
};

interface ImobileProp {
  isMobile: boolean;
}

const GroupWrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  borderBottom: "1px solid black",
  position: "relative",
});

const GroupInnerWrapper = styled.div<ImobileProp>`
  display: flex;
  padding: ${(props: ImobileProp) => (props.isMobile ? "3vw 0vw" : "2vw")};
  justify-content: center;
  flex-direction: ${(props: ImobileProp) =>
    props.isMobile ? "column" : "row"};
`;

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

  const { isMobile } = useContext(LayoutContext);

  const { localize } = useMultiLanguage();

  useEffect(() => {
    const categories = JSON.parse(categoryQueryString) as string[];
    if (categories.length > 0) {
      if (categories.length <= 10) {
        console.log({ categoryQueryString });
        api.resetPagingFor(categories);
        api.getArticles(categories, pageSize).then(setArticles);
      }
    }
  }, [categoryQueryString, pageSize]);

  if (articles.length === 0) {
    return null;
  }

  console.log({ variant });
  if (variant === "horizontal") {
    return (
      <GroupWrapper>
        <ArticleGroupTitle label={label} />
        <GroupInnerWrapper
          isMobile={isMobile}
          css={{
            flexWrap: "wrap",
          }}
        >
          {articles.map((article, index) => {
            return (
              <div css={{ width: isMobile ? "100vw" : "22vw" }}>
                <div
                  css={{
                    borderBottom: isMobile ? "1px solid lightgrey" : "",
                    padding: isMobile ? "2vw" : 0,
                  }}
                >
                  <ArticleSummary
                    key={article.id}
                    article={article}
                    variant={index % 2 === 0 ? "md" : "sm"}
                  />
                </div>
              </div>
            );
          })}
        </GroupInnerWrapper>
        <div
          css={{
            position: isMobile ? "unset" : "absolute",
            bottom: "5%",
            right: "10%",
            paddingBottom: isMobile ? "5vh" : "",
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
      </GroupWrapper>
    );
  }

  const firstColumn = articles.slice(0, 1).filter((item) => item);
  const secondColumn = articles.slice(1, 5).filter((item) => item);
  const thirdColumn = articles.slice(5).filter((item) => item);

  return (
    <GroupWrapper>
      <ArticleGroupTitle label={label} />
      <GroupInnerWrapper isMobile={isMobile}>
        <div
          className="block"
          css={{
            position: "relative",
            display: "flex",
            width: isMobile ? "100vw" : "45vw",
            flexDirection: "column",
            margin: isMobile ? 0 : "1vw",
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
                variant={isMobile ? "mobile" : index % 2 === 0 ? "sm" : "md"}
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
      </GroupInnerWrapper>
    </GroupWrapper>
  );
};

const Home = () => {
  const { subCategoryMap, categoryMap } = useContext(GlobalContext);

  const { derive, localize } = useMultiLanguage();

  const getDerivedCategories = (category: string) => {
    if (category === api.ALL_ARTICLES_KEY) {
      return JSON.stringify([api.ALL_ARTICLES_KEY]);
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
        categoryQueryString={getDerivedCategories(api.ALL_ARTICLES_KEY)}
        pageSize={7}
        variant="vertical"
        label={localize("top_stories")}
        category={api.ALL_ARTICLES_KEY}
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
