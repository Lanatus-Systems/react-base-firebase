import { useState } from "react";
import { Modal } from "src/base";
import { ENGLISH, FRENCH } from "src/i18n/languages";
import { MultiLanguage } from "src/model/common";
import TextComponent from "./TextComponent";

interface Iprops {
  title: string;
  value: MultiLanguage;
  onChange: (val: MultiLanguage) => void;
  hide: () => void;
  multiline?: boolean;
  rich?: boolean;
}

const EditableInputModal = ({
  title,
  value,
  multiline,
  rich,
  onChange,
  hide,
}: Iprops) => {
  const [englishText, setEnglishText] = useState<string>(
    value ? value[ENGLISH] : ""
  );
  const [frenchText, setFrenchText] = useState<string>(
    value ? value[FRENCH] : ""
  );

  return (
    <Modal
      title={title}
      onClose={hide}
      onOk={() => {
        onChange({
          [ENGLISH]: englishText,
          [FRENCH]: frenchText,
        });
        hide();
      }}
    >
      <div>English</div>
      <div>
        <TextComponent
          multiline={multiline}
          rich={rich}
          value={englishText}
          onChange={setEnglishText}
        />
      </div>
      <div>French</div>
      <div>
        <TextComponent
          multiline={multiline}
          rich={rich}
          value={frenchText}
          onChange={setFrenchText}
        />
      </div>
    </Modal>
  );
};

export default EditableInputModal;
