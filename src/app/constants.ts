export const constants = {
    serverUrl: process.env.NODE_ENV === "development"
        ? "http://localhost:4000"
        : "https://expressserver-yffd.onrender.com",
    stripeKey: process.env.NODE_ENV === "development"
        ? process.env.STRIPE_TEST_PUBLISHABLE_KEY
        : process.env.STRIPE_LIVE_PUBLISHABLE_KEY,
};