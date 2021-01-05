/** @jsxImportSource @emotion/react */
import Logo from "src/assets/img/logo.png";
import SocialMediaLinks from "src/components/social-media-links";
import { useMultiLanguage } from "src/hooks";
import { ENGLISH, FRENCH } from "src/i18n/languages";

const Footer = () => {
  const { derive } = useMultiLanguage();
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
    </div>
  );
};

export default Footer;
