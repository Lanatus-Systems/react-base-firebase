/** @jsxImportSource @emotion/react */
import { useMultiLanguage } from "src/hooks";
import { Story } from "src/model/article";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";

import parseHtml from "html-react-parser";
import ImageEdit from "../editables/ImageEdit";
import ImagePlaceholder from "../image-placeholder";
import TextPlaceholder from "../text-placeholder";
import { useContext } from "react";
import { LayoutContext } from "src/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
interface Iprops {
  value: Story;
  onChange: (item: Story) => void;
  onRemove: () => void;
  storyIndex: number;
  storyCount: number;
}

const StoryItem = ({
  value,
  onChange,
  onRemove,
  storyIndex,
  storyCount,
}: Iprops) => {
  const { derive, deriveImage } = useMultiLanguage();

  const { isMobile } = useContext(LayoutContext);

  return (
    <div
      css={{
        borderBottom: "1px solid lightgrey",
        paddingBottom: 30,
        minHeight: 400,
      }}
    >
      <button
        onClick={() => {
          window.confirm("Are you sure you want to remove story?") &&
            onRemove();
        }}
      >
        Remove
      </button>
      <div
        css={{
          display: "flex",
          width: isMobile ? "100vw" : "60vw",
          padding: isMobile ? 0 : 60,
          borderRight: "1px solid lightgrey",
          flexDirection: "column",
        }}
      >
        <div
          css={{
            width: isMobile ? "100%" : "75%",
          }}
        >
          <div
            css={{
              position: "relative",
              minHeight: 250,
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
          <div
            css={{
              display: "flex",
              padding: isMobile ? "2vw" : "1vw",
              justifyContent: "space-between",
            }}
          >
            <div css={{ fontSize: 20 }}>{`${storyIndex}/${storyCount}`}</div>
            <FontAwesomeIcon
              icon={faShareAlt}
              size="1x"
              css={{ fontSize: 20, ":hover": { color: "red" } }}
            />
          </div>
          <div css={{ position: "relative" }}>
            {value.content ? (
              parseHtml(derive(value.content))
            ) : (
              <TextPlaceholder />
            )}
            <MultiLangTextEdit
              rich
              title="Edit Detail"
              value={value.content}
              onChange={(updated) => onChange({ ...value, content: updated })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryItem;
