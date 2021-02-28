/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  PaymentRequestButtonElement,
  useStripe,
  Elements,
  CardElement,
  useElements,
} from "@stripe/react-stripe-js";
import { PaymentRequest, loadStripe } from "@stripe/stripe-js";
import { SyntheticEvent, useEffect, useState } from "react";
import Loading from "src/base/Loading";
import { useMultiLanguage } from "src/hooks";
import { OrderRequest } from "src/model/orders";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY || "-", {
  apiVersion: "2020-08-27",
});

interface IstripeButton {
  orderRequest: OrderRequest;
  showError: (msg: string) => void;
  submitData: (transaction: any) => void;
}

const getStripeClientSecret = async (
  amount: number,
  description: string,
  email: string
) => {
  console.log({ amount });
  const response = await fetch(
    `${process.env.REACT_APP_FIREBASE_FUNCTIONS_BASE_URL}/getStripeClientSecret`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        amount,
        description,
        email,
      }),
    }
  ).then((item) => item.json());
  console.log({ response });
  return response.client_secret;
};

const SmartButton = ({
  orderRequest,
  showError,
  submitData,
}: IstripeButton) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>();

  const { localize } = useMultiLanguage();

  const paymentFailMessage = localize("payment-failed");

  const { packageInfo, userDetails } = orderRequest;

  const orderTerm = packageInfo.term;
  const orderPrice = packageInfo.price;
  const email = userDetails && userDetails.email;

  useEffect(() => {
    if (stripe) {
      const amount = Math.ceil(orderPrice * 100);
      const pr = stripe.paymentRequest({
        country: "GB",
        currency: "eur",
        total: {
          label: orderTerm,
          amount: amount,
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
            const clientSecret = await getStripeClientSecret(
              amount,
              orderTerm,
              email
            );
            // console.log({ clientSecret });
            // Confirm the PaymentIntent without handling potential next actions (yet).
            const {
              paymentIntent,
              error: confirmError,
            } = await stripe.confirmCardPayment(
              clientSecret,
              {
                payment_method: ev.paymentMethod.id,
                receipt_email: email,
              },
              { handleActions: false }
            );

            console.log({ paymentIntent, confirmError });
            if (confirmError || paymentIntent == null) {
              // Report to the browser that the payment failed, prompting it to
              // re-show the payment interface, or show an error message and close
              // the payment interface.
              ev.complete("fail");
              showError(confirmError?.message || paymentFailMessage);
            } else {
              // Report to the browser that the confirmation was successful, prompting
              // it to close the browser payment method collection interface.
              ev.complete("success");
              // Check if the PaymentIntent requires any actions and if so let Stripe.js
              // handle the flow. If using an API version older than "2019-02-11" instead
              // instead check for: `paymentIntent.status === "requires_source_action"`.
              if (paymentIntent.status === "requires_action") {
                // Let Stripe.js handle the rest of the payment flow.
                const { error } = await stripe.confirmCardPayment(clientSecret);
                if (error) {
                  showError(error.message || paymentFailMessage);
                  console.log({ error });
                  // The payment failed -- ask your customer for a new payment method.
                } else {
                  submitData(paymentIntent);
                  console.log("payment success");
                  // The payment has succeeded.
                }
              } else {
                submitData(paymentIntent);
                console.log("payment success");
                // The payment has succeeded.
              }
            }
          });
        }
      });
    }
  }, [
    email,
    orderPrice,
    orderTerm,
    paymentFailMessage,
    showError,
    stripe,
    submitData,
  ]);

  console.log({ paymentRequest });
  // if (paymentRequest) {
  //   return <PaymentRequestButtonElement options={{ paymentRequest }} />;
  // }

  return (
    <div>
      {paymentRequest && (
        <div>
          <PaymentRequestButtonElement options={{ paymentRequest }} />
          <div
            css={{
              margin: 10,
              textAlign: "center",
              fontFamily: "'Montserrat', sans-serif",
              color: "black",
            }}
          >
            ---- {localize("or")} ----
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutForm = ({
  orderRequest,
  showError,
  submitData,
}: IstripeButton) => {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);

  const { localize } = useMultiLanguage();

  const paymentFailMessage = localize("payment-failed");

  const { packageInfo, userDetails, userAddress } = orderRequest;

  const userName = userDetails
    ? `${userDetails.firstName} ${userDetails.lastName}`
    : "Not Provided";
  const address = userAddress
    ? {
        line1: userAddress.address1,
        postal_code: userAddress.postcode || "NA",
        city: userAddress.town,
        state: "NA",
        country: userAddress.country,
      }
    : {
        line1: "NA",
        postal_code: "NA",
        city: "NA",
        state: "NA",
        country: "NA",
      };
  const orderPrice = packageInfo.price;
  const orderTerm = packageInfo.term;

  const email = userDetails && userDetails.email;

  const handleSubmit = async (e: SyntheticEvent) => {
    setProcessing(true);
    try {
      e.preventDefault();
      if (!stripe || !elements) {
        setProcessing(false);
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }

      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const cardElement = elements.getElement(CardElement);
      if (cardElement == null) {
        setProcessing(false);
        return;
      }

      // Use your card Element with other Stripe.js APIs
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: userName,
          address: address,
        },
      });

      console.log({ paymentMethod });

      if (error || paymentMethod == null) {
        setProcessing(false);
        console.log("[error]", error);
      } else {
        console.log("[PaymentMethod]", paymentMethod);
        const amount = Math.ceil(orderPrice * 100);

        const clientSecret = await getStripeClientSecret(
          amount,
          orderTerm,
          email
        );
        // console.log({ clientSecret });
        // Confirm the PaymentIntent without handling potential next actions (yet).
        const {
          paymentIntent,
          error: confirmError,
        } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: paymentMethod.id,
            receipt_email: email,
          }
          // { handleActions: false }
        );

        console.log({ paymentIntent, confirmError });
        if (confirmError || paymentIntent == null) {
          // Report to the browser that the payment failed, prompting it to
          // re-show the payment interface, or show an error message and close
          // the payment interface.
          console.log(confirmError);
          showError(confirmError?.message || paymentFailMessage);
        } else {
          // Report to the browser that the confirmation was successful, prompting
          // it to close the browser payment method collection interface.
          // Check if the PaymentIntent requires any actions and if so let Stripe.js
          // handle the flow. If using an API version older than "2019-02-11" instead
          // instead check for: `paymentIntent.status === "requires_source_action"`.
          if (paymentIntent.status === "requires_action") {
            // Let Stripe.js handle the rest of the payment flow.
            const { error } = await stripe.confirmCardPayment(clientSecret);
            if (error) {
              showError(error.message || paymentFailMessage);
              console.log({ error });
              // The payment failed -- ask your customer for a new payment method.
            } else {
              submitData(paymentIntent);
              console.log("payment success");
              // The payment has succeeded.
            }
          } else {
            submitData(paymentIntent);
            console.log("payment success");
            // The payment has succeeded.
          }
        }
      }
    } catch (e) {
      showError(paymentFailMessage);
      setProcessing(false);
    }
  };

  return (
    <div>
      <div css={{ padding: "10px 0px" }}>
        {localize("provide-card-details")}
      </div>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        {processing ? (
          <Loading />
        ) : (
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
              margin-top: 20px;
              width: 100%;
            `}
            type="submit"
            disabled={!stripe}
          >
            {localize("pay-securely-now")}
          </button>
        )}
      </form>
    </div>
  );
};

const StripePaymentButtons = (props: IstripeButton) => {
  return (
    <div>
      <div>
        <Elements stripe={stripePromise}>
          <SmartButton {...props} />
        </Elements>
      </div>
      <div>
        <Elements stripe={stripePromise}>
          <CheckoutForm {...props} />
        </Elements>
      </div>
    </div>
  );
};

export default StripePaymentButtons;
