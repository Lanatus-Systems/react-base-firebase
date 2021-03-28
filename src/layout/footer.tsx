/** @jsxImportSource @emotion/react */
import { useContext } from "react";
import Logo from "src/assets/img/logo.png";
import { PlainLink } from "src/base";
import SocialMediaLinks from "src/components/social-media-links";
import { AuthContext } from "src/context";
import { useMultiLanguage } from "src/hooks";
import { ENGLISH, FRENCH } from "src/i18n/languages";

const Footer = () => {
  const { derive } = useMultiLanguage();
  const { user, roles } = useContext(AuthContext);
  return (
    <div
      css={{
        display: "flex",
        height: 350,
        backgroundColor: "rgb(45, 46, 47)",
        justifyContent: "space-around",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
      }}
    >
      <div css={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <div css={{ width: 150, padding: 10 }}>
          <SocialMediaLinks
            facebook={derive({
              [ENGLISH]: "https://www.facebook.com/MBOCKYEnglisch",
              [FRENCH]: "https://www.facebook.com/MBOCKYFrancais",
            })}
            youtube="https://www.youtube.com/channel/UCKKHo8aJo171nescJcU9vwQ"
          />
        </div>
      </div>
      <PlainLink to="/">
        <img src={Logo} alt="Not Available" width="300px" height="150px" />
      </PlainLink>
      <div css={{ flexGrow: 1 }} />
      <div>
        © 2021{" "}
        {/* <a
          css={{ color: "unset" }}
          href="https://www.fiverr.com/prakashd1998"
          target="_blank"
          rel="noreferrer"
        > */}
          Mbocky Magazine
        {/* </a> */}
      </div>
      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div css={{ margin: 5 }}>
          design inspired by{" "}
          <a
            css={{ color: "unset" }}
            href="https://www.vogue.co.uk"
            target="_blank"
            rel="noreferrer"
          >
            Vogue
          </a>
        </div>

        {user != null && (
          <div css={{ padding: 5 }}>
            <div css={{ display: "flex" }}>
              {roles.admin && (
                <PlainLink to="/admin" css={{ margin: 5 }}>
                  Admin Zone
                </PlainLink>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Footer;
