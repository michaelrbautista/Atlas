"use client";

import { Dispatch, SetStateAction, memo, useState } from "react";
import { Button, buttonVariants } from "../../ui/button";
import { Loader2 } from "lucide-react";
import { updateStripeAccountId } from "@/server-actions/creator";

interface CreateStripeAccountButtonProps {
    stripeAccount: string,
    setStripeAccount: Dispatch<SetStateAction<string>>
}

const CreateStripeAccountSection = ({
    stripeAccount,
    setStripeAccount
}: CreateStripeAccountButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [stripeAccountWasCreated, setStripeAccountWasCreated] = useState(false);

    async function createStripeAccount() {
        fetch("/api/create-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => res.json())
        .then((data) => {
            setStripeAccount(data.account.id);
            updateStripeAccountId(data.account.id);
            setStripeAccountWasCreated(true);
            setIsLoading(false);
        });
    }

    if (stripeAccount || stripeAccountWasCreated) {
        return (
            <div className="flex flex-col gap-2 w-full">
                <p className="text-systemGray1 text-base font-medium">1. Create Stripe account</p>
                <Button className={buttonVariants({ variant: "disabled", size: "full"})} disabled>Account created</Button>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col gap-2 w-full max-w-sm">
                <p className="text-primaryText text-base font-medium">1. Create Stripe account</p>
                {(isLoading) ? (
                    <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account
                    </Button>
                ) : (
                    <Button onClick={() => {
                        setIsLoading(true);
                        createStripeAccount();
                    }} className={buttonVariants({ variant: "systemBlue", size: "full"})}>Create account with Stripe</Button>
                )}
            </div>
        );
    }
}
 
export default memo(CreateStripeAccountSection);