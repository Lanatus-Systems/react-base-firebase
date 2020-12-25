import { CSSProperties, ReactNode } from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

interface Iprops {
  title: string;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  contentStyle?: CSSProperties;
  onClose: () => void;
  onOk?: () => void;
  width?: number | string;
}

const Modal = ({
  title,
  contentStyle = {},
  onClose,
  onOk,
  width = "50vw",
  header = (
    <div style={{ padding: 5, borderBottom: "1px solid lightgrey" }}>
      {title}
    </div>
  ),
  footer = (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: 5,
        borderTop: "1px solid lightgrey",
      }}
    >
      <button style={{ marginRight: 10 }} onClick={onClose}>
        Close
      </button>
      {onOk && <button onClick={onOk}>Save</button>}
    </div>
  ),
  children,
}: Iprops) => {
  return (
    <ReactModal
      isOpen
      style={{
        content: {
          zIndex: 10,
          height: "fit-content",
          padding: 10,
          inset: "unset",
          minWidth: width,
        },
        overlay: {
          zIndex: 9,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
      onRequestClose={onClose}
      contentLabel={title}
    >
      {header}
      <div style={{ padding: 8, ...contentStyle }}>{children}</div>
      {footer}
    </ReactModal>
  );
};

export default Modal;
