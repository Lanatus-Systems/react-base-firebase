import React, { CSSProperties, Suspense, useState } from "react";
import Loading from "src/base/Loading";
import { MultiLanguage } from "src/model/common";
import EditIcon from "./EditIcon";

const FileEditModal = React.lazy(() => import("./MultiLangFileEditModal"));

interface Iprops {
  title: string;
  value: MultiLanguage;
  onChange: (val: MultiLanguage) => void;
  type?: string;
  accept?: string;
  style?: CSSProperties;
}

const FileEdit = ({
  title,
  value,
  type,
  accept,
  onChange,
  style = {},
}: Iprops) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return modalVisible ? (
    <Suspense fallback={<Loading />}>
      <FileEditModal
        title={title}
        value={value}
        hide={() => setModalVisible(false)}
        onChange={onChange}
        type={type}
        accept={accept}
      />
    </Suspense>
  ) : (
    <EditIcon style={style} onClick={() => setModalVisible(true)} />
  );
};

export default FileEdit;
