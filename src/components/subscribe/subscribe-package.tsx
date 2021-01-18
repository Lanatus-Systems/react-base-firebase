/** @jsxImportSource @emotion/react */
import { useMultiLanguage } from "src/hooks";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";

import ImageEdit from "../editables/ImageEdit";
import ImagePlaceholder from "../image-placeholder";
import TextPlaceholder from "../text-placeholder";
import { useContext } from "react";
import { LayoutContext } from "src/context";
import parseQuillHtml from "src/utils/quill-parser";
import { SubscriptionPackage } from "src/model/app-pages";

interface Iprops {
  value: SubscriptionPackage;
  onChange: (item: SubscriptionPackage) => void;
  onRemove: () => void;
}

const SubscribePackage = ({ value, onChange, onRemove }: Iprops) => {
  const { derive, deriveImage } = useMultiLanguage();

  const { isMobile } = useContext(LayoutContext);

  return (
    <div
      css={{
        width: isMobile ? "90vw" : "40vw",
        margin: "2vw",
        minHeight: 200,
        backgroundColor: "#f4f4f4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => {
          window.confirm("Are you sure you want to remove package?") &&
            onRemove();
        }}
      >
        Remove
      </button>

      <div style={{ padding: 10, position: "relative" }}>
        <span css={{ fontSize: 30 }}>{derive(value.title)}</span>
        <MultiLangTextEdit
          title="Edit Title"
          value={value.title}
          onChange={(updated) => onChange({ ...value, title: updated })}
        />
      </div>

      <div
        css={{
          position: "relative",
          minHeight: 250,
          display: "flex",
          width: isMobile ? "80%" : "60%",
          justifyContent: "center",
        }}
      >
        {value.image ? (
          <img
            css={{ maxHeight: "90vh", maxWidth: "100%" }}
            src={deriveImage(value.image)}
            alt="Not Available"
          />
        ) : (
          <ImagePlaceholder css={{ position: "absolute" }} />
        )}

        <ImageEdit
          css={{ position: "absolute", right: 10, cursor: "pointer" }}
          title="Edit Story Image"
          value={value.image}
          onChange={(url) => onChange({ ...value, image: url })}
        />
      </div>

      <div css={{ position: "relative" }}>
        {value.info ? parseQuillHtml(derive(value.info)) : <TextPlaceholder />}
        <MultiLangTextEdit
          rich
          title="Edit Information"
          value={value.info}
          onChange={(updated) => onChange({ ...value, info: updated })}
        />
      </div>
      <button onClick={() => {
        alert("to buy page")
      }}>buy</button>
    </div>
  );
};

export default SubscribePackage;
