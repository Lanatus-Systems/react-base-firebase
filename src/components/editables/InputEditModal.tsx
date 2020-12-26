import { useState } from "react";
import { Modal } from "src/base";
import TextComponent from "./TextComponent";

interface Iprops {
  title: string;
  value: string;
  type?: string;
  onChange: (val: string) => void;
  hide: () => void;
  multiline?: boolean;
  rich?: boolean;
}

const EditableInputModal = ({
  title,
  type,
  value,
  onChange,
  hide,
  multiline,
  rich,
}: Iprops) => {
  const [text, setText] = useState(value || "");

  return (
    <Modal
      title={title}
      onClose={hide}
      onOk={() => {
        onChange(text);
        hide();
      }}
    >
      <TextComponent
        multiline={multiline}
        rich={rich}
        value={text}
        onChange={setText}
        type={type}
      />
    </Modal>
  );
};

export default EditableInputModal;
