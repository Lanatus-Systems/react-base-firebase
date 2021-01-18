import parseHtml from "html-react-parser";
import { sanitize } from "dompurify";
const parseQuillHtml = (value: string) => {
  return <div className="ql-editor">{parseHtml(sanitize(value))}</div>;
};

export default parseQuillHtml;
