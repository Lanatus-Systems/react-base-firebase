import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {
  AuthContextProvider,
  GlobalContextProvider,
  LayoutContextProvider,
} from "./context";

import App from "./layout/App";

import reportWebVitals from "./reportWebVitals";

import "./i18n/config";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "src/style-utils/styles/quill-styles-overrides.css";

const ReactApp = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthContextProvider>
          <LayoutContextProvider>
            <GlobalContextProvider>
              <App />
            </GlobalContextProvider>
          </LayoutContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.render(<ReactApp />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
