"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import LogoutButton from "../auth/LogoutButton";
import { Ellipsis } from "lucide-react";
import { logout } from "@/server-actions/auth";
import { useToast } from "../ui/use-toast";

const UserInfo = ({
    id,
    fullName,
    username
}: {
    id: string,
    fullName: string,
    username: string
}) => {
    const { toast } = useToast();

    async function clientLogout() {
        const error = await logout();

        if (error) {
            toast({
                title: "An error occurred.",
                description: error.message
            })
            return
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="userInfo">
                    <div className="flex flex-col p-2 items-start">
                        <p className="text-foreground text-base font-bold line-clamp-1">{fullName}</p>
                        <p className="text-muted-foreground text-sm font-normal line-clamp-1">@{username}</p>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="p-0" asChild>
                    <Link href={`/${username}`} className="w-full h-full px-2 py-1.5 text-start cursor-pointer">View profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0" asChild>
                    <form action={clientLogout}>
                        <button className="w-full h-full px-2 py-1.5 text-start">Logout</button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
 
export default UserInfo;