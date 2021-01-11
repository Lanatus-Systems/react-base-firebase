import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { CSSProperties } from "react";

interface Iprops {
  style?: CSSProperties;
}

const VideoPlaceholder = ({ style = {} }: Iprops) => {
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
      <FontAwesomeIcon icon={faVideo} size="3x" />
    </div>
  );
};

export default VideoPlaceholder;
