import { firestore } from "src/firebase";
import firebase from "firebase/app";
import {
  Article,
  ArticleComment,
  ArticleDetail,
  Category,
} from "src/model/article";
import {
  ARTICLES,
  ARTICLE_DETAIL,
  CATEGORIES,
  COMMENTS,
  MAGAZINES,
} from "./collections";
import { SubscriptionPackage } from "src/model/app-pages";

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
  const writeBatch = firestore.batch();
  const query = firestore.collection(ARTICLES).where("category", "==", item.id);

  return query.get().then((querySnapshot) => {
    const documentsToRemove = querySnapshot.docs.map((doc) => {
      return doc.id;
    });

    const categoryRef = firestore.collection(CATEGORIES).doc(item.id);
    console.log({ item, categoryRef });
    writeBatch.delete(categoryRef);

    documentsToRemove.forEach((docId) => {
      const artRef = firestore.collection(ARTICLES).doc(docId);
      const artDetailRef = firestore.collection(ARTICLE_DETAIL).doc(docId);
      writeBatch.delete(artRef);
      writeBatch.delete(artDetailRef);
    });

    return writeBatch.commit();
  });
};

// let lastDoc: unknown = null;

export const ALL_ARTICLES_KEY = "__all__aRt__";

const articleByCategoriesQuery = (categories: string[]) => {
  if (categories[0] === ALL_ARTICLES_KEY) {
    return firestore.collection(ARTICLES).orderBy("date", "desc");
  }
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
    ...(value.date ? { date: value.date.toDate() } : {}),
    image: value.image || {},
  } as Article;
};

interface IgetArticlesProps {
  categories: string[];
  pageSize: number;
}

export const getArticles = ({ categories, pageSize }: IgetArticlesProps) => {
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
  console.log({ finalData });
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

export const getComments = (id: string) => {
  return firestore
    .collection(COMMENTS)
    .doc(id)
    .get()
    .then((doc) => {
      const value = doc.data() || ({} as any);
      const comments = value.data || [];
      return comments.map((item: any) => {
        return {
          articleId: doc.id,
          ...item,
          ...(item.date ? { date: item.date.toDate() } : {}),
        } as ArticleComment;
      });
    });
};

export const addComment = (comment: ArticleComment) => {
  const finalData = { ...comment } as any;
  const articleId = comment.articleId;
  delete finalData.articleId;
  const document = firestore.collection(COMMENTS).doc(articleId);

  return document
    .update({
      data: firebase.firestore.FieldValue.arrayUnion(comment),
    })
    .catch((err) => {
      if (err?.code === "not-found") {
        document.set({
          data: [comment],
        });
      }
    });
};

export const getAllSubscriptionPackages = () => {
  return firestore
    .collection(MAGAZINES)
    .get()
    .then((querySnapshot) => {
      const list = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as SubscriptionPackage;
      });
      return list;
    });
};

export const getEnabledSubscriptionPackages = () => {
  return firestore
    .collection(MAGAZINES)
    .where("enabled", "==", true)
    .get()
    .then((querySnapshot) => {
      const list = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as SubscriptionPackage;
      });
      return list;
    });
};

export const updateSubscriptionPackage = (item: SubscriptionPackage) => {
  const finalData = { ...item } as any;
  delete finalData.id;
  return firestore.collection(MAGAZINES).doc(item.id).set(finalData);
};

export const addSubscriptionPackage = () => {
  return firestore.collection(MAGAZINES).add({});
};

export const removeSubscriptionPackage = (id: string) => {
  return firestore.collection(MAGAZINES).doc(id).delete();
};
