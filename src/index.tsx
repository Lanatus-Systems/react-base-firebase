import React from "react";
import ReactDOM from "react-dom";
import { AuthContextProvider, LayoutContextProvider } from "./context";

import App from "./layout/App";

import "./i18n/config";

import reportWebVitals from "./reportWebVitals";

const ReactApp = () => {
  return (
    <React.StrictMode>
      <AuthContextProvider>
        <LayoutContextProvider>
          <App />
        </LayoutContextProvider>
      </AuthContextProvider>
    </React.StrictMode>
  );
};

ReactDOM.render(<ReactApp />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
