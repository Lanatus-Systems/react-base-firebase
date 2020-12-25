import { useContext } from "react";
import { PlainLink } from "src/base";
import { GlobalContext } from "src/context";
import { useMultiLanguage } from "src/hooks";
import { Article } from "src/model/article";

interface Iprops {
  article: Article;
  height?: number;
  width?: number;
}
const ArticleSummary = ({ article, height = 200, width = 200 }: Iprops) => {
  const { derive } = useMultiLanguage();

  const { categoryMap } = useContext(GlobalContext);

  return (
    <div
      key={article.id}
      style={{
        margin: 10,
        height,
        width,
        border: "1px dashed lightgrey",
        // position: "relative",
      }}
    >
      {article.image && (
        <div style={{ height: "60%" }}>
          <img
            src={article.image}
            alt="Not Present"
            height="100%"
            width="100%"
          />
        </div>
      )}
      <div>
        <PlainLink
          style={{ cursor: "pointer" }}
          to={{
            pathname: `/article-content/${article.id}`,
            state: { article },
          }}
        >
          <button>Edit</button>
        </PlainLink>
        {/* <div>{article.id}</div> */}
        <div>{derive(article.title)}</div>
        <div>{derive(categoryMap[article.category]?.label)}</div>
      </div>
    </div>
  );
};

export default ArticleSummary;
