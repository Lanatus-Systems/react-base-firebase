const functions = require("firebase-functions");
const Stripe = require("stripe");

console.log({ config: functions.config() });
const stripe = Stripe(functions.config().stripe.secret);
const { handleResponse, handleError } = require("./http-utils");
const express = require("express");
const cors = require("cors");

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post("/", async (req, res) => {
  try {
    console.log({ body: req.body });
    const {
      amount,
      description = "buying magazine for " + amount + " Cent",
      email,
    } = req.body;
    console.log({ amount });
    if (amount == null) {
      throw new Error("amount should be provided");
    }
    const intent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "eur",
      receipt_email: email,
      description,
      // Verify your integration in this guide by including this parameter
      metadata: { integration_check: "accept_a_payment" },
    });
    handleResponse(res, { client_secret: intent.client_secret });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
    handleError(res, { message: errMsg });
  }
});

exports.default = app;
