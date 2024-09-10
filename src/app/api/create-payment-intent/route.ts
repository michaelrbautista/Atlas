import { NextRequest, NextResponse } from "next/server";

let stripeSecretKey;
let stripePublishableKey: string;

if (process.env.NODE_ENV === "production") {
    stripeSecretKey = process.env.STRIPE_LIVE_SECRET_KEY
    stripePublishableKey = process.env.STRIPE_LIVE_PUBLISHABLE_KEY as string
} else {
    stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY
    stripePublishableKey = process.env.STRIPE_TEST_PUBLISHABLE_KEY as string
}

const stripe = require("stripe")(stripeSecretKey);

export async function POST(request: NextRequest) {
    try {
        const {
            amount,
            destinationAccountId
        } = await request.json();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            application_fee_amount: amount * 0.1 < .50 ? .50 : amount * 0.1,
            transfer_data: {
                destination: destinationAccountId,
            },
        });

          return NextResponse.json({
            paymentIntent: paymentIntent,
            publishableKey: stripePublishableKey
          });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        )
    }
}