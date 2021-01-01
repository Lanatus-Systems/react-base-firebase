import React, { Suspense, useState } from "react";
import { MultiLanguage } from "src/model/common";

import EditIcon from "./EditIcon";

const InputModal = React.lazy(() => import("./MultiLangInputModal"));

interface Iprops {
  title: string;
  value: MultiLanguage;
  onChange: (val: MultiLanguage) => void;
  multiline?: boolean;
  rich?: boolean;
}

const MultiLangTextEdit = ({
  title,
  value,
  onChange,
  multiline,
  rich,
}: Iprops) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return modalVisible ? (
    <Suspense fallback={<div>Loading...</div>}>
      <InputModal
        title={title}
        value={value}
        hide={() => setModalVisible(false)}
        onChange={onChange}
        multiline={multiline}
        rich={rich}
      />
    </Suspense>
  ) : (
    <EditIcon onClick={() => setModalVisible(true)} />
  );
};

export default MultiLangTextEdit;
