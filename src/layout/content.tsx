import { Route } from "react-router-dom";
import Categories from "src/components/admin/categories";
import Home from "src/components/articles";
import ArticlePage from "src/components/articles/article-page";
import ArticleContent from "src/components/articles/article-content";

import LoginPage from "src/components/login";
import { LayoutContext } from "src/context";
import { useContext } from "react";
import Subscribe from "src/components/subscribe";
import Checkout from "src/components/subscribe/checkout";

const Content = () => {
  const { isMobile } = useContext(LayoutContext);
  return (
    <div
      style={{
        minHeight: "70vh",
        marginTop: isMobile ? 135 : 180,
        background: "white",
      }}
    >
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/categories" component={Categories} />
      <Route exact path="/subscribe" component={Subscribe} />
      <Route exact path="/checkout" component={Checkout} />

      <Route exact path="/articles/:category" component={ArticlePage} />
      <Route exact path="/article-content/:id" component={ArticleContent} />
      <Route exact path="/" component={Home} />
    </div>
  );
};

export default Content;
