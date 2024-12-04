"use client";

import { Users } from "lucide-react";
import Image from "next/image";
import { getUserFromUsername } from "@/server-actions/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfileButton from "@/components/user/EditProfileButton";
import CreatorProgramList from "@/components/creator/program/CreatorProgramList";
import { useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import { createClient } from "@/utils/supabase/client";
import { useUserContext } from "@/context";
import { Spinner } from "@/components/misc/Spinner";

const User = ({ 
    params
}: {
    params: { username: string }
}) => {
    const [user, setUser] = useState<Tables<"users"> | null>(null);

    const {
        user: contextUser
    } = useUserContext();

    useEffect(() => {
        const getUser = async () => {
            const user = await getUserFromUsername(params.username);

            setUser(user);
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
                {contextUser?.id == user.id && (
                    <EditProfileButton />
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