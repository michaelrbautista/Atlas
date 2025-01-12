"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from "@stripe/react-stripe-js";
import { useCallback } from "react";

const StripePaymentForm = ({
    priceId,
    creatorId,
    creatorUsername,
    connectedAccountId,
    userId,
    customerId,
    customerEmail
}: {
    priceId: string,
    creatorId: string,
    creatorUsername: string,
    connectedAccountId: string,
    userId: string,
    customerId?: string,
    customerEmail: string
}) => {
    const stripePromise = loadStripe(
        process.env.NODE_ENV === "production" ? 
        process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY as string :
        process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY as string,
        {
            stripeAccount: connectedAccountId
        }
    )

    const fetchClientSecret = useCallback(() => {
        return fetch("/api/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                priceId: priceId,
                creatorId: creatorId,
                creatorUsername: creatorUsername,
                userId: userId,
                destinationAccountId: connectedAccountId,
                customerId: customerId,
                customerEmail: customerEmail
            })
        })
        .then((res) => res.json())
        .then((data) => data.clientSecret);
    }, []);

    const options = { fetchClientSecret };

    return (
        <div className="h-full w-full rounded-xl overflow-scroll">
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    )
}
export default StripePaymentForm