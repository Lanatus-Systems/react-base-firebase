/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext, GlobalContext } from "src/context";
import Headroom from "react-headroom";
import { Filler } from "src/style-utils";
import { useTranslation } from "react-i18next";
import { getCategories } from "src/api/article";
import { Category } from "src/model/article";

// const defaultCategories = [
//   "fashion",
//   "beauty",
//   "arts & lifestyle",
//   "runway",
//   "news",
//   "video",
// ];

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { categories } = useContext(GlobalContext);
  const { t, i18n } = useTranslation(["phrases"]);

  const headerFontRef = useRef(80);
  const [_, setReRenderHeader] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      const y = window.scrollY;
      if (y <= 1 && headerFontRef.current === 50) {
        headerFontRef.current = 80;
        setReRenderHeader((val) => !val);
      } else if (y > 1 && headerFontRef.current === 80) {
        headerFontRef.current = 50;
        setReRenderHeader((val) => !val);
      }
    };
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <Headroom
      style={{
        // webkitTransition: "all .5s ease-in-out",
        // mozTransition: "all .5s ease-in-out",
        // oTransition: "all .5s ease-in-out",
        transition: "1s",
      }}
      wrapperStyle={{
        position: "absolute",
        top: 0,
        width: "100%",
      }}
    >
      <div css={{ boxShadow: "2px 2px lightgrey", background: "white" }}>
        <div css={{ background: "black", height: 10 }} />
        <div css={{ display: "flex" }}>
          <Link to="/">
            <h1
              css={{
                margin: 10,
                fontSize: headerFontRef.current,
                cursor: "pointer",
                transition: "1s",
              }}
            >
              {" "}
              {t("brandName", "test")}
            </h1>
          </Link>

          <Filler />
          <div css={{ padding: 10, border: "1px dashed lightgrey" }}>
            {user == null && (
              <Link to="/login">
                <button>Login</button>
              </Link>
            )}
            {user && (
              <div css={{ display: "flex" }}>
                <Link to="/categories" css={{ margin: 10 }}>
                  Categories
                </Link>
                <button onClick={() => logout()}>Logout</button>
              </div>
            )}
          </div>
          <div>
            <select
              css={{ height: 30 }}
              value={i18n.language}
              onChange={(e) => {
                changeLanguage(e.target.value);
              }}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
        <div
          css={{
            display: "flex",
            padding: 8,
            borderTop: "1px solid lightgrey",
          }}
        >
          {
            categories.length
              ? categories.map((item) => (
                  <Link
                    to={`/articles/${item.id}`}
                    style={{ color: "inherit", textDecoration: "inherit" }}
                  >
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
                    >
                      {item.label[i18n.language].toLocaleUpperCase()}
                    </div>
                  </Link>
                ))
              : "Loading..."
            // defaultCategories.map((item) => (
            //     <div
            //       key={item}
            //       css={{
            //         fontWeight: 600,
            //         fontSize: 14,
            //         fontFamily: "Sniglet",
            //         margin: 5,
            //         padding: 5,
            //         ":hover": {
            //           color: "#fa0000",
            //         },
            //         cursor: "pointer",
            //       }}
            //     >
            //       {item.toUpperCase()}
            //     </div>
            //   ))
          }
        </div>
      </div>
    </Headroom>
  );
};

export default Header;
