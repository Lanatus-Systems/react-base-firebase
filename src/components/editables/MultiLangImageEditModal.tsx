import { useState } from "react";
import { Modal } from "src/base";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import { SelectButton } from "primereact/selectbutton";

import { v4 } from "uuid";
import TextEdit from "./TextEdit";
import { MultiLanguage } from "src/model/common";
import { ENGLISH, FRENCH } from "src/i18n/languages";
import ImagePlaceholder from "../image-placeholder";

interface Iprops {
  title: string;
  value: MultiLanguage;
  type?: string;
  onChange: (val: MultiLanguage) => void;
  hide: () => void;
}

const ImageEditModal = ({ title, type, value, onChange, hide }: Iprops) => {
  const [englishUrl, setEnglishUrl] = useState(value ? value[ENGLISH] : "");
  const [frenchUrl, setFrenchUrl] = useState(value ? value[FRENCH] : "");

  const [activeTab, setActiveTab] = useState(ENGLISH);

  const [uniqueId] = useState(v4());

  const effectiveUniqueId = `${uniqueId}-${activeTab}`;
  const effectiveUrl = activeTab === ENGLISH ? englishUrl : frenchUrl;

  const setEffectiveUrl = activeTab === ENGLISH ? setEnglishUrl : setFrenchUrl;

  return (
    <Modal
      title={title}
      onClose={hide}
      onOk={() => {
        onChange({
          [ENGLISH]: englishUrl,
          [FRENCH]: frenchUrl,
        });
        hide();
      }}
    >
      <div>
        <SelectButton
          value={activeTab}
          options={[
            { value: ENGLISH, label: "English" },
            { value: FRENCH, label: "French" },
          ]}
          onChange={(e) => setActiveTab(e.value)}
        />
        <div>
          (If you won't provide image for French then it'll show English Image ,
          so if you want to use use same image then just provide English image
          only)
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "40%", maxHeight: "80vh" }}>
          {effectiveUrl ? (
            <img
              src={effectiveUrl}
              alt="pick a file"
              width="100%"
              height="100%"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <label htmlFor={effectiveUniqueId}>
          <FontAwesomeIcon
            icon={faEdit}
            size="2x"
            style={{ cursor: "pointer" }}
          />
          <input
            id={effectiveUniqueId}
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files;
              if (f != null) {
                effectiveUrl && URL.revokeObjectURL(effectiveUrl);
                setEffectiveUrl(URL.createObjectURL(f[0]));
              }
            }}
          />
        </label>
        <div style={{ position: "relative", width: 200 }}>
          Or Specify Remote Url
          <TextEdit
            title="Custom Remote URL"
            value={effectiveUrl}
            onChange={setEffectiveUrl}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ImageEditModal;
