// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import  "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@16.10.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"), {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient()
})

const cryptoProvider = Stripe.createSubtleCryptoProvider();

Deno.serve(async (request) => {
    const signature = request.headers.get("Stripe-Signature");

    const body = await request.text();

    let receivedEvent;

    try {
        receivedEvent = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            Deno.env.get("STRIPE_WEBHOOK_SECRET"),
            undefined,
            cryptoProvider
        )

        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        if (receivedEvent.type === "checkout.session.completed") {

            let requestMetadata = receivedEvent.data.object.metadata;

            let purchasedProgram = {
                program_id: requestMetadata.programId,
                created_by: requestMetadata.creatorId,
                purchased_by: requestMetadata.userId
            };

            const { error } = await supabaseClient
                .from("purchased_programs")
                .insert(purchasedProgram);

            if (error) {
                throw error;
            }
        }
    
        return new Response(JSON.stringify({ ok: true }), { status: 200 })
    } catch (err) {
        console.log("Error: ", err);
        return new Response(err.message, { status: 400 })
    }
});
