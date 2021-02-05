/** @jsxImportSource @emotion/react */
import { useCallback, useContext, useMemo } from "react";
import { LayoutContext } from "src/context";
import { useAsync, useMultiLanguage } from "src/hooks";
import { SubscriptionPackage } from "src/model/app-pages";
import {
  MagazineInfo,
  OrderRequest,
  UserAddress,
  UserDetails,
} from "src/model/orders";
import * as api from "src/api/orders";
import Loading from "src/base/Loading";
import { useHistory } from "react-router-dom";

import React from "react";
import ReactDOM from "react-dom";

import Swal from "sweetalert2";
import StripePaymentButtons from "./stripe-payment";

// ignoring to use paypal
// @ts-ignore: Unreachable code error
const paypal = window.paypal;

const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

interface Iprops {
  packageInfo: SubscriptionPackage;
  userDetails: UserDetails;
  userAddress: UserAddress;
  billingDetails?: UserDetails;
  billingAddress?: UserAddress;
  magazineDetails: MagazineInfo;
}
const PaymentComponent = ({
  packageInfo,
  userDetails,
  billingAddress,
  billingDetails,
  userAddress,
  magazineDetails,
}: Iprops) => {
  const { isMobile } = useContext(LayoutContext);

  const { localize } = useMultiLanguage();

  const history = useHistory();

  const [addOrderRequest, adding] = useAsync(api.addOrderRequest);

  //   console.log({
  //     packageInfo,
  //     userDetails,
  //     billingAddress,
  //     billingDetails,
  //     userAddress,
  //     magazineDetails,
  //   });

  const orderRequest = useMemo(() => {
    return {
      packageInfo: {
        id: packageInfo.id || "-",
        term: packageInfo.term || "-",
        type: packageInfo.type || "digital",
        price: packageInfo.price || 0,
        language: packageInfo.language,
        startDate: magazineDetails && magazineDetails.startDate,
      },
      userDetails: userDetails,
      ...(userAddress ? { userAddress } : {}),
      ...(billingDetails ? { billingDetails } : {}),
      ...(billingAddress ? { billingAddress } : {}),
      transaction: {},
      orderDate: new Date(),
    } as OrderRequest;
  }, [
    billingAddress,
    billingDetails,
    magazineDetails,
    packageInfo.id,
    packageInfo.language,
    packageInfo.price,
    packageInfo.term,
    packageInfo.type,
    userAddress,
    userDetails,
  ]);

  const showSuccess = useCallback(
    (orderId: string) => {
      const title = localize("your-order-has-been-sent");
      const details = `<div>${localize(
        "the-magazine-will-be-sent"
      )}</div><div style="margin-top:5px">${localize(
        "order-number"
      )} : ${orderId}</div>`;
      const footer = `<div><div>${localize(
        "need-help-contact-us"
      )}</div><div>${localize("can-call-us")}</div><div></div>${localize(
        "can-email-us"
      )}</div>`;
      Swal.fire({
        icon: "success",
        title: title,
        html: details,
        footer: footer,
      }).then(() => {
        history.push("/subscribe");
      });
    },
    [history, localize]
  );

  const showError = useCallback((message: string) => {
    Swal.fire({
      icon: "error",
      title: message || "Error",
    });
  }, []);

  const submitData = useCallback(
    (transactionDetails: any = {}) => {
      const finalOrder = {
        ...orderRequest,
        transaction: transactionDetails,
      };
      console.log({ finalOrder });
      addOrderRequest(finalOrder).then((data) => {
        console.log({ data });
        showSuccess(data.id);
      });
    },
    [addOrderRequest, orderRequest, showSuccess]
  );

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      plan_id: packageInfo.id || packageInfo.term,
      application_context: {
        brand_name: localize("brandName"),
        shipping_preference: "NO_SHIPPING",
      },
      purchase_units: [
        {
          amount: {
            value: packageInfo.price,
          },
        },
      ],
    });
  };

  const onApprove = (data: any, actions: any) => {
    console.log({ data, actions });
    return actions.order.capture().then((details: any) => {
      console.log({ details });
      submitData(details);
    });
  };

  return (
    <div>
      {adding && <Loading />}
      <div
        css={{
          marginTop: 10,
          fontSize: 20,
          fontWeight: "bold",
          fontFamily: "'Montserrat', sans-serif",
          color: "black",
        }}
      >
        {isMobile ? <span css={{ marginLeft: 10 }} /> : ""}
        {localize("payment-details").toLocaleUpperCase()}
      </div>
      <div
        css={{
          marginTop: 5,
          padding: 10,
          borderTop: "1px solid lightgrey",
          backgroundColor: "#fbfbfb",
        }}
      >
        <div css={{ padding: 10 }}>
          <div
            css={{
              marginTop: 10,
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: "'Montserrat', sans-serif",
              color: "black",
            }}
          >
            {isMobile ? <span css={{ marginLeft: 10 }} /> : ""}
            PAYPAL
          </div>
          <div
            css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}
          >
            <PayPalButton
              amount={packageInfo.price}
              shippingPreference="NO_SHIPPING"
              createOrder={createOrder}
              onApprove={onApprove}
            />
          </div>
          <div
            css={{
              marginTop: 10,
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: "'Montserrat', sans-serif",
              color: "black",
            }}
          >
            {isMobile ? <span css={{ marginLeft: 10 }} /> : ""}
            STRIPE
          </div>
          <div
            css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}
          >
            <StripePaymentButtons
              orderRequest={orderRequest}
              showSuccess={showSuccess}
              showError={showError}
              submitData={submitData}
            />
          </div>
        </div>
        {/* <div css={{ display: "flex", justifyContent: "flex-end", margin: 20 }}>
          <button
            css={css`
              color: #fff;
              font-size: 17px;
              border-radius: 6px;
              text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.25);
              background: #333 none repeat scroll 0% 0%;
              font-weight: bold;
              font-family: "'Montserrat', sans-serif";
              padding: 10px 20px;
              cursor: pointer;
            `}
            onClick={() => {
              submitData();
            }}
          >
            {localize("complete")}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PaymentComponent;
