import { Global, css } from "@emotion/react";

const GlobalStyles = () => {
  return (
    <>
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
          table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }

          td,
          th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }

          tr:nth-of-type(even) {
            background-color: #dddddd;
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
          .lds-ellipsis div:nth-of-type(1) {
            left: 8px;
            animation: lds-ellipsis1 0.6s infinite;
          }
          .lds-ellipsis div:nth-of-type(2) {
            left: 8px;
            animation: lds-ellipsis2 0.6s infinite;
          }
          .lds-ellipsis div:nth-of-type(3) {
            left: 32px;
            animation: lds-ellipsis2 0.6s infinite;
          }
          .lds-ellipsis div:nth-of-type(4) {
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
    </>
  );
};

export default GlobalStyles;
