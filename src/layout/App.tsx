import { BrowserRouter } from "react-router-dom";
import Content from "./content";
import Footer from "./footer";
import Header from "./header";

import { css, Global } from "@emotion/react";

const App = () => {
  return (
    <BrowserRouter>
      <Global
        styles={css`
          body {
            font-family: "Sniglet";
          }
          ::-moz-selection {
            background: red;
          }
          ::selection {
            background: red;
          }
        `}
      />
      <Header />
      <Content />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
