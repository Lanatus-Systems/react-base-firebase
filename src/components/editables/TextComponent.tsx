import { useContext, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import { LayoutContext } from "src/context";

const Font = Quill.import("formats/font");
Font.whitelist = ["", "serif", "monospace", "Sniglet", "Montserrat"];
Quill.register(Font, true);

interface IeditorProps {
  value: string;
  onChange: (val: string) => void;
}

const toolbarOptions = [
  [{ size: ["small", false, "large", "huge"] }],
  // [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ header: 1 }, { header: 2 }],
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: Font.whitelist }],
  [{ align: [] }],
  ["clean"], // remove formatting button
];

export const ContentEditor = ({ value, onChange }: IeditorProps) => {
  const ref = useRef<any>(null);

  const { isMobile } = useContext(LayoutContext);

  // Disable spellcheck as component is mounted
  useEffect(() => {
    ref.current?.editor.root.setAttribute("spellcheck", "false");
  }, []);

  return (
    <ReactQuill
      // set the ref to access to quill editor
      ref={ref}
      style={{ height: 300, marginBottom: isMobile ? 120 : 80 }}
      placeholder="Enter content here..."
      value={value}
      onChange={onChange}
      theme="snow"
      modules={{
        toolbar: toolbarOptions,
      }}
    />
  );
};
interface Iprops {
  value: string;
  type?: string;
  onChange: (val: string) => void;
  multiline?: boolean;
  rich?: boolean;
}

const TextComponent = ({ value, type, onChange, multiline, rich }: Iprops) => {
  if (rich) {
    return <ContentEditor value={value} onChange={onChange} />;
  }
  if (multiline) {
    return (
      <textarea
        autoFocus
        style={{ width: "100%" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  console.log({ type, value });
  return (
    <input
      autoFocus
      type={type}
      style={{ width: "100%" }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TextComponent;
