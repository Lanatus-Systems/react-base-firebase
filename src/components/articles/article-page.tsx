/** @jsxImportSource @emotion/react */
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "src/context";
import { useMultiLanguage } from "src/hooks";
import ArticleList from "./article-list";

interface Iprops {
  category: string;
}
const ArticlePage = (props: Iprops) => {
  const { category } = useParams<Iprops>();

  const { categoryMap, subCategoryMap } = useContext(GlobalContext);

  const { derive, localize } = useMultiLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>(category);

  const subcategories = subCategoryMap[category];

  if (subcategories == null || subcategories.length === 0) {
    return (
      <div>
        <div css={{ padding: 10, fontSize: 40, textAlign: "center" }}>
          {derive(categoryMap[category]?.label)}
        </div>
        <hr css={{ margin: 0 }} />
        <ArticleList category={category} />
      </div>
    );
  } else {
    return (
      <div>
        <div css={{ padding: 10, fontSize: 40, textAlign: "center" }}>
          {derive(categoryMap[category]?.label)}
        </div>
        <hr css={{ margin: 0 }} />
        <div css={{ display: "flex" }}>
          <div
            css={{
              fontWeight: 600,
              fontSize: 14,
              fontFamily: "Sniglet",
              margin: 5,
              padding: 5,
              ":hover": {
                color: "#fa0000",
              },
              cursor: "pointer",
            }}
            onClick={() => setSelectedCategory(category)}
          >
            {localize("all_topics").toLocaleUpperCase()}
          </div>
          {subcategories.map((item) => (
            <div
              key={item.id}
              css={{
                fontWeight: 600,
                fontSize: 14,
                fontFamily: "Sniglet",
                margin: 5,
                padding: 5,
                ":hover": {
                  color: "#fa0000",
                },
                cursor: "pointer",
              }}
              onClick={() => setSelectedCategory(item.id)}
            >
              {derive(item.label).toLocaleUpperCase()}
            </div>
          ))}
        </div>
        <hr css={{ margin: 0 }} />
        <ArticleList category={selectedCategory} />
      </div>
    );
  }
};

export default ArticlePage;
