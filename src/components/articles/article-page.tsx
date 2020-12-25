import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { GlobalContext } from "src/context";
import ArticleList from "./article-list";

interface Iprops {
  category: string;
}
const ArticlePage = (props: Iprops) => {
  const { category } = useParams<Iprops>();

  const { categoryMap } = useContext(GlobalContext);

  const { i18n } = useTranslation();

  return (
    <div>
      <div style={{ padding: 10, fontSize: 40, textAlign: "center" }}>
        {categoryMap[category]?.label[i18n.language]}
      </div>
      <hr style={{ margin: 0 }} />
      <ArticleList category={category} />
    </div>
  );
};

export default ArticlePage;
