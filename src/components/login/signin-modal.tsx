import { ReactNode, useContext, useState } from "react";
import { Modal } from "src/base";
import { AuthContext } from "src/context";

import { Button } from "primereact/button";

interface Iprops {
  hide: () => void;
}

export const SignInModal = ({ hide }: Iprops) => {
  const { googleLogin, facebookLogin } = useContext(AuthContext);

  return (
    <Modal title="Sign In to Mbocky" onClose={hide} footer={null}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: 100,
        }}
      >
        <Button
          className="p-button-danger"
        //   icon="pi pi-google"
          label="Google"
          onClick={googleLogin}
        />
        <Button
        //   icon="pi pi-facebook"
          label="Facebook"
          onClick={facebookLogin}
        />
      </div>
    </Modal>
  );
};

interface IlinkProps {
  children: (popModal: () => void) => ReactNode;
}

const SingInLink = ({ children }: IlinkProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      {modalVisible && <SignInModal hide={() => setModalVisible(false)} />}
      {children(() => setModalVisible(true))}
    </>
  );
};

export default SingInLink;
