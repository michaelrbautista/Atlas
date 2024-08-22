"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface StripeOnboardingButtonProps {
    stripeAccountId: string,
    paymentsEnabled: boolean
}

const StripeOnboardingSection = ({
    stripeAccountId,
    paymentsEnabled
}: StripeOnboardingButtonProps) => {
    const [accountLink, setAccountLink] = useState("");

    useEffect(() => {
        async function createStripeAccountLink() {
            fetch("/api/create-account-link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ accountId: stripeAccountId })
            })
            .then((res) => res.json())
            .then((data) => {
                setAccountLink(data.accountLink.url);
            })
        }

        if (stripeAccountId != "" && !paymentsEnabled) {
            console.log("Creating account link.");
            createStripeAccountLink();
        }
    }, []);

    if (!stripeAccountId || paymentsEnabled) {
        return (
            <div className="flex flex-col gap-2 w-full">
                <p className="text-systemGray1 text-base font-medium">
                    2. Onboard Stripe account
                </p>
                <Button className={buttonVariants({ variant: "disabled", size: "full"})} disabled>
                    {paymentsEnabled ? "Stripe onboarding" : "Onboarding complete"}
                </Button>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col gap-2 w-full max-w-sm">
                <p className="text-primaryText text-base font-medium">2. Onboard Stripe account</p>
                {(accountLink == "") ? (
                    <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Stripe link
                    </Button>
                ) : (
                    <Button className={buttonVariants({ variant: "systemBlue", size: "full"})} asChild>
                        <Link href={accountLink}>Stripe onboarding</Link>
                    </Button>
                )}
                <p className="text-secondaryText text-sm font-medium">
                    Once you've finished the Stripe onboarding, refresh the page to move to step 3.
                </p>
            </div>
        )
    }
}
 
export default StripeOnboardingSection;