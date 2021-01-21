import parseHtml from "html-react-parser";
import { sanitize } from "dompurify";
const parseQuillHtml = (value: string) => {
  return (
    <div className="ql-container ql-snow" style={{ border: 0 }}>
      <div className="ql-editor">{parseHtml(sanitize(value))}</div>
    </div>
  );
};

export default parseQuillHtml;
