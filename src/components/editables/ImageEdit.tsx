import React, { CSSProperties, Suspense, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { MultiLanguage } from "src/model/common";

const ImageEditModal = React.lazy(() => import("./MultiLangImageEditModal"));

interface Iprops {
  title: string;
  value: MultiLanguage;
  onChange: (val: MultiLanguage) => void;
  type?: string;
  style?: CSSProperties;
}

const ImageEdit = ({ title, value, type, onChange, style = {} }: Iprops) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return modalVisible ? (
    <Suspense fallback={<div>Loading...</div>}>
      <ImageEditModal
        title={title}
        value={value}
        hide={() => setModalVisible(false)}
        onChange={onChange}
        type={type}
      />
    </Suspense>
  ) : (
    <FontAwesomeIcon
      style={{ marginLeft: 10, ...style }}
      icon={faPencilAlt}
      onClick={() => setModalVisible(true)}
    />
  );
};

export default ImageEdit;
