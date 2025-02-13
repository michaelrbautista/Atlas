"use client";

import { Users } from "lucide-react";
import { getUserFromUsername } from "@/server-actions/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfileButton from "@/components/profile/EditProfileButton";
import CreatorProgramList from "@/components/program/creator/CreatorProgramList";
import { useCallback, useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import { createClient } from "@/utils/supabase/client";
import { useUserContext } from "@/context";
import { Spinner } from "@/components/misc/Spinner";
import SubscribeButton from "@/components/subscriptions/SubscribeButton";
import UnsubscribePaidButton from "@/components/subscriptions/UnsubscribePaidButton";
import LoggedOutSubscribeButton from "@/components/subscriptions/LoggedOutSubscribeButton";
import CollectionList from "@/components/collections/user/CollectionList";
import BlurImage from "@/components/misc/BlurImage";
import UnsubscribeFreeButton from "@/components/subscriptions/UnsubscribeFreeButton";
import { getSubscription } from "@/server-actions/subscription";

const User = ({ 
    params
}: {
    params: { username: string }
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [creator, setCreator] = useState<Tables<"users"> | null>(null);
    const [userSubscription, setUserSubscription] = useState<Tables<"subscriptions"> | undefined>(undefined);

    const [profilePictureUrl, setProfilePictureUrl] = useState("");

    const userContext = useUserContext();

    useEffect(() => {
        const getCreator = async () => {
            // Get user
            const { data: creatorData, error: creatorError } = await getUserFromUsername(params.username);

            if (creatorError && !creatorData) {
                console.log("Couldn't get user.");
                return
            }

            setCreator(creatorData);

            // Get profile picture
            const supabase = createClient();

            if (creatorData.profile_picture_path) {
                const { data } = supabase.storage
                    .from("profile_pictures")
                    .getPublicUrl(creatorData.profile_picture_path)

                setProfilePictureUrl(data.publicUrl);
            }

            if (userContext.user?.id && userContext.user?.id != creatorData.id && creatorData.stripe_price_id) {
                // Get subscription
                const { data: subscriptionData, error: subscriptionError } = await getSubscription(creatorData.id);

                if (subscriptionError && !subscriptionData) {
                    console.log(subscriptionError);
                    return
                }
                
                setUserSubscription(subscriptionData);
            }

            setIsLoading(false);
        }

        if (userContext.user) {
            getCreator();
        }
    }, [userContext.user]);

    const setSubscriptionAfterUnsubscribe = useCallback(() => {
        setUserSubscription(undefined);
    }, [])

    const getSubscribeButton = () => {
        if (userSubscription?.tier == "free" && userSubscription?.is_active) {
            // Free, active subscription
            return (
                <UnsubscribeFreeButton
                    username={params.username}
                    subscriber={userSubscription.subscriber}
                    subscribed_to={userSubscription.subscribed_to}
                    setSubscription={setSubscriptionAfterUnsubscribe}
                />
            )
        } else if (userSubscription?.tier == "monthly" && userSubscription?.is_active && creator?.stripe_account_id && userSubscription?.stripe_subscription_id) {
            // Paid, active subscription
            return (
                <UnsubscribePaidButton
                    connectedAccountId={creator.stripe_account_id}
                    subscriptionId={userSubscription.stripe_subscription_id}
                    setSubscription={setSubscriptionAfterUnsubscribe}
                />
            )
        } else if (userContext.user) {
            // Not subscribed
            return (
                <SubscribeButton
                    username={params.username}
                />
            )
        } else {
            return (
                <LoggedOutSubscribeButton />
            )
        }
    }

    if (isLoading || !creator || userContext.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full pb-10 bg-systemBackground">
                <Spinner></Spinner>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-full max-w-lg px-5 pt-10 pb-20 gap-10 sm:gap-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 w-full">
                    {(!creator.profile_picture_url) ? (
                        // Replace with placeholder image
                        <div className="bg-systemGray5 shrink-0 h-20 w-20 sm:h-28 sm:w-28 rounded-full flex items-center justify-center">
                            <Users className="text-secondaryText" />
                        </div>
                    ) : (
                        <div className="relative w-[80px] h-[80px] sm:h-28 sm:w-28 shrink-0">
                            <BlurImage
                                alt="profilePicture"
                                src={profilePictureUrl}
                                contentMode="cover"
                                sizes="(max-width: 640px) 80px, 80px"
                                className="rounded-full"
                                canSelect={false}
                            />
                        </div>
                    )}
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col w-full">
                            <p className="text-primaryText text-lg font-bold">{creator.full_name}</p>
                            <p className="text-secondaryText text-base">@{creator.username}</p>
                        </div>
                        <p className="text-primaryText text-base">{creator.bio}</p>
                    </div>
                </div>
                {userContext.user?.id == creator.id ? (
                    <EditProfileButton />
                ) : creator.stripe_price_id && (
                    getSubscribeButton()  
                )}
                {creator.stripe_price_id && (
                    <Tabs defaultValue="programs">
                        <TabsList className="w-full">
                            <TabsTrigger className="w-full" value="programs">Programs</TabsTrigger>
                            <TabsTrigger className="w-full" value="collections">Collections</TabsTrigger>
                        </TabsList>
                        <TabsContent value="programs">
                            <CreatorProgramList user={creator} />
                        </TabsContent>
                        <TabsContent value="collections">
                            <CollectionList user={creator} />
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        )
    }
}
 
export default User;