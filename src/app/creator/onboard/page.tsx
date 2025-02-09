"use client";

import CreateStripeAccountSection from "@/components/profile/creator/CreateStripeAccountSection";
import StripeOnboardingSection from "@/components/profile/creator/StripeOnboardingSection";
import { useToast } from "@/components/ui/use-toast";
import { redirectToHome, updateStripePaymentsEnabled } from "@/server-actions/creator";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import CreateSubscriptionPrice from "@/components/profile/creator/CreateSubscriptionPrice";
import { Tables } from "../../../../database.types";

const OnboardCreator = () => {
    const [user, setUser] = useState<Tables<"users"> | null>(null);
    const [stripeAccountId, setStripeAccountId] = useState("");
    const [paymentsEnabled, setPaymentsEnabled] = useState(false);
    // const [subscriptionPriceIsSet, setSubscriptionPriceIsSet] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const { toast } = useToast();

    useEffect(() => {
        const checkProgress = async () => {
            const supabase = createClient();

            const { data: { user }} = await supabase.auth.getUser();

            if (user) {
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select()
                    .eq("id", user.id)
                    .single()

                if (userError) {
                    toast({
                        title: "An error occurred.",
                        description: "Couldn't get current user."
                    })
                    return;
                }

                setUser(userData);

                if (userData.stripe_price_id) {
                    redirectToHome();
                    return
                }

                // Check if stripe account was created
                if (userData.stripe_account_id) {
                    setStripeAccountId(userData.stripe_account_id);
                    // setSubscriptionPriceIsSet(userData.stripe_price_id != null);
                    checkPaymentsEnabled(userData.stripe_account_id);
                } else {
                    console.log("Stripe account not created.");
                    setIsLoading(false);
                    return
                }

                // Check if payments are enabled
                if (userData.payments_enabled) {
                    console.log("Payments are enabled.");
                    setPaymentsEnabled(true);
                    setIsLoading(false);
                } else {
                    console.log("Stripe account created but payments are not enabled.");
                    setIsLoading(false);
                    return
                }
            }
        }

        async function checkPaymentsEnabled(stripeAccountId: string) {
            fetch(`/api/get-stripe-account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ stripeAccountId: stripeAccountId })
            })
            .then((res) => res.json())
            .then((data) => {
                const paymentsAreEnabled = (
                    data.account.charges_enabled &&
                    data.account.details_submitted &&
                    data.account.payouts_enabled
                );

                setPaymentsEnabled(paymentsAreEnabled);

                if (paymentsAreEnabled != paymentsEnabled) {
                    updateStripePaymentsEnabled(stripeAccountId, paymentsAreEnabled);
                }
            })
        }

        checkProgress();
    }, [stripeAccountId]);

    if (isLoading || !user) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return ( 
            <div className="h-full w-full flex flex-col gap-10 sm:max-w-2xl px-5 pt-20 md:py-10">
                <div className="flex flex-col justify-between items-center gap-5 pb-5">
                    <h1 className="text-primaryText text-3xl font-bold">Become a creator</h1>
                    <p className="text-primaryText text-center text-lg font-normal">
                        Create an account with Stripe to start monetizing your content.
                    </p>
                </div>
                <div className="w-full flex flex-col gap-5 items-center">
                    <div className="flex flex-col gap-5 w-full max-w-sm">
                        {/* Create Stripe account */}
                        <CreateStripeAccountSection
                            stripeAccount={stripeAccountId} 
                            setStripeAccount={setStripeAccountId}
                        />

                        {/* Onboard stripe account */}
                        <StripeOnboardingSection
                            stripeAccountId={stripeAccountId}
                            paymentsEnabled={paymentsEnabled}
                        />

                        {/* Create subscription price */}
                        <CreateSubscriptionPrice
                            stripeAccountId={stripeAccountId}
                            creatorFullName={user.full_name}
                            paymentsEnabled={paymentsEnabled}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
 
export default OnboardCreator