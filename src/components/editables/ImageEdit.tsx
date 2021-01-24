import React, { CSSProperties, Suspense, useState } from "react";
import Loading from "src/base/Loading";
import { MultiLanguage } from "src/model/common";
import EditIcon from "./EditIcon";

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
    <Suspense fallback={<Loading />}>
      <ImageEditModal
        title={title}
        value={value}
        hide={() => setModalVisible(false)}
        onChange={onChange}
        type={type}
      />
    </Suspense>
  ) : (
    <EditIcon style={style} onClick={() => setModalVisible(true)} />
  );
};

export default ImageEdit;
