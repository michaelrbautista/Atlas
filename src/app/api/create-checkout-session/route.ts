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
            priceId,
            creatorId,
            creatorUsername,
            userId,
            destinationAccountId,
            customerId,
            customerEmail
        } = await request.json();

        const session = await stripe.checkout.sessions.create(
            {
                payment_method_types: ["card"],
                customer: customerId,
                customer_email: customerEmail,
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    }
                ],
                mode: "subscription",
                ui_mode: "embedded",
                metadata: {
                    creatorId: creatorId,
                    userId: userId
                },
                return_url: `${request.headers.get("origin")}/checkout/{CHECKOUT_SESSION_ID}?creator=${creatorUsername}`
            },
            {
                stripeAccount: destinationAccountId
            }
        );

        console.log("Checkout session: ", session.id);

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
