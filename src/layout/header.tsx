/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "src/context";
import Headroom from "react-headroom";
import { Filler } from "src/style-utils";
import { useTranslation } from "react-i18next";
import { getCategories } from "src/api/article";
import { Category } from "src/model/article";

const defaultCategories = [
  "fashion",
  "beauty",
  "arts & lifestyle",
  "runway",
  "news",
  "video",
];

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  const [categories, setCategories] = useState<Category[]>([]);

  const { t, i18n } = useTranslation(["phrases"]);
  const [selectedLanguage] = useState<string>(i18n.language);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    window.location.reload();
  };

  return (
    <Headroom>
      <div css={{ boxShadow: "2px 2px lightgrey", background: "white" }}>
        <div css={{ background: "black", height: 10 }} />
        <div css={{ display: "flex" }}>
          <h1 css={{ margin: 10, fontSize: 50, cursor: "pointer" }}>
            {" "}
            {t("brandName", "test")}
          </h1>

          <Filler />
          <select
            value={selectedLanguage}
            onChange={(e) => {
              changeLanguage(e.target.value);
            }}
          >
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>
          {user == null && (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
          {user && <button onClick={() => logout()}>Logout</button>}
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
                    {item.label[selectedLanguage].toLocaleUpperCase()}
                  </div>
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
