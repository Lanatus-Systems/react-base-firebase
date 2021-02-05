const functions = require("firebase-functions");
const stripeEndpoints = require("./getStripeClientSecret").default;

exports.getStripeClientSecret = functions.https.onRequest(stripeEndpoints);
