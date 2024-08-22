"use server";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

let webhookSecret: string;

if (process.env.NODE_ENV === "production") {
    webhookSecret = process.env.STRIPE_LIVE_WEBHOOK_SECRET as string
} else {
    webhookSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET as string
}

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );
    } catch (error) {
        console.log(error);
        return new NextResponse("Invalid signature", { status: 400 });
    }

    const account = event.data.object as Stripe.Account;

    if (event.type === "account.updated") {
        console.log("charges enabled: ", account.charges_enabled);
        console.log("details submitted: ", account.details_submitted);
        console.log("payouts enabled: ", account.payouts_enabled);

        // Check if details submitted, payouts enabled, and charges enabled. If so, update db.
        if (account.charges_enabled && account.details_submitted && account.payouts_enabled) {
            console.log(account.id);
        } else {
            console.log("Account not fully onboarded.");
        }
    }

    return new NextResponse("Webhook successful", { status: 200 });
}
