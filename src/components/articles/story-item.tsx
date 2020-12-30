import { useMultiLanguage } from "src/hooks";
import { Story } from "src/model/article";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";

import parseHtml from "html-react-parser";
import ImageEdit from "../editables/ImageEdit";

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
            width: "80%",
            position: "relative",
          }}
        >
          {value?.image && (
            <img
              src={deriveImage(value.image)}
              alt="welcome"
              width="100%"
              height="100%"
            />
          )}

          <ImageEdit
            style={{ position: "absolute", right: 10, cursor: "pointer" }}
            title="Edit Story Image"
            value={value.image}
            onChange={(url) => onChange({ ...value, image: url })}
          />
        </div>
        <div>
          {parseHtml(derive(value.content))}
          <MultiLangTextEdit
            rich
            title="Edit Detail"
            value={value.content}
            onChange={(updated) => onChange({ ...value, content: updated })}
          />
        </div>
      </div>
    </div>
  );
};

export default StoryItem;
