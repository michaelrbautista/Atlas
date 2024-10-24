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
        const {
            currency,
            programId,
            programName,
            price,
            creatorId,
            userId,
            destinationAccountId
        } = await request.json();

        const session = await stripe.checkout.sessions.create(
            {
                line_items: [
                    {
                        price_data: {
                            currency: currency,
                            product_data: {
                                name: programName
                            },
                            unit_amount: convertToSubcurrency(price)
                        },
                        quantity: 1,
                    }
                ],
                payment_intent_data: {
                    application_fee_amount: convertToSubcurrency(price) * 0.1
                },
                mode: "payment",
                ui_mode: "embedded",
                metadata: {
                    programId: programId,
                    creatorId: creatorId,
                    userId: userId
                },
                return_url: `${request.headers.get("origin")}/checkout/{CHECKOUT_SESSION_ID}?programId=${programId}`
            },
            {
                stripeAccount: destinationAccountId
            }
        );

        return NextResponse.json({
            clientSecret: session.client_secret
        })
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        )
    }
}