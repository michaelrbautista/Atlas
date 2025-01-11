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
        const {
            customerId,
            priceId,
            connectedAccountId
        } = await request.json();

        const subscription = await stripe.subscriptions.create(
            {
                application_fee_percent: 10,
                customer: customerId,
                items: [
                    {
                        price: priceId,
                    },
                ],
                expand: ['latest_invoice.payment_intent'],
            },
            {
                stripeAccount: connectedAccountId,
            }
          );

        return NextResponse.json({
            subscription: subscription
        })
    } catch (error) {
        console.log("Subscription error");
        console.log(error);

        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        )
    }
}
