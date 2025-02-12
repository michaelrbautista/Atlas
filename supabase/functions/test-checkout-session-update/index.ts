// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// supabase functions deploy test-checkout-session-update

// Setup type definitions for built-in Supabase Runtime APIs
import  "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@16.10.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_API_TEST_KEY"), {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient()
})

const cryptoProvider = Stripe.createSubtleCryptoProvider();

Deno.serve(async (request) => {
    const signature = request.headers.get("Stripe-Signature");

    const body = await request.text();

    let data;
    let event;
    let eventType;

    try {
        event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            Deno.env.get("STRIPE_WEBHOOK_TEST_SECRET"),
            undefined,
            cryptoProvider
        )
    } catch (err) {
        console.log("Construct stripe event error: ", err);
        return new Response(err.message, { status: 400 })
    }

    data = event.data;
    eventType = event.type;

    try {
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        switch (eventType) {
            case "checkout.session.completed": {
                const requestMetadata = data.object.metadata;

                const session = await stripe.checkout.sessions.retrieve(
                    data.object.id,
                    {
                        expand: ["line_items"]
                    },
                    {
                        stripeAccount: event.account
                    }
                )

                const customerId = session?.customer;
                const customer = await stripe.customers.retrieve(
                    customerId,
                    {
                        stripeAccount: event.account
                    }
                );

                const priceId = session?.line_items.data[0]?.price.id;

                if (customer.email) {
                    const user = await supabaseClient
                        .from("users")
                        .select()
                        .eq("email", customer.email)
                        .single()

                    if (!user) {
                        console.log("No user found in Stripe webhook.");
                        break
                    }

                    console.log("GOT USER");

                    const previousSubscription = await supabaseClient
                        .from("subscriptions")
                        .select()
                        .eq("stripe_customer_id", customerId)
                        .single()

                    console.log("GOT SUBSCRIPTION");

                    if (previousSubscription) {
                        const { error } = await supabaseClient
                            .from("subscriptions")
                            .update({
                                "tier": "monthly",
                                "stripe_price_id": priceId,
                                "stripe_customer_id": customerId,
                                "is_active": true,
                                "stripe_subscription_id": session?.subscription
                            })
                            .eq("subscriber", requestMetadata.userId)
                            .eq("subscribed_to", requestMetadata.creatorId)

                        if (error) {
                            throw error;
                        }

                        console.log("UPDATED SUBSCRIPTION");
                    } else {
                        const subscription = {
                            subscriber: requestMetadata.userId,
                            subscribed_to: requestMetadata.creatorId,
                            tier: "monthly",
                            stripe_subscription_id: session?.subscription,
                            stripe_customer_id: customerId,
                            stripe_price_id: priceId,
                            is_active: true
                        };
        
                        const { error } = await supabaseClient
                            .from("subscriptions")
                            .insert(subscription);
        
                        if (error) {
                            throw error;
                        }

                        console.log("CREATED NEW SUBSCRIPTION");
                    }
                } else {
                    console.log("No customer found in Stripe webhook.");
                }

                break;
            }

            case "customer.subscription.deleted": {
                const subscriptionId = data.object.id

                const { error } = await supabaseClient
                    .from("subscriptions")
                    .update({
                        "is_active": false
                    })
                    .eq("stripe_subscription_id", subscriptionId)

                if (error) {
                    throw error;
                }

                break;
            }

            default:
        }
    
        return new Response(JSON.stringify({ ok: true }), { status: 200 })
    } catch (err) {
        console.log("Webhook error: ", err);
        return new Response(err.message, { status: 400 })
    }
});
