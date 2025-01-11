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
            stripeAccountId,
            creatorFullName,
            monthlyPrice
        } = await request.json();

        const product = await stripe.products.create({
            name: `Atlas: ${creatorFullName} Subscription`
        },
        {
            stripeAccount: stripeAccountId
        });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: convertToSubcurrency(monthlyPrice),
            currency: "usd",
            recurring: {
                interval: "month",
            },
        },
        {
            stripeAccount: stripeAccountId
        });

        return NextResponse.json({
            priceId: price.id
        })
    } catch (error) {
        console.log("CREATE PRICE ERROR");
        console.log(error);

        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        )
    }
}
