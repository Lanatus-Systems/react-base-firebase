import { firebaseStorage } from "src/firebase";
import { v4 } from "uuid";

// import { compressImageFile } from "src/components/editables/ImageEditModal";

const IMAGE_DIRECTORY = "magazine";

export const uploadImage = (file: Blob): Promise<string> => {
  return firebaseStorage
    .ref(`${IMAGE_DIRECTORY}/${v4()}`)
    .put(file)
    .then((item) => {
      return firebaseStorage.ref(item.metadata.fullPath).getDownloadURL();
    });
};

// let count = 0;

// export const listFiles = () => {
//   firebaseStorage
//     .ref(IMAGE_DIRECTORY)
//     .list()
//     .then((files) => {
//       console.log({ files });
//       files.items.map((item) => {
//         if (count < 180) {
//           count++;
//           compressAndUpdateImage(item.name);
//         }
//         return item;
//       });
//       // files.items.map(item => )
//     });
// };
// listFiles();

// export const compressAndUpdateImage = (fileId: string) => {
//   // console.log("compression function called.....", count);
//   // if (count < 10) {
//     const fileRef = firebaseStorage.ref(`${IMAGE_DIRECTORY}/${fileId}`);
//     // count++;
//     fileRef.getMetadata().then((meta) => {
//       console.log({ meta });
//       const fileSize = meta.size;
//       if (fileSize > 750000) {
//         console.log("compression happened called.....");

//         fileRef.getDownloadURL().then((fileUrl) => {
//           fetch(fileUrl)
//             .then((item) => item.blob())
//             .then((file) => {
//               compressImageFile(file as File).then((compressedFile) => {
//                 firebaseStorage
//                   .ref(`${IMAGE_DIRECTORY}/${fileId}`)
//                   .put(compressedFile)
//                   .then(() => {
//                     console.log("compression finished .... ")
//                   });
//               });
//             });
//         });
//       }
//     });
//   // }
// };

// compressAndUpdateImage("01d0e6b9-2980-4da2-b5f5-a4b2fb463272");
