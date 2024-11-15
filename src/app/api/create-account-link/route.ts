import { NextRequest, NextResponse } from "next/server";

let stripeSecretKey;
let url: string;

if (process.env.NODE_ENV === "production") {
    stripeSecretKey = process.env.STRIPE_LIVE_SECRET_KEY
    url = `${process.env.LIVE_URL}/creator/onboard`
} else {
    stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY
    url = `${process.env.TEST_URL}/creator/onboard`
}

const stripe = require("stripe")(stripeSecretKey);

export async function POST(request: NextRequest) {
    try {
        const { accountId } = await request.json();

        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: url,
            return_url: url,
            type: 'account_onboarding',
            collection_options: {
              fields: 'eventually_due',
            },
          });

        return NextResponse.json({
            accountLink: accountLink
        })
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        )
    }
}