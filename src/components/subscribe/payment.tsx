/** @jsxImportSource @emotion/react */
import { useCallback, useContext, useMemo } from "react";
import { AuthContext, LayoutContext } from "src/context";
import { useAsync, useMultiLanguage } from "src/hooks";
import { SubscriptionPackage } from "src/model/app-pages";
import {
  MagazineInfo,
  OrderRequest,
  UserAddress,
  UserDetails,
  UserMagazine,
} from "src/model/orders";
import * as api from "src/api/orders";
import Loading from "src/base/Loading";
import { useHistory } from "react-router-dom";

import React from "react";
import ReactDOM from "react-dom";

import Swal from "sweetalert2";
import StripePaymentButtons from "./stripe-payment";
import { ENGLISH } from "src/i18n/languages";

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

  const { user } = useContext(AuthContext);

  const [addOrderRequest, adding] = useAsync(api.addOrderRequest);
  const [addMagazinePdfAccess, addingPdfAccess] = useAsync(
    api.addMagazinePdfAccess
  );

  //   console.log({
  //     packageInfo,
  //     userDetails,
  //     billingAddress,
  //     billingDetails,
  //     userAddress,
  //     magazineDetails,
  //   });

  const orderRequest = useMemo(() => {
    const language = packageInfo.language || ENGLISH;
    return {
      packageInfo: {
        id: packageInfo.id || "-",
        term: packageInfo.term || "-",
        type: packageInfo.type || "digital",
        price: packageInfo.price || 0,
        language: language,
        startDate: magazineDetails && magazineDetails.startDate,
        image: packageInfo.image && packageInfo.image[language],
        pdf: packageInfo.pdf && packageInfo.pdf[language],
        priceOffer: packageInfo.priceOffer && packageInfo.priceOffer[language],
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
    packageInfo,
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
        history.push("/my-magazines");
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
        const orderId = data.id;
        if (orderRequest.packageInfo.pdf) {
          addMagazinePdfAccess({
            orderId,
            email: user?.email,
            pdf: orderRequest.packageInfo.pdf,
            image: orderRequest.packageInfo.image,
            price: orderRequest.packageInfo.price,
            term: orderRequest.packageInfo.term,
            priceOffer: orderRequest.packageInfo.priceOffer,
          } as UserMagazine).then(() => {
            showSuccess(orderId);
          });
        } else {
          showSuccess(orderId);
        }
      });
    },
    [addMagazinePdfAccess, addOrderRequest, orderRequest, showSuccess, user]
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
      {adding && addingPdfAccess && <Loading />}
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
              showError={showError}
              submitData={submitData}
            />
          </div>
        </div>
        {/* <div css={{ display: "flex", justifyContent: "flex-end", margin: 20 }}>
          <button
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
