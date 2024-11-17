"use client";

import { Users } from "lucide-react";
import Image from "next/image";
import { getUserFromUsername } from "@/server-actions/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatorPostList from "@/components/post/CreatorPostList";
import EditProfileButton from "@/components/user/EditProfileButton";
import CreatorProgramList from "@/components/program/CreatorProgramList";
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
    const [isUser, setIsUser] = useState(false);

    const {
        user: contextUser,
        isLoading: contextIsLoading   
    } = useUserContext();

    useEffect(() => {
        const getUser = async () => {
            const user = await getUserFromUsername(params.username);

            setUser(user);

            console.log(contextUser)

            setIsUser(contextUser?.id == user.id)
        }

        getUser();
    }, []);

    if (!user || contextIsLoading) {
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
                        <div className="bg-systemGray5 shrink-0 h-28 w-28 rounded-full flex items-center justify-center">
                            <Users className="text-secondaryText" />
                        </div>
                    ) : (
                        <Image
                            className="h-28 w-28 rounded-full"
                            height={112}
                            width={112}
                            src={user.profile_picture_url}
                            alt="programImage"
                            style={{objectFit: "cover"}}
                            priority
                        />
                    )}
                    <div className="flex flex-col w-full">
                        <p className="text-primaryText text-xl font-bold">{user.full_name}</p>
                        <p className="text-secondaryText text-base">@{user.username}</p>
                    </div>
                </div>
                <p className="text-primaryText text-base">{user.bio}</p>
                {isUser && (
                    <EditProfileButton />
                )}
                <Tabs defaultValue="posts" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="posts" className="w-full">Posts</TabsTrigger>
                        <TabsTrigger value="programs" className="w-full">Programs</TabsTrigger>
                        {/* <TabsTrigger value="likes" className="w-full">Likes</TabsTrigger> */}
                    </TabsList>
                    <TabsContent value="posts">
                        <CreatorPostList user={user} />
                    </TabsContent>
                    <TabsContent value="programs">
                        <CreatorProgramList user={user} />
                    </TabsContent>
                </Tabs>
            </div>
        )
    }
}
 
export default User;