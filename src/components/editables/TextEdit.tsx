import React, { Suspense, useState } from "react";
import EditIcon from "./EditIcon";

const InputModal = React.lazy(() => import("./InputEditModal"));

interface Iprops {
  title: string;
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
  rich?: boolean;
  type?: string;
}

const TextEdit = ({
  title,
  value,
  type,
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
        type={type}
      />
    </Suspense>
  ) : (
    <EditIcon
      style={{ marginLeft: 10 }}
      onClick={() => setModalVisible(true)}
    />
  );
};

export default TextEdit;
