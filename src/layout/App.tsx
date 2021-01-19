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
          ::-moz-selection {
            color: white;
            background: red;
          }
          ::selection {
            color: white;
            background: red;
          }
        `}
      />
      <Global
        styles={css`
          .lds-ellipsis {
            display: inline-block;
            position: relative;
            width: 80px;
            min-height: 30px;
            height: 100%;
          }
          .lds-ellipsis div {
            position: absolute;
            top: 38%;
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background: #fff;
            animation-timing-function: cubic-bezier(0, 1, 1, 0);
          }
          .lds-ellipsis div:nth-child(1) {
            left: 8px;
            animation: lds-ellipsis1 0.6s infinite;
          }
          .lds-ellipsis div:nth-child(2) {
            left: 8px;
            animation: lds-ellipsis2 0.6s infinite;
          }
          .lds-ellipsis div:nth-child(3) {
            left: 32px;
            animation: lds-ellipsis2 0.6s infinite;
          }
          .lds-ellipsis div:nth-child(4) {
            left: 56px;
            animation: lds-ellipsis3 0.6s infinite;
          }
          @keyframes lds-ellipsis1 {
            0% {
              transform: scale(0);
            }
            100% {
              transform: scale(1);
            }
          }
          @keyframes lds-ellipsis3 {
            0% {
              transform: scale(1);
            }
            100% {
              transform: scale(0);
            }
          }
          @keyframes lds-ellipsis2 {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(24px, 0);
            }
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
