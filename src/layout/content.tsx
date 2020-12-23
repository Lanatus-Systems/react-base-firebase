import { Route } from "react-router-dom";
import Categories from "src/components/admin/categories";
import LoginPage from "src/components/login";

const Content = () => {
  return (
    <div style={{ height: "1000vh" }}>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/" component={Categories} />
    </div>
  );
};

export default Content;
