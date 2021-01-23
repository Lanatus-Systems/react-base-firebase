import { useEffect, useState } from "react";
import { ActiveOrder } from "src/model/orders";
import * as api from "src/api/orders";
import { useAsync } from "src/hooks";
import Loading from "src/base/Loading";
import { ACTIVE_ORDERS } from "src/api/collections";
import OrderUpdateModal from "./order-update-modal";

const ManageOrders = () => {
  const [orderList, setOrderList] = useState<ActiveOrder[]>();
  const [orderToUpdate, setOrderToUpdate] = useState<ActiveOrder>();

  const [getOrderDetails, loading] = useAsync(api.getOrderDetails);
  const [updateOrderDetails, updating] = useAsync(api.updateOrderDetails);
  const [deleteOrder, deleting] = useAsync(api.deleteOrder);

  useEffect(() => {
    api.resetPagingFor(ACTIVE_ORDERS);
    getOrderDetails(10).then(setOrderList);
  }, [getOrderDetails]);

  const updateOrder = (updated: ActiveOrder) => {
    updateOrderDetails(updated).then(() => {
      setOrderList((list) =>
        list?.map((item) => (item.id === updated.id ? updated : item))
      );
    });
  };

  console.log({ orderList });
  const removeOrder = (removed: ActiveOrder) => {
    deleteOrder(removed).then(() => {
      setOrderList((list) => list?.filter((item) => item.id !== removed.id));
    });
  };

  return (
    <div>
      <div>
        <h1>Order Requests</h1>
      </div>
      <div>{(loading || updating || deleting) && <Loading />}</div>
      {orderToUpdate && (
        <OrderUpdateModal
          hide={() => {
            setOrderToUpdate(undefined);
          }}
          order={orderToUpdate}
          title="Update Order"
          onOk={(updated) => {
            updateOrder(updated);
            setOrderToUpdate(undefined);
          }}
        />
      )}
      <div>
        {orderList &&
          orderList.map((item) => {
            return (
              <div
                key={item.id}
                style={{ border: "1px solid lightgrey", margin: 10 }}
              >
                <pre>{JSON.stringify(item, null, 4)}</pre>
                <button
                  onClick={() => {
                    setOrderToUpdate(item);
                  }}
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm("Are you sure, you want to remove order?")
                    ) {
                      removeOrder(item);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })}
      </div>
      <div style={{ margin: 20 }}>
        {orderList && orderList.length === 0 ? (
          "No Orders Found"
        ) : (
          <button
            onClick={() => {
              getOrderDetails(10).then(setOrderList);
            }}
          >
            load more
          </button>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
