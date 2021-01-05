import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import { CSSProperties } from "react";

interface Iprops {
  style?: CSSProperties;
}

const TextPlaceholder = ({ style = {} }: Iprops) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        border: "1px dashed black",
        padding: 10,
        ...style,
      }}
    >
      <FontAwesomeIcon icon={faFont} size="3x" />
    </div>
  );
};

export default TextPlaceholder;
