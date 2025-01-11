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
            userFullName,
            userEmail,
            userId
        } = await request.json();

        const customer = await stripe.customers.create({
            name: userFullName,
            email: userEmail,
            metadata: {
                user_id: userId
            }
        });

        return NextResponse.json({
            customerId: customer.id
        })
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        )
    }
}
