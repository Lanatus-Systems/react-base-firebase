/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext, GlobalContext, LayoutContext } from "src/context";
import Headroom from "react-headroom";
import { Filler } from "src/style-utils";
import { PlainLink } from "src/base";
import { useMultiLanguage } from "src/hooks";
import { ENGLISH, FRENCH } from "src/i18n/languages";

import styled from "@emotion/styled";
import Loading from "src/base/Loading";

export const StyledMenuItem = styled.div({
  fontWeight: 600,
  fontSize: 14,
  // margin: 5,
  padding: 10,
  ":hover": {
    color: "#fa0000",
  },
  cursor: "pointer",
  whiteSpace: "nowrap",
});

const Header = () => {
  const { roles, logout } = useContext(AuthContext);
  const { rootCategories } = useContext(GlobalContext);

  const { isMobile } = useContext(LayoutContext);

  const { localize, derive, i18n } = useMultiLanguage();

  const headerFontRef = useRef(80);
  const [, setReRenderHeader] = useState(false);

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
        zIndex: 4,
      }}
    >
      <div css={{ boxShadow: "2px 2px lightgrey", background: "white" }}>
        <div css={{ background: "black", height: 10 }} />
        <div css={{ display: "flex" }}>
          <PlainLink to="/">
            <h1
              css={{
                margin: 10,
                fontSize: isMobile ? 40 : headerFontRef.current,
                cursor: "pointer",
                transition: "1s",
                fontFamily: "serif",
              }}
            >
              {" "}
              {localize("brandName")}
            </h1>
          </PlainLink>

          <Filler />
          <div css={{ padding: 10 }}>
            {roles.admin && (
              <div css={{ display: "flex" }}>
                <Link to="/categories" css={{ margin: 10 }}>
                  Categories
                </Link>
                <button onClick={() => logout()}>Logout</button>
              </div>
            )}
          </div>
          <div css={{ padding: "15px 0px", display: "flex", height: 30 }}>
            <div>
              <select
                css={{
                  height: 30,
                  border: "0px",
                  width: 80,
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                }}
                value={i18n.language}
                onChange={(e) => {
                  changeLanguage(e.target.value);
                }}
              >
                <option value={ENGLISH}>English</option>
                <option value={FRENCH}>French</option>
              </select>
            </div>
            <div
              css={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0px 15px",
                padding: "0px 15px",
                borderLeft: "1px solid lightgrey",
                borderRight: "1px solid lightgrey",
                cursor: "pointer",
                color: "red",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
              }}
            >
              <PlainLink to="/subscribe">{localize("subscribe")}</PlainLink>
            </div>
          </div>
        </div>
        <div
          css={{
            width: "100%",
            overflow: "auto",
            borderTop: "1px solid lightgrey",
          }}
        >
          <div
            css={{
              display: "flex",
              padding: 8,
            }}
          >
            {rootCategories.length ? (
              rootCategories.map((item) => (
                <PlainLink key={item.id} to={`/articles/${item.id}`}>
                  <StyledMenuItem>
                    {derive(item.label).toLocaleUpperCase()}
                  </StyledMenuItem>
                </PlainLink>
              ))
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>
    </Headroom>
  );
};

export default Header;
