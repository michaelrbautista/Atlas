import Stripe from "stripe";

let stripeSecretKey;

if (process.env.NODE_ENV === "production") {
    stripeSecretKey = process.env.STRIPE_LIVE_SECRET_KEY as string
} else {
    stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY as string
}

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20",
    typescript: true
});
