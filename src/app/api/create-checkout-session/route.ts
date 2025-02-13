import convertToSubcurrency from "@/utils/stripe/convertToSubcurrency";
import { NextRequest, NextResponse } from "next/server";

let stripeSecretKey;

if (process.env.NODE_ENV === "production") {
    stripeSecretKey = process.env.STRIPE_LIVE_SECRET_KEY
} else {
    stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY
}

const stripe = require("stripe")(stripeSecretKey);

export async function POST(request: NextRequest) {
    try {
        // Subscription
        const {
            // Both payment methods
            destinationAccountId,
            creatorId,
            creatorUsername,
            userId,
            userEmail,
            // One time payment
            isOneTime,
            price,
            programId,
            programTitle,
            // Subscription
            priceId,
            customerId
        } = await request.json();

        let checkoutSessionBody;

        if (isOneTime) {
            console.log("ONE TIME PAYMENT");
            checkoutSessionBody = {
                customer_email: userEmail,
                line_items: [
                    {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: programTitle,
                        },
                        unit_amount: convertToSubcurrency(price),
                    },
                    quantity: 1,
                    },
                ],
                payment_intent_data: {
                    application_fee_amount: Math.round(convertToSubcurrency(price) * .1),
                },
                mode: "payment",
                ui_mode: "embedded",
                metadata: {
                    paymentType: "one-time",
                    programId: programId,
                    creatorId: creatorId,
                    userId: userId
                },
                return_url: `${request.headers.get("origin")}/checkout/{CHECKOUT_SESSION_ID}?program=${programId}`
            }
        } else if (customerId) {
            console.log("SUBSCRIPTION");
            checkoutSessionBody = {
                payment_method_types: ["card"],
                customer: customerId,
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    }
                ],
                mode: "subscription",
                ui_mode: "embedded",
                metadata: {
                    paymentType: "subscription",
                    creatorId: creatorId,
                    userId: userId
                },
                return_url: `${request.headers.get("origin")}/checkout/{CHECKOUT_SESSION_ID}?creator=${creatorUsername}`
            }
        } else {
            console.log("SUBSCRIPTION");
            checkoutSessionBody = {
                payment_method_types: ["card"],
                customer_email: userEmail,
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    }
                ],
                mode: "subscription",
                ui_mode: "embedded",
                metadata: {
                    paymentType: "subscription",
                    creatorId: creatorId,
                    userId: userId
                },
                return_url: `${request.headers.get("origin")}/checkout/{CHECKOUT_SESSION_ID}?creator=${creatorUsername}`
            }
        }

        const session = await stripe.checkout.sessions.create(
            checkoutSessionBody,
            {
                stripeAccount: destinationAccountId
            }
        );

        return NextResponse.json({
            clientSecret: session.client_secret
        })
    } catch (error) {
        console.log("Checkout session error");
        console.log(error);

        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        )
    }
}
