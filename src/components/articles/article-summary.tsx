/** @jsxImportSource @emotion/react */
import { useContext } from "react";
import { PlainLink } from "src/base";
import { GlobalContext } from "src/context";
import { useMultiLanguage } from "src/hooks";
import { Article } from "src/model/article";

import dayjs from "dayjs";

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
    <PlainLink
      to={{
        pathname: `/article-content/${article.id}`,
        state: { article },
      }}
    >
      <div
        key={article.id}
        css={{
          margin: 15,
          height,
          // width,
          // border: "1px dashed lightgrey",
          position: "relative",
        }}
      >
        <div
          css={{
            width: "100%",
            height: "70%",
            position: "absolute",
            zIndex: 2,
            ":hover": {
              backgroundColor: "red",
              opacity: 0.5,
            },
          }}
        />
        {article.image && (
          <div
            css={{
              height: "70%",
              position: "absolute",
              zIndex: 1,
            }}
          >
            <img
              src={deriveImage(article.image)}
              alt="Not Available"
              height="100%"
              width="100%"
            />
          </div>
        )}

        <div
          css={{
            position: "absolute",
            left: "10%",
            width: "80%",
            top: "55%",
            height: "45%",
            backgroundColor: "white",
            padding: "5%",
            zIndex: 3,
          }}
        >
          <div css={{ padding: 5 }}>
            {derive(categoryMap[article.category]?.label)}
          </div>

          <div css={{ fontSize: 30, padding: 5 }}>{derive(article.title)}</div>

          <div css={{ padding: 5 }}>By {article.author}</div>
          <div css={{ padding: 5 }}>
            {dayjs(article.date).format("DD MMMM YYYY")}
          </div>
          <div>{variant}</div>
        </div>
      </div>
    </PlainLink>
  );
};

export default ArticleSummary;
