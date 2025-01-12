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

    const [profilePictureUrl, setProfilePictureUrl] = useState("");

    const {
        user: contextUser
    } = useUserContext();

    useEffect(() => {
        const getUser = async () => {
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

            if (contextUser?.id != creatorData.id) {
                // Check if subscribed
                const checkSubscription = await checkIfSubscribed(creatorData.id);

                if (checkSubscription != undefined) {
                    setIsSubscribed(checkSubscription);
                }
            }
        }

        getUser();
    }, []);

    const getSubscribeButton = () => {
        if (isSubscribed) {
            return (
                <Button variant="disabled">Unsubscribe</Button>
            )
        } else {
            return (
                <SubscribeButton
                    username={params.username}
                    isSubscribed={isSubscribed}
                />
            )
        }
    }

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
                {contextUser?.id == user.id ? (
                    <EditProfileButton />
                ) : user.stripe_price_id && (
                    getSubscribeButton()  
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