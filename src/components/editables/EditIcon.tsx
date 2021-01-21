/** @jsxImportSource @emotion/react */
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties, useContext } from "react";
import { AuthContext } from "src/context";

interface Iprops {
  onClick?: () => void;
  style?: CSSProperties;
}
const EditIcon = ({ onClick = () => {}, style }: Iprops) => {
  const { roles } = useContext(AuthContext);

  return roles.editor || roles.admin ? (
    <span
      css={{
        width: 30,
        height: 30,
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        position: "absolute",
        top: 0,
        right: 0,
        opacity: 0.8,
        ...style,
      }}
    >
      <FontAwesomeIcon icon={faPencilAlt} onClick={() => onClick()} />
    </span>
  ) : null;
};

export default EditIcon;
