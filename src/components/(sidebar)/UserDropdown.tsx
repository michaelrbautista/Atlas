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
import { useViewContext } from "@/context";
import { redirectWhenChangingView } from "@/server-actions/creator";

const UserDropdown = ({
    teamId
}: {
    teamId: boolean
}) => {
    const context = useViewContext();

    const switchView = () => {
        context.setView(context.view == "user" ? "creator" : "user");
        redirectWhenChangingView(context.view);
    }

    return ( 
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Ellipsis className="font-primaryText"></Ellipsis>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {teamId && (
                    <div>
                        <DropdownMenuItem className="p-0">
                            <button onClick={switchView} className="w-full h-full px-2 py-1.5 text-start">
                                {(context?.view == "user") ? (
                                    "Switch to creator view"
                                ) : (
                                    "Switch to user view"
                                )}
                            </button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </div>
                )}
                <DropdownMenuItem className="p-0">
                    <LogoutButton></LogoutButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
     );
}
 
export default UserDropdown;