import { firestore } from "src/firebase";
import { Article, ArticleDetail, Category } from "src/model/article";
import { ARTICLES, ARTICLE_DETAIL, CATEGORIES } from "./collections";

export const getCategories = () => {
  return firestore
    .collection(CATEGORIES)
    .orderBy("order")
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

export const removeCategory = (item: Category) => {
  return firestore.collection(CATEGORIES).doc(item.id).delete();
};

// let lastDoc: unknown = null;

const articleByCategoriesQuery = (categories: string[]) => {
  return firestore
    .collection(ARTICLES)
    .where("category", "in", categories)
    .orderBy("date", "desc");
};

const lastDocMap: Record<string, unknown> = {};

export const resetPagingFor = (categories: string[]) => {
  delete lastDocMap[JSON.stringify(categories)];
};

const mapToArticle = (doc: any) => {
  const value = doc.data();
  return {
    id: doc.id,
    ...value,
    date: value.date && value.date.toDate(),
    image: value.image || {},
  } as Article;
};

export const getArticles = (categories: string[], pageSize: number) => {
  let query = articleByCategoriesQuery(categories).limit(pageSize);
  const key = JSON.stringify(categories);
  if (lastDocMap[key] != null) {
    query = query.startAfter(lastDocMap[key]);
  }
  return query.get().then((querySnapshot) => {
    const list = querySnapshot.docs.map((doc, index, all) => {
      if (index === all.length - 1) {
        lastDocMap[key] = doc;
      }
      return mapToArticle(doc);
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
      if (doc.exists) {
        return mapToArticle(doc);
      } else {
        throw new Error("Article Does not exists");
      }
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
      const value = doc.data() || {};
      return {
        id: doc.id,
        ...value,
        content: value.content || [],
        stories: value.stories || [],
      } as ArticleDetail;
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
