import { Users } from "lucide-react";
import Image from "next/image";
import { getUserFromUsername } from "@/server-actions/user";
import { getCreatorsPosts } from "@/server-actions/post";
import { getCreatorsPrograms, getUsersPrograms } from "@/server-actions/program";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PostList from "@/components/post/PostList";
import ProgramList from "@/components/program/ProgramList";
import CreatorPostList from "@/components/post/CreatorPostList";
import EditUserButton from "@/components/user/EditProfileButton";
import EditProfileButton from "@/components/user/EditProfileButton";
import CreatorProgramList from "@/components/program/CreatorProgramList";

const User = async ({ 
    params,
    searchParams
}: {
    params: { username: string },
    searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
    // Get user
    const user = await getUserFromUsername(params.username);

    const { isUser = false } = await searchParams

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
 
export default User;