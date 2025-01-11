"use client";

import { Users } from "lucide-react";
import Image from "next/image";
import { checkIfSubscribed, getUserFromUsername } from "@/server-actions/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfileButton from "@/components/profile/creator/EditProfileButton";
import CreatorProgramList from "@/components/program/creator/CreatorProgramList";
import { useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import { createClient } from "@/utils/supabase/client";
import { useUserContext } from "@/context";
import { Spinner } from "@/components/misc/Spinner";
import { Button } from "@/components/ui/button";
import SubscribeButton from "@/components/profile/user/SubscribeButton";

const User = ({ 
    params
}: {
    params: { username: string }
}) => {
    const [user, setUser] = useState<Tables<"users"> | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const {
        user: contextUser
    } = useUserContext();

    useEffect(() => {
        const getUser = async () => {
            const { data: userData, error: userError } = await getUserFromUsername(params.username);

            if (userError && !userData) {
                console.log("Couldn't get user.");
                return
            }

            setUser(userData);

            console.log(user?.stripe_account_id)

            if (contextUser?.id != userData.id) {
                // Check if subscribed
                const checkSubscription = await checkIfSubscribed(userData.id);

                if (checkSubscription != undefined) {
                    setIsSubscribed(checkSubscription);
                }
            }
        }

        getUser();
    }, []);

    if (!user || !contextUser) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full pb-10 bg-systemBackground">
            <Spinner></Spinner>
        </div>
        )
    } else {
        return (
            <div className="flex flex-col w-full max-w-xl px-5 py-10 gap-5">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 w-full">
                    {(!user.profile_picture_url) ? (
                        // Replace with placeholder image
                        <div className="bg-systemGray5 shrink-0 h-20 w-20 rounded-full flex items-center justify-center">
                            <Users className="text-secondaryText" />
                        </div>
                    ) : (
                        <Image
                            className="h-20 w-20 rounded-full"
                            height={80}
                            width={80}
                            src={user.profile_picture_url}
                            alt="programImage"
                            style={{objectFit: "cover"}}
                            priority
                        />
                    )}
                    <div className="flex flex-col w-full">
                        <p className="text-primaryText text-lg font-bold">{user.full_name}</p>
                        <p className="text-secondaryText text-base">@{user.username}</p>
                    </div>
                </div>
                <p className="text-primaryText text-base">{user.bio}</p>
                {contextUser?.id == user.id ? (
                    <EditProfileButton />
                ) : user.stripe_price_id && (
                    <SubscribeButton
                        username={params.username}
                        isSubscribed={isSubscribed}
                    />
                )}
                <div className="flex flex-col gap-2">
                    <h1 className="text-primaryText font-bold text-lg">Programs</h1>
                    <CreatorProgramList user={user} />
                </div>
            </div>
        )
    }
}
 
export default User;