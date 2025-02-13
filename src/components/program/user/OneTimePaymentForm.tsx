"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from "@stripe/react-stripe-js";
import { useCallback } from "react";

const OneTimePaymentForm = ({
    connectedAccountId,
    creatorId,
    creatorUsername,
    userId,
    userEmail,
    price,
    programId,
    programTitle
}: {
    connectedAccountId: string,
    creatorId: string,
    creatorUsername: string,
    userId: string,
    userEmail: string,
    price: number,
    programId: string,
    programTitle: string
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
                destinationAccountId: connectedAccountId,
                creatorId: creatorId,
                creatorUsername: creatorUsername,
                userId: userId,
                userEmail: userEmail,
                isOneTime: true,
                price: price,
                programId: programId,
                programTitle: programTitle
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
export default OneTimePaymentForm