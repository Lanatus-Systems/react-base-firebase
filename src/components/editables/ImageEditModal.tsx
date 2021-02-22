import { useState } from "react";
import { Modal } from "src/base";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import imageCompression from 'browser-image-compression'

import { v4 } from "uuid";
import TextEdit from "./TextEdit";

interface Iprops {
  title: string;
  value: string;
  type?: string;
  onChange: (val: string) => void;
  hide: () => void;
}

const options = {
  maxSizeMB: 0.75,
  maxWidthOrHeight: 1920,
  useWebWorker: true
}

export const compressImageFile = (imageFile : File) : Promise<File> => {
  return imageCompression(imageFile,options)
}


const ImageEditModal = ({ title, type, value, onChange, hide }: Iprops) => {
  const [imageUrl, setImageUrl] = useState(value || "");

  const [uniqueId] = useState(v4());

  return (
    <Modal
      title={title}
      onClose={hide}
      onOk={() => {
        onChange(imageUrl);
        hide();
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ width: "40%", maxHeight: "80vh" }}>
          <img src={imageUrl} alt="pick a file" width="100%" height="100%" />
        </div>
        Choose Image
        <label htmlFor={uniqueId}>
          <FontAwesomeIcon
            icon={faEdit}
            size="2x"
            style={{ cursor: "pointer" }}
          />
          <input
            id={uniqueId}
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const f = e.target.files;
              if (f != null) {
                imageUrl && URL.revokeObjectURL(imageUrl);
                const file = f[0]
                const compressedFile = await compressImageFile(file)
                setImageUrl(URL.createObjectURL(compressedFile));
              }
            }}
          />
        </label>
        <div style={{ position: "relative", width: 200 }}>
          Or Specify Remote Url
          <TextEdit
            title="Custom Remote URL"
            value={imageUrl}
            onChange={setImageUrl}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ImageEditModal;
