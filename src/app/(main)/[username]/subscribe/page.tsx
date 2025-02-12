"use client";

import SubscriptionItem from "@/components/subscriptions/SubscriptionItem"
import { checkPreviousSubscription } from "@/server-actions/subscription"
import { getCurrentUser, getUserFromUsername } from "@/server-actions/user"
import { ChevronLeft, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/misc/Spinner";
import StripePaymentForm from "@/components/subscriptions/StripePaymentForm";
import FreeSubscriptionItem from "@/components/subscriptions/FreeSubscriptionItem";

const Page = ({ 
    params
}: {
    params: { username: string }
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<Tables<"users"> | null>(null);
    const [creator, setCreator] = useState<Tables<"users"> | null>(null);
    const [plan, setPlan] = useState("");
    const [subscriptionPrice, setSubscriptionPrice] = useState(0);

    const [previousSubscription, setPreviousSubscription] = useState<Tables<"subscriptions"> | null>(null);

    useEffect(() => {
        const getUser = async () => {
            // Get current user
            const currentUser = await getCurrentUser();

            if (!currentUser) {
                console.log("Couldn't get current user.");
                return
            }

            setCurrentUser(currentUser);

            // Get creator
            const { data, error } = await getUserFromUsername(params.username);

            if (error && !data) {
                console.log("Couldn't get user.");
                return
            }

            setCreator(data);

            // Get creator's subscription price
            if (data.stripe_price_id && data.stripe_account_id) {
                await getCreatorsPrice(data.stripe_price_id, data.stripe_account_id);
            }

            // Check if current user had previously subscribed
            const previousSubscription = await checkPreviousSubscription(data.id);

            if (previousSubscription) {
                setPreviousSubscription(previousSubscription);
            }
        }

        getUser();
    }, []);

    async function getCreatorsPrice(priceId: string, connectedAccountId: string) {
        fetch(`/api/get-price`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                priceId: priceId,
                connectedAccountId: connectedAccountId
            })
        })
        .then((res) => res.json())
        .then((data) => {
            setSubscriptionPrice(data.price / 100);
            setIsLoading(false);
        })
    }

    if (isLoading || !creator?.stripe_price_id || !currentUser) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full pb-10 bg-systemBackground">
                <Spinner></Spinner>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-full max-w-xl px-5 py-10 gap-10">
                <div className="flex flex-row gap-5 items-center w-full justify-center">
                    {(!creator.profile_picture_url) ? (
                        // Replace with placeholder image
                        <div className="bg-systemGray5 shrink-0 h-16 w-16 rounded-full flex items-center justify-center">
                            <Users className="text-secondaryText" />
                        </div>
                    ) : (
                        <Image
                            className="h-16 w-16 rounded-full"
                            height={64}
                            width={64}
                            src={creator?.profile_picture_url}
                            alt="programImage"
                            style={{objectFit: "cover"}}
                            priority
                        />
                    )}
                    <div className="flex flex-col">
                        <h1 className="font-bold">{creator.full_name}</h1>
                        <h2 className="text-secondaryText">@{creator.username}</h2>
                    </div>
                </div>
                {plan == "" ? (
                    <div className="flex flex-col gap-10 w-full items-center">
                        <h1 className="text-primaryText text-3xl font-bold">
                            Choose a plan
                        </h1>
                        {creator.stripe_price_id && (
                            <div className="flex flex-col sm:flex-row gap-5 min-h-[300px] items-center sm:justify-center">
                                <SubscriptionItem
                                    setPlan={setPlan}
                                    subscriptionPrice={subscriptionPrice}
                                />
                                <FreeSubscriptionItem
                                    isSubscribed={previousSubscription?.tier == "free" && previousSubscription.is_active}
                                    subscriber={currentUser.id}
                                    subscribed_to={creator.id}
                                    subscribed_to_username={creator.username}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-10 w-full items-center">
                        <h1 className="text-primaryText text-3xl font-bold">
                            Payment
                        </h1>
                        <div className="flex flex-col w-full gap-5">
                            <div className="flex flex-row items-center gap-2">
                                <Button
                                    className="pl-[10px]"
                                    variant="ghost"
                                    onClick={() => {
                                        setPlan("");
                                    }}
                                >
                                    <ChevronLeft size={20} />
                                    Back to the plans
                                </Button>
                            </div>
                            <StripePaymentForm
                                priceId={creator.stripe_price_id}
                                creatorId={creator.id}
                                creatorUsername={creator.username}
                                connectedAccountId={creator.stripe_account_id!}
                                userId={currentUser.id}
                                customerId={previousSubscription?.stripe_customer_id ?? undefined}
                                customerEmail={currentUser.email}
                            />
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
export default Page