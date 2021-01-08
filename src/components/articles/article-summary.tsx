/** @jsxImportSource @emotion/react */
import { CSSProperties, useContext } from "react";
import { PlainLink } from "src/base";
import { GlobalContext } from "src/context";
import { useMultiLanguage } from "src/hooks";
import { Article } from "src/model/article";

import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-regular-svg-icons";

interface Iprops {
  article: Article;
  width?: number;
  variant?: "sm" | "md" | "lg" | "xl" | "sticky" | "mobile";
  style?: CSSProperties;
}

const fontSizeMap = {
  mobile: 15,
  sm: 18,
  md: 25,
  lg: 30,
  xl: 35,
  sticky: 40,
};

const imageHeightMap = {
  mobile: 100,
  sm: 300,
  md: 400,
  lg: 600,
  xl: 800,
  sticky: 1000,
};

const ArticleSummary = ({ article, variant = "md", style = {} }: Iprops) => {
  const { derive, deriveImage } = useMultiLanguage();
  const { categoryMap } = useContext(GlobalContext);

  const isMobile = variant === "mobile";

  if (variant === "sticky") {
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
            position: "relative",
            height: "100vh",
            ...style,
          }}
        >
          {article.image && (
            <div
              css={{
                backgroundColor: "rgb(242, 242, 242)",
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                css={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "lightgrey",
                  opacity: 0.1,
                  ":hover": {
                    backgroundColor: "red",
                    opacity: 0.5,
                  },
                  zIndex: 2,
                }}
              />
              <div
                css={{
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

          {article.storyCount ? (
            <div
              css={{
                position: "absolute",
                zIndex: 2,
                display: "flex",
                top: 20,
                left: 20,
              }}
            >
              <div
                css={{
                  backgroundColor: "black",
                  opacity: 0.7,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 15px",
                  fontWeight: "bold",
                }}
              >
                <FontAwesomeIcon css={{ color: "white" }} icon={faClone} />
                <div css={{ marginLeft: 10 }}>{article.storyCount || 0}</div>
              </div>
            </div>
          ) : null}
          <div
            css={{
              position: "absolute",
              top: "55%",
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: 30,
              textAlign: "center",
              width: "100%",
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
  }

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
          margin: "1vw",
          // boxShadow: "0px 0px 2px grey",
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          justifyContent: isMobile ? "space-between" : "unset",
          ...style,
        }}
      >
        {article.image && (
          <div
            css={{
              height: isMobile ? "" : imageHeightMap[variant],
              width: isMobile ? "30vw" : "",
              position: "relative",
              backgroundColor: "rgb(242, 242, 242)",
            }}
          >
            <div
              css={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "lightgrey",
                opacity: 0.1,
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

        {article.storyCount ? (
          <div
            css={{
              marginTop: isMobile ? "37%" : "-35%",
              marginBottom: isMobile ? "3%" : "",
              marginLeft: isMobile ? "-40%" : "10%",
              zIndex: 2,
              display: "flex",
            }}
          >
            <div
              css={{
                backgroundColor: "black",
                opacity: 0.7,
                color: "white",
                display: "flex",
                alignItems: "center",
                padding: "10px 15px",
                fontWeight: "bold",
              }}
            >
              <FontAwesomeIcon css={{ color: "white" }} icon={faClone} />
              <div css={{ marginLeft: 10 }}>{article.storyCount || 0}</div>
            </div>
          </div>
        ) : null}
        <div
          css={{
            marginLeft: isMobile ? "" : "10%",
            marginTop: isMobile ? "" : article.storyCount ? "4%" : "-20%",
            backgroundColor: "white",
            zIndex: 3,
            // boxShadow: "-1px -1px 5px lightgrey",
            width: isMobile ? "65vw" : "",
          }}
        >
          <div css={{ padding: "5%" }}>
            <div
              css={{
                padding: 3,
                fontFamily: "'Montserrat', sans-serif",
                color: "rgb(108, 110, 112)",
              }}
            >
              {derive(categoryMap[article.category]?.label).toLocaleUpperCase()}
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
