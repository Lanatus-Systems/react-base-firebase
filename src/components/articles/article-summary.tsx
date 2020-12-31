/** @jsxImportSource @emotion/react */
import { useContext } from "react";
import { PlainLink } from "src/base";
import { GlobalContext } from "src/context";
import { useMultiLanguage } from "src/hooks";
import { Article } from "src/model/article";

interface Iprops {
  article: Article;
  height?: number;
  width?: number;
  variant: string;
}
const ArticleSummary = ({ article, height = 300, variant }: Iprops) => {
  const { derive, deriveImage } = useMultiLanguage();

  const { categoryMap } = useContext(GlobalContext);

  return (
    <div
      key={article.id}
      style={{
        margin: 15,
        height,
        // width,
        border: "1px dashed lightgrey",
        position: "relative",
      }}
    >
      {article.image && (
        <div style={{ height: "100%", position: "absolute" }}>
          <img
            src={deriveImage(article.image)}
            alt="Not Available"
            height="100%"
            width="100%"
          />
        </div>
      )}
      <div style={{ position: "absolute" }}>
        <PlainLink
          // style={{ cursor: "pointer" }}
          to={{
            pathname: `/article-content/${article.id}`,
            state: { article },
          }}
        >
          <button style={{ cursor: "pointer" }}>Edit</button>
        </PlainLink>
        {/* <div>{article.id}</div> */}
        <div>{derive(article.title)}</div>
        <div>{derive(categoryMap[article.category]?.label)}</div>
        <div>{variant}</div>
      </div>
    </div>
  );
};

export default ArticleSummary;
