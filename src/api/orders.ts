import { firestore } from "src/firebase";
import { OrderRequest, ActiveOrder, UserMagazine } from "src/model/orders";
import { ACTIVE_ORDERS, ORDER_REQUESTS, USER_MAGAZINE } from "./collections";

const lastDocMap: Record<string, unknown> = {};
export const resetPagingFor = (collectionName: string) => {
  delete lastDocMap[collectionName];
};

export const getPendingOrderRequests = (pageSize: number) => {
  let query = firestore
    .collection(ORDER_REQUESTS)
    .orderBy("orderDate", "desc")
    .limit(pageSize);
  if (lastDocMap[ORDER_REQUESTS] != null) {
    query = query.startAfter(lastDocMap[ORDER_REQUESTS]);
  }
  return query.get().then((querySnapshot) => {
    const list = querySnapshot.docs.map((doc, index, all) => {
      if (index === all.length - 1) {
        lastDocMap[ORDER_REQUESTS] = doc;
      }
      const value = doc.data();
      return {
        id: doc.id,
        ...value,
        ...(value.orderDate ? { orderDate: value.orderDate.toDate() } : {}),
        packageInfo: value.packageInfo || value.package,
      } as OrderRequest;
    });
    return list;
  });
};

export const addOrderRequest = (item: OrderRequest) => {
  return firestore.collection(ORDER_REQUESTS).add(item);
};

export const removeOrderRequest = (item: OrderRequest) => {
  return firestore.collection(ORDER_REQUESTS).doc(item.id).delete();
};

export const addMagazinePdfAccess = (userMagazine: UserMagazine) => {
  return firestore.collection(USER_MAGAZINE).add(userMagazine);
};

export const getUserMagazines = (email: string) => {
  return firestore
    .collection(USER_MAGAZINE)
    .where("email", "==", email)
    .get()
    .then((querySnapshot) => {
      const list = querySnapshot.docs.map((doc) => {
        const value = doc.data();
        return {
          id: doc.id,
          ...value,
        } as UserMagazine;
      });
      return list;
    });
};

interface IorderRequestCriteria {
  pageSize: number;
  from: Date;
  to: Date;
  field: string;
  order: string;
}

const ordersBetweenAndOrderedByDate = (
  field: string,
  from: Date,
  to: Date,
  order: string
) => {
  console.log({ from, to });
  return firestore
    .collection(ACTIVE_ORDERS)
    .where(field, ">=", from)
    .where(field, "<=", to)
    .orderBy(field, order === "asc" ? "asc" : "desc");
};

export const getOrderDetails = ({
  pageSize,
  field,
  from,
  to,
  order,
}: IorderRequestCriteria) => {
  let query = ordersBetweenAndOrderedByDate(field, from, to, order).limit(
    pageSize
  );
  if (lastDocMap[ACTIVE_ORDERS] != null) {
    query = query.startAfter(lastDocMap[ACTIVE_ORDERS]);
  }
  return query.get().then((querySnapshot) => {
    const list = querySnapshot.docs.map((doc, index, all) => {
      if (index === all.length - 1) {
        lastDocMap[ACTIVE_ORDERS] = doc;
      }
      const value = doc.data();
      console.log({ value });
      return {
        id: doc.id,
        ...value,
        ...(value.orderDate ? { orderDate: value.orderDate.toDate() } : {}),
        ...(value.startDate ? { startDate: value.startDate.toDate() } : {}),
        ...(value.endDate ? { endDate: value.endDate.toDate() } : {}),
        packageInfo: value.packageInfo || value.package,
      } as ActiveOrder;
    });
    return list;
  });
};

export const getOrderDetail = (id: string) => {
  return firestore
    .collection(ACTIVE_ORDERS)
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const value = doc.data();
        return { id: doc.id, ...value } as ActiveOrder;
      } else {
        throw new Error("Article Does not exists");
      }
    });
};

export const addApprovedOrder = (item: ActiveOrder) => {
  const orderId = item.id;
  delete item.id;
  return firestore.collection(ACTIVE_ORDERS).doc(orderId).set(item);
};

export const updateOrderDetails = (item: ActiveOrder) => {
  return addApprovedOrder(item);
};

export const deleteOrder = (item: ActiveOrder) => {
  return firestore.collection(ACTIVE_ORDERS).doc(item.id).delete();
};
