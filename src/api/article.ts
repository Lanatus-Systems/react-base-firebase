import { firestore } from "src/firebase";
import { Article, ArticleDetail, Category } from "src/model/article";
import { ARTICLES, ARTICLE_DETAIL, CATEGORIES } from "./collections";

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
  const finalData = { ...item } as any;
  delete finalData.id;
  return firestore.collection(CATEGORIES).doc(item.id).set(finalData);
};

export const addCategory = (item: Category) => {
  const finalData = { ...item } as any;
  delete finalData.id;
  return firestore.collection(CATEGORIES).doc(item.id).set(finalData);
};

export const getArticles = (categories: string[]) => {
  return firestore
    .collection(ARTICLES)
    .where("category", "in", categories)
    .get()
    .then((querySnapshot) => {
      const list = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Article;
      });
      return list;
    });
};

export const getArticle = (id: string) => {
  return firestore
    .collection(ARTICLES)
    .doc(id)
    .get()
    .then((doc) => {
      return { id: doc.id, ...doc.data() } as Article;
    });
};

export const updateArticle = (item: Article) => {
  const finalData = { ...item } as any;
  delete finalData.id;
  return firestore.collection(ARTICLES).doc(item.id).set(finalData);
};

export const addArticle = (item: Article) => {
  return firestore.collection(ARTICLES).add(item);
};

// export const saveArticle = (id: string) => {
//   return firestore
//     .collection(ARTICLES)
//     .doc(id)
//     .get()
//     .then((doc) => {
//       return { id: doc.id, ...doc.data() } as Article;
//     });
// };

export const getArticleContent = (id: string) => {
  return firestore
    .collection(ARTICLE_DETAIL)
    .doc(id)
    .get()
    .then((doc) => {
      return { id: doc.id, ...doc.data() } as ArticleDetail;
    });
};

export const updateArticleContent = (item: ArticleDetail) => {
  console.log({ item });
  const finalData = { ...item } as any;
  delete finalData.id;
  return firestore.collection(ARTICLE_DETAIL).doc(item.id).set(finalData);
};

export const addArticleContent = (item: ArticleDetail) => {
  return firestore.collection(ARTICLE_DETAIL).add(item);
};

// const removeCategory = (item: Category) => {
//   return firestore.collection(CATEGORIES).doc(item.id).delete();
// };
