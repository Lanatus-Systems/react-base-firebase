import { firestore } from "src/firebase";
import { OrderRequest, ActiveOrder } from "src/model/orders";
import { ACTIVE_ORDERS, ORDER_REQUESTS } from "./collections";

const lastDocMap: Record<string, unknown> = {};
export const resetPagingFor = (collectionName: string) => {
  delete lastDocMap[collectionName];
};

export const getPendingOrderRequests = (pageSize: number) => {
  let query = firestore.collection(ORDER_REQUESTS).limit(pageSize);
  if (lastDocMap[ORDER_REQUESTS] != null) {
    query = query.startAfter(lastDocMap[ORDER_REQUESTS]);
  }
  return query.get().then((querySnapshot) => {
    const list = querySnapshot.docs.map((doc, index, all) => {
      if (index === all.length - 1) {
        lastDocMap[ORDER_REQUESTS] = doc;
      }
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
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

export const getOrderDetails = (pageSize: number) => {
  let query = firestore.collection(ACTIVE_ORDERS).limit(pageSize);
  if (lastDocMap[ACTIVE_ORDERS] != null) {
    query = query.startAfter(lastDocMap[ACTIVE_ORDERS]);
  }
  return query.get().then((querySnapshot) => {
    const list = querySnapshot.docs.map((doc, index, all) => {
      if (index === all.length - 1) {
        lastDocMap[ACTIVE_ORDERS] = doc;
      }
      const value = doc.data();
      return {
        id: doc.id,
        ...value,
        startDate: value.startDate && value.startDate.toDate(),
        endDate: value.endDate && value.endDate.toDate(),
      } as ActiveOrder;
    });
    return list;
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
