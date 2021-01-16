import parseHtml from "html-react-parser";

const parseQuillHtml = (value: string) => {
  return <div className="ql-editor">{parseHtml(value)}</div>;
};

export default parseQuillHtml;
