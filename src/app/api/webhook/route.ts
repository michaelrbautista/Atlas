"use server";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

let webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

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

    const session = event.data.object as Stripe.Checkout.Session;

    switch (event.type) {
        case "checkout.session.completed":
            // Add to purchased_programs table
            const supabase = createClient();

            if (session.metadata) {
                const { error: purchaseError } = await supabase
                    .from("purchased_programs")
                    .insert({
                        program_id: session.metadata.programId,
                        created_by: session.metadata.creatorId,
                        purchased_by: session.metadata.userId
                    })
                
                if (purchaseError) {
                    console.log("Couldn't add purchased program to db", purchaseError);
                }

                console.log("Added purchased program")
            }

            break;
        // case "account.updated":
        //     console.log("charges enabled: ", account.charges_enabled);
        //     console.log("details submitted: ", account.details_submitted);
        //     console.log("payouts enabled: ", account.payouts_enabled);

        //     // Check if details submitted, payouts enabled, and charges enabled. If so, update db.
        //     if (account.charges_enabled && account.details_submitted && account.payouts_enabled) {
        //         console.log(account.id);
        //     } else {
        //         console.log("Account not fully onboarded.");
        //     }
        default:
            break;
    }

    return new NextResponse("Webhook successful", { status: 200 });
}
