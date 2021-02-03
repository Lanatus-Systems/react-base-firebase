/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useContext, useState, useEffect, SyntheticEvent } from "react";
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

import {
  PaymentRequestButtonElement,
  useStripe,
  Elements,
  CardElement,
} from "@stripe/react-stripe-js";
import { PaymentRequest, loadStripe } from "@stripe/stripe-js";

import Swal from "sweetalert2";

// ignoring to use paypal
// @ts-ignore: Unreachable code error
const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

const stripePromise = loadStripe("pk_live_21ddE3jYsoHBbJgWLFJ12ede00UaZzWDA7", {
  apiVersion: "2020-08-27",
});

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (e: SyntheticEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) {
//       // Stripe.js has not loaded yet. Make sure to disable
//       // form submission until Stripe.js has loaded.
//       return;
//     }

//     // Get a reference to a mounted CardElement. Elements knows how
//     // to find your CardElement because there can only ever be one of
//     // each type of element.
//     const cardElement = elements.getElement(CardElement);

//     if(cardElement == null){
//       return;
//     }

//     // Use your card Element with other Stripe.js APIs
//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: "card",
//       card: cardElement,
//     });

//     if (error) {
//       console.log("[error]", error);
//     } else {
//       console.log("[PaymentMethod]", paymentMethod);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement
//         options={{
//           style: {
//             base: {
//               fontSize: "16px",
//               color: "#424770",
//               "::placeholder": {
//                 color: "#aab7c4",
//               },
//             },
//             invalid: {
//               color: "#9e2146",
//             },
//           },
//         }}
//       />
//       <button type="submit" disabled={!stripe}>
//         Pay
//       </button>
//     </form>
//   );
// };

interface IstripeCheckout {
  packageInfo: SubscriptionPackage;
}

const CheckoutForm = ({ packageInfo }: IstripeCheckout) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>();

  const { derive } = useMultiLanguage();

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "GB",
        currency: "eur",
        total: {
          label: derive(packageInfo.title),
          amount: Math.ceil(packageInfo.price * 100),
        },
        // requestPayerName: true,
        // requestPayerEmail: true,
      });

      console.log({ pr });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        console.log({ result });
        if (result) {
          setPaymentRequest(pr);

          pr.on("paymentmethod", async (ev) => {
            console.log({ ev });
            // Confirm the PaymentIntent without handling potential next actions (yet).
            // const {paymentIntent, error: confirmError} = await stripe.confirmCardPayment(
            //   clientSecret,
            //   {payment_method: ev.paymentMethod.id},
            //   {handleActions: false}
            // );

            // if (confirmError) {
            //   // Report to the browser that the payment failed, prompting it to
            //   // re-show the payment interface, or show an error message and close
            //   // the payment interface.
            //   ev.complete('fail');
            // } else {
            //   // Report to the browser that the confirmation was successful, prompting
            //   // it to close the browser payment method collection interface.
            //   ev.complete('success');
            //   // Check if the PaymentIntent requires any actions and if so let Stripe.js
            //   // handle the flow. If using an API version older than "2019-02-11" instead
            //   // instead check for: `paymentIntent.status === "requires_source_action"`.
            //   if (paymentIntent.status === "requires_action") {
            //     // Let Stripe.js handle the rest of the payment flow.
            //     const {error} = await stripe.confirmCardPayment(clientSecret);
            //     if (error) {
            //       // The payment failed -- ask your customer for a new payment method.
            //     } else {
            //       // The payment has succeeded.
            //     }
            //   } else {
            //     // The payment has succeeded.
            //   }
            // }
          });
        }
      });
    }
  }, [derive, packageInfo.price, packageInfo.title, stripe]);

  console.log({ paymentRequest });
  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{ paymentRequest }} />;
  }

  // const handleSubmit = async (e: SyntheticEvent) => {
  //   e.preventDefault();
  // if (!stripe || !elements) {
  //   // Stripe.js has not loaded yet. Make sure to disable
  //   // form submission until Stripe.js has loaded.
  //   return;
  // }

  // // Get a reference to a mounted CardElement. Elements knows how
  // // to find your CardElement because there can only ever be one of
  // // each type of element.
  // const cardElement = elements.getElement(CardElement);

  // if (cardElement == null) {
  //   return;
  // }

  // // Use your card Element with other Stripe.js APIs
  // const { error, paymentMethod } = await stripe.createPaymentMethod({
  //   type: "card",
  //   card: cardElement,
  // });

  // if (error) {
  //   console.log("[error]", error);
  // } else {
  //   console.log("[PaymentMethod]", paymentMethod);
  // }
  // };

  return (
    <Loading />
    // <form onSubmit={handleSubmit}>
    //   <CardElement
    //     options={{
    //       style: {
    //         base: {
    //           fontSize: "16px",
    //           color: "#424770",
    //           "::placeholder": {
    //             color: "#aab7c4",
    //           },
    //         },
    //         invalid: {
    //           color: "#9e2146",
    //         },
    //       },
    //     }}
    //   />
    //   <button type="submit" disabled={!stripe}>
    //     Pay
    //   </button>
    // </form>
  );
};
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

  const submitData = (transactionDetails: any = {}) => {
    const finalOrder = {
      package: {
        id: packageInfo.id || "-",
        term: packageInfo.term || "-",
        type: packageInfo.type || "digital",
        price: packageInfo.price || 0,
        language: packageInfo.language,
        startDate: magazineDetails.startDate,
      },
      userDetails: userDetails,
      ...(userAddress ? { userAddress } : {}),
      ...(billingDetails ? { billingDetails } : {}),
      ...(billingAddress ? { billingAddress } : {}),
      transaction: transactionDetails,
      orderDate: new Date(),
    } as OrderRequest;
    console.log({ finalOrder });
    addOrderRequest(finalOrder).then((data) => {
      console.log({ data });
      const title = localize("your-order-has-been-sent");
      const details = `<div>${localize(
        "the-magazine-will-be-sent"
      )}</div><div style="margin-top:5px">${localize("order-number")} : ${
        data.id
      }</div>`;
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
    });
  };

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
            <Elements stripe={stripePromise}>
              <CheckoutForm packageInfo={packageInfo} />
            </Elements>
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
