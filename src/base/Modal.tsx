import { CSSProperties, ReactNode } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

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
  footer = (
    <div>
      <Button
        label="Close"
        icon="pi pi-times"
        onClick={onClose}
        className="p-button-text"
      />
      {onOk && (
        <Button label="Save" icon="pi pi-check" onClick={onOk} autoFocus />
      )}
    </div>
  ),
  children,
  ...rest
}: Iprops) => {
  return (
    <Dialog
      appendTo={document.body}
      header={title}
      visible
      style={{ width: width }}
      footer={footer}
      onHide={onClose}
      {...rest}
    >
      {children}
    </Dialog>
  );
};

export default Modal;
