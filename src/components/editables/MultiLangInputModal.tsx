import { SelectButton } from "primereact/selectbutton";
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

  const [activeTab, setActiveTab] = useState(ENGLISH);

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
      width={rich ? "70vw" : "50vw"}
    >
      {rich && (
        <div>
          <SelectButton
            value={activeTab}
            options={[
              { value: ENGLISH, label: "English" },
              { value: FRENCH, label: "French" },
            ]}
            onChange={(e) => setActiveTab(e.value)}
          />
        </div>
      )}
      {!rich && <div>English</div>}
      <div
        style={{ display: rich && activeTab !== ENGLISH ? "none" : "unset" }}
      >
        <TextComponent
          multiline={multiline}
          rich={rich}
          value={englishText}
          onChange={setEnglishText}
        />
      </div>
      {!rich && <div>French</div>}
      <div style={{ display: rich && activeTab !== FRENCH ? "none" : "unset" }}>
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
