import { Route } from "react-router-dom";
import Categories from "src/components/admin/categories";
import Home from "src/components/articles";
import ArticleList from "src/components/articles/article-list";
import LoginPage from "src/components/login";

const Content = () => {
  return (
    <div style={{ minHeight: "80vh", marginTop: "175px", background: "white" }}>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/categories" component={Categories} />
      <Route exact path="/articles/:category" component={ArticleList} />
      <Route exact path="/" component={Home} />
    </div>
  );
};

export default Content;
