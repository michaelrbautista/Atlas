"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from "@stripe/react-stripe-js";
import { useCallback } from "react";
import { Tables } from "../../../../database.types";

const StripePaymentForm = ({
    program,
    connectedAccountId,
    userId
}: {
    program: Tables<"programs">
    connectedAccountId: string,
    userId: string
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
                currency: "usd",
                programId: program.id,
                programName: program.title,
                price: program.price,
                creatorId: program.created_by,
                userId: userId,
                destinationAccountId: connectedAccountId
            })
        })
        .then((res) => res.json())
        .then((data) => data.clientSecret);
    }, []);

    const options = { fetchClientSecret };

    return (
        <div className="h-full w-full overflow-scroll">
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