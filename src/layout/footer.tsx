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
  const { user } = useContext(AuthContext);
  return (
    <div
      css={{
        display: "flex",
        height: 400,
        backgroundColor: "rgb(45, 46, 47)",
        justifyContent: "space-around",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
      }}
    >
      <div css={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <div css={{ width: 300 }}>
          <SocialMediaLinks
            facebook={derive({
              [ENGLISH]: "https://www.facebook.com/MBOCKYEnglisch",
              [FRENCH]: "https://www.facebook.com/MBOCKYFrancais",
            })}
            youtube="https://www.youtube.com/channel/UCKKHo8aJo171nescJcU9vwQ"
          />
        </div>
      </div>
      <img src={Logo} alt="Not Available" width="300px" height="150px" />
      <div>© 2021 prakash dudhat</div>
      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div></div>

        <div css={{ margin: 10 }}>
          {user == null && (
            <PlainLink to="/admin/login" onClick={() => window.scrollTo(0, 0)}>
              Login
            </PlainLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
