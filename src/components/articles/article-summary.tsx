/** @jsxImportSource @emotion/react */
import { useContext } from "react";
import { PlainLink } from "src/base";
import { GlobalContext } from "src/context";
import { useMultiLanguage } from "src/hooks";
import { Article } from "src/model/article";

import dayjs from "dayjs";

interface Iprops {
  article: Article;
  width?: number;
  variant?: "sm" | "md" | "lg" | "xl";
}

const fontSizeMap = {
  sm: 18,
  md: 25,
  lg: 30,
  xl: 35,
};

const imageHeightMap = {
  sm: 300,
  md: 400,
  lg: 600,
  xl: 700,
};

const ArticleSummary = ({ article, variant = "md" }: Iprops) => {
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
          margin: 20,
          // boxShadow: "0px 0px 2px grey",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {article.image && (
          <div
            css={{
              height: imageHeightMap[variant],
              position: "relative",
              backgroundColor: "rgb(242, 242, 242)",
            }}
          >
            <div
              css={{
                position: "absolute",
                width: "100%",
                height: "100%",
                ":hover": {
                  backgroundColor: "red",
                  opacity: 0.5,
                },
                zIndex: 2,
              }}
            />
            <div
              css={{
                position: "absolute",
                width: "100%",
                height: "100%",
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
          </div>
        )}

        <div
          css={{
            marginLeft: "10%",
            marginTop: "-20%",
            backgroundColor: "white",
            zIndex: 3,
            boxShadow: "-1px -1px 5px lightgrey",
          }}
        >
          <div css={{ padding: "5%" }}>
            <div css={{ padding: 3 }}>
              {derive(categoryMap[article.category]?.label)}
            </div>

            <div css={{ fontSize: fontSizeMap[variant], padding: 3 }}>
              {derive(article.title)}
            </div>

            <div css={{ padding: 3 }}>By {article.author}</div>
            <div css={{ padding: 3 }}>
              {dayjs(article.date).format("DD MMMM YYYY")}
            </div>
          </div>
        </div>
      </div>
    </PlainLink>
  );
};

export default ArticleSummary;
