/** @jsxImportSource @emotion/react */
import { useMultiLanguage } from "src/hooks";
import { Story } from "src/model/article";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";

import ImageEdit from "../editables/ImageEdit";
import ImagePlaceholder from "../image-placeholder";
import TextPlaceholder from "../text-placeholder";
import { useContext } from "react";
import { AuthContext, LayoutContext } from "src/context";
import parseQuillHtml from "src/utils/quill-parser";
import SocialShare from "../SocialShare";
import { useLocation } from "react-router-dom";
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

  const location = useLocation();

  const { isMobile } = useContext(LayoutContext);

  const { roles } = useContext(AuthContext);

  const storyLink = `#story-${storyIndex}`;

  return (
    <div
      id={storyLink}
      css={{
        borderBottom: "1px solid lightgrey",
        paddingBottom: 30,
        minHeight: 400,
      }}
    >
      {roles.editor && (
        <button
          onClick={() => {
            window.confirm("Are you sure you want to remove story?") &&
              onRemove();
          }}
        >
          Remove
        </button>
      )}
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
              // justifyContent: "space-between",
            }}
          >
            <div
              css={{ fontSize: 20, marginRight: 10 }}
            >{`${storyIndex}/${storyCount}`}</div>
            <SocialShare
              url={`${window.origin}${location.pathname}${storyLink}`}
              mediaUrl={deriveImage(value.image)}
            />
          </div>
          <div css={{ position: "relative" }}>
            {value.content ? (
              parseQuillHtml(derive(value.content))
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
