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
import { redirectToHome, redirectToTeam } from "@/server-actions/creator";
import { UserRole } from "./Sidebar";

const UserDropdown = ({
    teamId,
    userRole
}: {
    teamId: boolean,
    userRole: UserRole
}) => {
    const switchView = () => {
        if (userRole == "user") {
            redirectToTeam();
        } else {
            redirectToHome();
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
                {teamId && (
                    <div>
                        <DropdownMenuItem className="p-0">
                            <button onClick={switchView} className="w-full h-full px-2 py-1.5 text-start">
                                {(userRole == "user") ? (
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