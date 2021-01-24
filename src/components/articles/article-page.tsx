/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "src/base/Loading";
import { GlobalContext, LayoutContext } from "src/context";
import { useMultiLanguage } from "src/hooks";
import { StyledMenuItem } from "src/layout/header";
import ArticleList from "./article-list";

interface Iprops {
  category: string;
}
const ArticlePage = (props: Iprops) => {
  const { category } = useParams<Iprops>();

  const { categoryMap, subCategoryMap, categories } = useContext(GlobalContext);

  const { isMobile } = useContext(LayoutContext);

  const { derive, localize } = useMultiLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>(category);

  const subcategories = subCategoryMap[category];

  useEffect(() => {
    setSelectedCategory(category);
    window.scrollTo(0, 0);
  }, [category]);

  // Loading until category is loaded in context
  if (categories.length === 0) {
    return <Loading />;
  }

  if (subcategories == null || subcategories.length === 0) {
    return (
      <div>
        <div
          css={{
            padding: isMobile ? 40 : 20,
            fontSize: isMobile ? 30 : 40,
            textAlign: "center",
          }}
        >
          {derive(categoryMap[category]?.label)}
        </div>
        <div
          css={{
            margin: "0px 5%",
            width: "90%",
            borderBottom: "1px solid lightgrey",
          }}
        />
        <ArticleList category={category} />
      </div>
    );
  }
  return (
    <div>
      <div
        css={{
          padding: isMobile ? 40 : 20,
          fontSize: isMobile ? 30 : 40,
          textAlign: "center",
        }}
      >
        {derive(categoryMap[category]?.label)}
      </div>
      <div
        css={{
          width: "90%",
          overflow: "auto",
          borderBottom: "1px solid lightgrey",
          borderTop: "1px solid lightgrey",
          margin: "0px 5%",
        }}
      >
        <div css={{ display: "flex" }}>
          <StyledMenuItem
            css={{
              color: isMobile && selectedCategory === category ? "red" : "",
              borderBottom:
                selectedCategory === category ? "5px solid red" : "",
            }}
            onClick={() => setSelectedCategory(category)}
          >
            {localize("all_topics").toLocaleUpperCase()}
          </StyledMenuItem>
          {subcategories.map((item) => (
            <StyledMenuItem
              css={{
                borderBottom:
                  selectedCategory === item.id ? "5px solid red" : "",
              }}
              key={item.id}
              onClick={() => setSelectedCategory(item.id)}
            >
              {derive(item.label).toLocaleUpperCase()}
            </StyledMenuItem>
          ))}
        </div>
      </div>
      <ArticleList category={selectedCategory} />
    </div>
  );
};

export default ArticlePage;
