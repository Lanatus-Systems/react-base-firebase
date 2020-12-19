import { Route } from "react-router-dom";
import LoginPage from "src/components/login";
import Test from "src/components/test";

const Content = () => {
  return (
    <div style={{ height: "80vh" }}>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/" component={Test} />
    </div>
  );
};

export default Content;
