import { useMultiLanguage } from "src/hooks";
import { Story } from "src/model/article";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";

import parseHtml from "html-react-parser";
import ImageEdit from "../editables/ImageEdit";
import ImagePlaceholder from "../image-placeholder";
import TextPlaceholder from "../text-placeholder";

interface Iprops {
  value: Story;
  onChange: (item: Story) => void;
}

const StoryItem = ({ value, onChange }: Iprops) => {
  const { derive, deriveImage } = useMultiLanguage();

  return (
    <div
      style={{
        borderBottom: "1px solid lightgrey",
        paddingBottom: 30,
        minHeight: 400,
      }}
    >
      <div
        style={{
          display: "flex",
          width: "60vw",
          padding: 60,
          borderRight: "1px solid lightgrey",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "75%",
          }}
        >
          <div
            style={{
              position: "relative",
              minHeight: 250,
            }}
          >
            {value.image ? (
              <img
                style={{ maxHeight: "90vh", maxWidth: "100%" }}
                src={deriveImage(value.image)}
                alt="Not Available"
              />
            ) : (
              <ImagePlaceholder style={{ position: "absolute" }} />
            )}

            <ImageEdit
              style={{ position: "absolute", right: 10, cursor: "pointer" }}
              title="Edit Story Image"
              value={value.image}
              onChange={(url) => onChange({ ...value, image: url })}
            />
          </div>
          <div style={{ position: "relative" }}>
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
