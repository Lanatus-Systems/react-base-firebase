import { firestore } from "src/firebase";
import { AppPage, CheckoutPage, SubscribePage } from "src/model/app-pages";
import { APP_PAGES } from "./collections";

const pages = {
  SUBSCRIBE: "subscribe",
  CHECKOUT: "checkout",
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
          sliderImages: (value && value.sliderImages) || [],
        } as SubscribePage;
      } else {
        throw new Error("Subscribe page data does not exists");
      }
    });
};

export const getCheckoutPageData = () => {
  return firestore
    .collection(APP_PAGES)
    .doc(pages.CHECKOUT)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const value = doc.data();
        return {
          id: doc.id,
          ...value,
          subHeadInfo: (value && value.subHeadInfo) || {},
          countries: (value && value.countries) || [],
          startOptions: (value && value.startOptions) || [],
        } as CheckoutPage;
      } else {
        throw new Error("Checkout page data does not exists");
      }
    });
};

export const savePageData = (data: AppPage) => {
  const finalData = { ...data } as any;
  delete finalData.id;
  return firestore.collection(APP_PAGES).doc(data.id).set(finalData);
};
