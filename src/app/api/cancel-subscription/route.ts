import { NextRequest, NextResponse } from "next/server";

let stripeSecretKey;
if (process.env.NODE_ENV === "production") {
    stripeSecretKey = process.env.STRIPE_LIVE_SECRET_KEY
} else {
    stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY
}

const stripe = require("stripe")(stripeSecretKey);

export async function DELETE(request: NextRequest) {
    try {
        const {
            connectedAccountId,
            subscriptionId
        } = await request.json();

        const subscription = await stripe.subscriptions.cancel(
            subscriptionId,
            {
                stripeAccount: connectedAccountId
            }
        );

        console.log(subscription);

        return NextResponse.json({
            subscriptionId: subscription.id
        })
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        )
    }
}