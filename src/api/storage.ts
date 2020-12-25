import { firebaseStorage } from "src/firebase";
import { v4 } from "uuid";

const IMAGE_DIRECTORY = "magazine";

export const uploadImage = (file: File) => {
  return firebaseStorage
    .ref(`${IMAGE_DIRECTORY}/${v4()}`)
    .put(file)
    .then((item) => {
      return firebaseStorage.ref(item.metadata.fullPath).getDownloadURL();
    });
};
