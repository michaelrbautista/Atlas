"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import LogoutButton from "../auth/LogoutButton";
import { logout } from "@/server-actions/auth";
import { useToast } from "../ui/use-toast";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

const UserDropdown = ({
    username,
    setIsOpen
}: {
    username: string,
    setIsOpen: Dispatch<SetStateAction<boolean>>
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
                <Button variant="ghost" size="icon">
                    <Ellipsis className="text-primaryText"></Ellipsis>
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
 
export default UserDropdown;