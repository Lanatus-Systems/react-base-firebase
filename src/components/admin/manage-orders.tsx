/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { ActiveOrder } from "src/model/orders";
import * as api from "src/api/orders";
import { useAsync } from "src/hooks";
import Loading from "src/base/Loading";
import { ACTIVE_ORDERS } from "src/api/collections";
import OrderUpdateModal from "./order-update-modal";
import dayjs from "dayjs";
import { ADMIN_DATE_FORMAT_UI, ADMIN_DATE_TIME_FORMAT_UI } from "src/constants";
import { ENGLISH } from "src/i18n/languages";

const defaultFrom = dayjs()
  .startOf("day")
  .add(-1, "day")
  .format("YYYY-MM-DDTHH:mm");
const defaultTo = dayjs().endOf("day").format("YYYY-MM-DDTHH:mm");

const defaultQueryField = "orderDate";

const ManageOrders = () => {
  const [orderList, setOrderList] = useState<ActiveOrder[]>();
  const [orderToUpdate, setOrderToUpdate] = useState<ActiveOrder>();

  const [orderId, setOrderId] = useState("");

  const [getOrderDetails, loading] = useAsync(api.getOrderDetails);
  const [updateOrderDetails, updating] = useAsync(api.updateOrderDetails);
  const [deleteOrder, deleting] = useAsync(api.deleteOrder);

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [queryField, setQueryField] = useState(defaultQueryField);
  console.log({ fromDate, toDate });

  const [orderBy, setOrderBy] = useState("desc");

  const [retrieveEnabled, setRetrieveEnabled] = useState(false);

  const retrieveData = () => {
    api.resetPagingFor(ACTIVE_ORDERS);
    getOrderDetails({
      pageSize: 10,
      field: queryField,
      from: new Date(fromDate),
      to: new Date(toDate),
      order: orderBy,
    }).then(setOrderList);
  };

  const nextPage = () => {
    getOrderDetails({
      pageSize: 10,
      field: queryField,
      from: new Date(fromDate),
      to: new Date(toDate),
      order: orderBy,
    }).then(setOrderList);
  };
  useEffect(() => {
    getOrderDetails({
      pageSize: 10,
      field: defaultQueryField,
      from: new Date(defaultFrom),
      to: new Date(defaultTo),
      order: "desc",
    }).then(setOrderList);
  }, [getOrderDetails]);

  useEffect(() => {
    setRetrieveEnabled(true);
  }, [fromDate, toDate, queryField]);

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
        <h1>Manage Orders</h1>
      </div>
      <div css={{ display: "flex", marginBottom: 10 }}>
        <label>From : </label>
        <input
          type="datetime-local"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />{" "}
        <label css={{ marginLeft: 10 }}>To : </label>
        <input
          type="datetime-local"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <label css={{ marginLeft: 10 }}>Retrieve By : </label>
        <select
          css={{ marginLeft: 10 }}
          value={queryField}
          onChange={(e) => setQueryField(e.target.value)}
        >
          <option value="orderDate">Order Date</option>
          <option value="startDate">Start Date</option>
          <option value="endDate">End Date</option>
        </select>
        <label css={{ marginLeft: 10 }}>Order : </label>
        <select
          css={{ marginLeft: 10 }}
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button
          css={{ marginLeft: 10 }}
          onClick={() => {
            retrieveData();
            setRetrieveEnabled(false);
          }}
          disabled={!retrieveEnabled}
        >
          Retrieve
        </button>
      </div>
      <div css={{ display: "flex", marginBottom: 10 }}>
        <label>Order Id : </label>
        <input value={orderId} onChange={(e) => setOrderId(e.target.value)} />
        <button
          css={{ marginLeft: 10 }}
          onClick={() => {
            api.getOrderDetail(orderId).then((val) => setOrderList([val]));
          }}
        >
          Load
        </button>
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
      <table>
        <thead>
          <tr>
            <th>Order Date</th>
            <th>Order ID</th>
            <th>Variant</th>
            <th>Language</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {orderList &&
            orderList.map((item) => {
              return (
                <tr key={item.id}>
                  <td>
                    {dayjs(item.orderDate).format(ADMIN_DATE_TIME_FORMAT_UI)}
                  </td>
                  <td>{item.id}</td>
                  <td>{item.packageInfo.type}</td>
                  <td>
                    {item.packageInfo.language === ENGLISH
                      ? "English"
                      : "French"}
                  </td>
                  <td>{dayjs(item.startDate).format(ADMIN_DATE_FORMAT_UI)}</td>
                  <td>{dayjs(item.endDate).format(ADMIN_DATE_FORMAT_UI)}</td>
                  <td>
                    <button
                      onClick={() => {
                        setOrderToUpdate(item);
                      }}
                    >
                      View/Update
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure, you want to remove order?"
                          )
                        ) {
                          removeOrder(item);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div style={{ margin: 20 }}>
        {orderList && orderList.length === 0 ? (
          "No Orders Found"
        ) : (
          <button
            onClick={() => {
              nextPage();
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
