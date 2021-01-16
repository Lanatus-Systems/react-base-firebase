import { firestore } from "src/firebase";
import { SubscribePage } from "src/model/app-pages";
import { APP_PAGES } from "./collections";

const pages = {
  SUBSCRIBE: "subscribe",
};

export const getSubscribePageData = () => {
  return firestore
    .collection(APP_PAGES)
    .doc(pages.SUBSCRIBE)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const value = doc.data();
        return {
          id: doc.id,
          ...value,
          subHeadCoverImage: (value && value.subHeadCoverImage) || {},
        } as SubscribePage;
      } else {
        throw new Error("Subscribe page data does not exists");
      }
    });
};

export const savePageData = (data: SubscribePage) => {
  const finalData = { ...data } as any;
  console.log({finalData})
  delete finalData.id;
  return firestore.collection(APP_PAGES).doc(data.id).set(finalData);
};
