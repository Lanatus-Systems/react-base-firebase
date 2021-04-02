/** @jsxImportSource @emotion/react */
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "primereact/menu";
import { useRef } from "react";

import {
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from "react-share";

interface Iprops {
  url: string;
  mediaUrl: string;
}

const SocialShare = ({ url, mediaUrl }: Iprops) => {
  console.log({ url, mediaUrl });

  const menuRef = useRef();

  const shareOptions = [
    {
      label: "",
      template: () => {
        return (
          <div
            style={{
              display: "flex",
              padding: "0px 10px",
              justifyContent: "space-around",
            }}
          >
            <FacebookShareButton url={url}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={url}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <WhatsappShareButton url={url}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            {mediaUrl ? (
              <PinterestShareButton media={mediaUrl} url={url}>
                <PinterestIcon size={32} round />
              </PinterestShareButton>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <span>
      <Menu
        model={shareOptions}
        popup
        ref={menuRef as any}
        style={{ width: mediaUrl ? 180 : 130 }}
      />
      <FontAwesomeIcon
        icon={faShareAlt}
        size="1x"
        css={{
          fontSize: 20,
          cursor: "pointer",
          ":hover": { color: "red" },
        }}
        onClick={(e) => (menuRef.current as any)?.show(e)}
      />
    </span>
  );
};

export default SocialShare;
