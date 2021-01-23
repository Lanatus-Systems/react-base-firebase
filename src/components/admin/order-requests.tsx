import { useEffect, useState } from "react";
import { ActiveOrder, OrderRequest } from "src/model/orders";
import * as api from "src/api/orders";
import { useAsync } from "src/hooks";
import Loading from "src/base/Loading";
import { ORDER_REQUESTS } from "src/api/collections";
import OrderUpdateModal from "./order-update-modal";

const OrderRequests = () => {
  const [requests, setRequests] = useState<OrderRequest[]>();

  const [getPendingOrderRequests, loading] = useAsync(
    api.getPendingOrderRequests
  );
  const [addApprovedOrder, adding] = useAsync(api.addApprovedOrder);
  const [removeOrderRequest, removing] = useAsync(api.removeOrderRequest);

  const [orderToApprove, setOrderToApprove] = useState<OrderRequest>();

  useEffect(() => {
    api.resetPagingFor(ORDER_REQUESTS);
    getPendingOrderRequests(10).then(setRequests);
  }, [getPendingOrderRequests]);

  const removeRequest = (request: OrderRequest) => {
    removeOrderRequest(request).then(() => {
      setRequests((r) => r?.filter((item) => item.id !== request.id));
    });
  };
  const approveRequest = (request: OrderRequest) => {
    const finalOrder = {
      ...request,
      startDate: new Date(),
      endDate: new Date(),
    } as ActiveOrder;
    addApprovedOrder(finalOrder).then(() => {
      removeRequest(request);
    });
  };

  return (
    <div>
      <div>
        <h1>Order Requests</h1>
      </div>
      <div>{(loading || adding || removing) && <Loading />}</div>
      {orderToApprove && (
        <OrderUpdateModal
          hide={() => {
            setOrderToApprove(undefined);
          }}
          order={orderToApprove as ActiveOrder}
          title="Update Order"
          onOk={(updated) => {
            approveRequest(updated);
            setOrderToApprove(undefined);
          }}
        />
      )}
      <div>
        {requests &&
          requests.map((item) => {
            return (
              <div
                key={item.id}
                style={{ border: "1px solid lightgrey", margin: 10 }}
              >
                <pre>{JSON.stringify(item, null, 4)}</pre>
                <button
                  onClick={() => {
                    approveRequest(item);
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm("Are you sure, you want to remove request?")
                    ) {
                      removeRequest(item);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}
      </div>
      <div style={{ margin: 20 }}>
        {requests && requests.length === 0 ? (
          "No More Pending Requests Found"
        ) : (
          <button
            onClick={() => {
              getPendingOrderRequests(10).then(setRequests);
            }}
          >
            load more
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderRequests;
