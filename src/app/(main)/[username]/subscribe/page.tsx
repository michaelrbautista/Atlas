"use client";

import SubscriptionItem from "@/components/profile/user/SubscriptionItem"
import { checkIfPreviouslySubscribed, getCurrentUser, getUserFromUsername } from "@/server-actions/user"
import { ChevronLeft, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/misc/Spinner";
import StripePaymentForm from "@/components/program/user/StripePaymentForm";

const Page = ({ 
    params
}: {
    params: { username: string }
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState("");
    const [user, setUser] = useState<Tables<"users"> | null>(null);
    const [plan, setPlan] = useState("");
    const [subscriptionPrice, setSubscriptionPrice] = useState(0);

    const [existingCustomerId, setExistingCustomerId] = useState("");

    useEffect(() => {
        const getUser = async () => {
            // Get current user
            const currentUser = await getCurrentUser();

            if (!currentUser) {
                console.log("Couldn't get current user.");
                return
            }

            setCurrentUserId(currentUser.id);

            // Get creator
            const { data, error } = await getUserFromUsername(params.username);

            if (error && !data) {
                console.log("Couldn't get user.");
                return
            }

            setUser(data);

            // Get creator's subscription price
            if (data.stripe_price_id && data.stripe_account_id) {
                await getCreatorsPrice(data.stripe_price_id, data.stripe_account_id);
            }

            // Check if current user had previously subscribed
            const previousCustomerId = await checkIfPreviouslySubscribed(data.id);

            if (previousCustomerId) {
                setExistingCustomerId(previousCustomerId);
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

    if (isLoading || !user?.stripe_price_id) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full pb-10 bg-systemBackground">
                <Spinner></Spinner>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-full max-w-xl px-5 py-10 gap-10">
                <div className="flex flex-row gap-5 items-center w-full justify-center">
                    {(!user.profile_picture_url) ? (
                        // Replace with placeholder image
                        <div className="bg-systemGray5 shrink-0 h-16 w-16 rounded-full flex items-center justify-center">
                            <Users className="text-secondaryText" />
                        </div>
                    ) : (
                        <Image
                            className="h-16 w-16 rounded-full"
                            height={64}
                            width={64}
                            src={user?.profile_picture_url}
                            alt="programImage"
                            style={{objectFit: "cover"}}
                            priority
                        />
                    )}
                    <div className="flex flex-col">
                        <h1 className="font-bold">{user.full_name}</h1>
                        <h2 className="text-secondaryText">@{user.username}</h2>
                    </div>
                </div>
                {plan == "" ? (
                    <div className="flex flex-col gap-10 w-full items-center">
                        <h1 className="text-primaryText text-3xl font-bold">
                            Choose a plan
                        </h1>
                        <div className="flex w-full justify-center">
                            {user.stripe_price_id && (
                                <SubscriptionItem
                                    setPlan={setPlan}
                                    subscriptionPrice={subscriptionPrice}
                                />
                            )}
                        </div>
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
                                creatorId={user.id}
                                priceId={user.stripe_price_id}
                                price={subscriptionPrice}
                                connectedAccountId={user.stripe_account_id!}
                                userId={currentUserId}
                                customerId={existingCustomerId === "" ? undefined : existingCustomerId}
                            />
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
export default Page