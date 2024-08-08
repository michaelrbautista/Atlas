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
import LogoutButton from "../(auth)/LogoutButton";
import { useState } from "react";
import { useAppContext } from "@/context";

const UserDropdown = () => {
    const {
        detailsSubmitted
    } = useAppContext();

    return ( 
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Ellipsis className="font-primaryText"></Ellipsis>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="p-0">
                    {(detailsSubmitted) ?
                    (
                        <button className="w-full h-full px-2 py-1.5 text-start">Switch to creator view</button>
                    ) : (
                        <button className="w-full h-full px-2 py-1.5 text-start">Become a creator</button>
                    )}
                </DropdownMenuItem>
                <DropdownMenuSeparator></DropdownMenuSeparator>
                <DropdownMenuItem className="p-0">
                    <LogoutButton></LogoutButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
     );
}
 
export default UserDropdown;