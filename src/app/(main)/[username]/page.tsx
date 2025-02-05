"use client";

import { Users } from "lucide-react";
import Image from "next/image";
import { getSubscription, getUserFromUsername } from "@/server-actions/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfileButton from "@/components/profile/creator/EditProfileButton";
import CreatorProgramList from "@/components/program/creator/CreatorProgramList";
import { useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import { createClient } from "@/utils/supabase/client";
import { useUserContext } from "@/context";
import { Spinner } from "@/components/misc/Spinner";
import SubscribeButton from "@/components/profile/user/SubscribeButton";
import UnsubscribeButton from "@/components/profile/user/UnsubscribeButton";
import LoggedOutSubscribeButton from "@/components/profile/user/LoggedOutSubscribeButton";
import CollectionList from "@/components/collections/user/CollectionList";
import Head from "next/head";

const User = ({ 
    params
}: {
    params: { username: string }
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<Tables<"users"> | null>(null);
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

            setUser(creatorData);

            // Get profile picture
            const supabase = createClient();

            if (creatorData.profile_picture_path) {
                const { data } = supabase.storage
                    .from("profile_pictures")
                    .getPublicUrl(creatorData.profile_picture_path)

                setProfilePictureUrl(data.publicUrl);
            }

            if (userContext.user?.id && userContext.user?.id != creatorData.id && userContext.user?.stripe_price_id) {
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

        getCreator();
    }, [userContext.user]);

    const getSubscribeButton = () => {
        if (userSubscription?.is_active && user?.stripe_account_id) {
            return (
                <UnsubscribeButton
                    connectedAccountId={user.stripe_account_id}
                    subscriptionId={userSubscription.stripe_subscription_id}
                    setSubscription={() => {setUserSubscription(undefined)}}
                />
            )
        } else if (userContext.user) {
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

    if (isLoading || !user || userContext.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full pb-10 bg-systemBackground">
                <Spinner></Spinner>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-full max-w-lg px-5 pt-10 pb-20 gap-10 sm:gap-10">
                <Head>
                    <meta name="apple-itunes-app" content="app-id=6484401731, app-argument=https://apps.apple.com/us/app/atlas-health-and-fitness/id6484401731" />
                </Head>
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 w-full">
                    {(!user.profile_picture_url) ? (
                        // Replace with placeholder image
                        <div className="bg-systemGray5 shrink-0 h-20 w-20 rounded-full flex items-center justify-center">
                            <Users className="text-secondaryText" />
                        </div>
                    ) : (
                        <div className="relative w-[80px] h-[80px] shrink-0">
                            <Image
                                className="rounded-full"
                                fill
                                src={profilePictureUrl}
                                alt="profilePicture"
                                style={{objectFit: "cover"}}
                                priority
                            />
                        </div>
                    )}
                    <div className="flex flex-col w-full">
                        <p className="text-primaryText text-lg font-bold">{user.full_name}</p>
                        <p className="text-secondaryText text-base">@{user.username}</p>
                    </div>
                </div>
                <p className="text-primaryText text-base">{user.bio}</p>
                {userContext.user?.id == user.id ? (
                    <EditProfileButton />
                ) : user.stripe_price_id && (
                    getSubscribeButton()  
                )}
                {user.stripe_price_id && (
                    <Tabs defaultValue="programs">
                        <TabsList className="w-full">
                            <TabsTrigger className="w-full" value="programs">Programs</TabsTrigger>
                            <TabsTrigger className="w-full" value="collections">Collections</TabsTrigger>
                        </TabsList>
                        <TabsContent value="programs">
                            <CreatorProgramList user={user} />
                        </TabsContent>
                        <TabsContent value="collections">
                            <CollectionList user={user} />
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        )
    }
}
 
export default User;