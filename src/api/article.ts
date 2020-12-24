import { firestore } from "src/firebase";
import { Category } from "src/model/article";
import { CATEGORIES } from "./collections";

export const getCategories = () => {
  return firestore
    .collection(CATEGORIES)
    .get()
    .then((querySnapshot) => {
      const list = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Category;
      });
      return list;
    });
};

export const updateCategory = (item: Category) => {
  return firestore
    .collection(CATEGORIES)
    .doc(item.id)
    .set({ label: item.label });
};

export const addCategory = (item: Category) => {
  return firestore.collection(CATEGORIES).doc(item.id).set({
    label: item.label,
  });
};

// const removeCategory = (item: Category) => {
//   return firestore.collection(CATEGORIES).doc(item.id).delete();
// };
