/** @jsxImportSource @emotion/react */
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "src/context";
import LoginPage from "../login";
import Categories from "./categories";
import ManageOrders from "./manage-orders";
import OrderRequests from "./order-requests";

const AdminHeader = () => {
  return (
    <div css={{ boxShadow: "2px 2px lightgrey", background: "white" }}>
      <div css={{ background: "black", height: 10 }} />
      <div css={{ height: 50, display: "flex", alignItems: "center" }}>
        <Link to="/" css={{ margin: 10 }}>
          Home
        </Link>
        <Link to="/admin/categories" css={{ margin: 10 }}>
          Categories
        </Link>
        <Link to="/admin/manage-orders" css={{ margin: 10 }}>
          Manage Orders
        </Link>
        <Link to="/admin/order-requests" css={{ margin: 10 }}>
          Pending Order Requests
        </Link>{" "}
      </div>
    </div>
  );
};

interface Iprarams {
  menu: string;
}

const AdminZone = () => {
  const { menu } = useParams<Iprarams>();
  const { roles } = useContext(AuthContext);
  if (!roles.admin) {
    return <div>Only Admins are allowed to access this page</div>;
  }
  return (
    <div>
      <AdminHeader />
      <div css={{ margin: 10 }}>
        {menu === "login" && <LoginPage />}
        {menu === "categories" && <Categories />}
        {menu === "manage-orders" && <ManageOrders />}
        {menu === "order-requests" && <OrderRequests />}
      </div>
    </div>
  );
};

export default AdminZone;
