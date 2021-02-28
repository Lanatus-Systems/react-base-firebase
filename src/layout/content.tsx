import { Route } from "react-router-dom";
import Home from "src/components/articles";
import ArticlePage from "src/components/articles/article-page";
import ArticleContent from "src/components/articles/article-content";

import { LayoutContext } from "src/context";
import { useContext } from "react";
import Subscribe from "src/components/subscribe";
import Checkout from "src/components/subscribe/checkout";
import AdminZone from "src/components/admin/adminZone";
import UserMagazines from "src/components/magazines";
import PdfView from "src/components/magazines/pdf-view";

const Content = () => {
  const { isMobile, isHeaderHidden } = useContext(LayoutContext);

  return (
    <div
      style={{
        minHeight: "70vh",
        marginTop: isHeaderHidden ? 0 : isMobile ? 135 : 180,
        background: "white",
      }}
    >
      <Route exact path="/admin" component={AdminZone} />
      <Route exact path="/admin/:menu" component={AdminZone} />
      <Route exact path="/subscribe" component={Subscribe} />
      <Route exact path="/checkout" component={Checkout} />
      <Route exact path="/pdf-view" component={PdfView} />

      <Route exact path="/articles/:category" component={ArticlePage} />
      <Route exact path="/article-content/:id" component={ArticleContent} />
      <Route exact path="/my-magazines" component={UserMagazines} />
      <Route exact path="/" component={Home} />
    </div>
  );
};

export default Content;
