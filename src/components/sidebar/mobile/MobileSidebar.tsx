"use client";

import { Ellipsis, Menu } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";

import Logo from "@/components/misc/Logo";
import MobileSidebarRoutes from "./MobileSidebarRoutes";
import SignInButton from "../../auth/SignInButton";
import CreateAccountButton from "../../auth/CreateAccountButton";
import { Button } from "@/components/ui/button";
import UserInfo from "../UserInfo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import LogoutButton from "../../auth/LogoutButton";
import { useUserContext } from "@/context";
import UserDropdown from "../UserDropdown";

const anonRoutes = [
    {
        label: "Home",
        href: "/home"
    },
    {
        label: "Explore",
        href: "/explore"
    }
]

const userRoutes = [
    {
        label: "Home",
        href: "/home"
    },
    {
        label: "Explore",
        href: "/explore"
    },
    {
        label:"Programs",
        href: "/programs"
    }
]

const MobileSidebar = () => {
    // Get user from context
    const { user: contextUser } = useUserContext();

    return (
        <div className="bg-systemBackground sticky top-0 w-full z-50 flex lg:hidden h-16 text-white">
            <Sheet>
                <SheetTrigger className="lg:hidden hover:opacity-75 transition p-5">
                    <Menu color="white"/>
                </SheetTrigger>
                <SheetTitle hidden>Menu</SheetTitle>
                <SheetDescription hidden></SheetDescription>
                <SheetContent side="left" className="p-0 border-0 w-80 bg-background border-r-[1px] flex flex-col justify-between">
                    <div className="flex flex-col h-full pb-5">
                        <Logo></Logo>
                        <div className="flex flex-col h-full justify-between">
                            <MobileSidebarRoutes routes={contextUser ? userRoutes : anonRoutes}></MobileSidebarRoutes>
                            {(contextUser !== null) ? (
                                <div className="px-5 flex flex-row justify-between items-center">
                                    <UserInfo id={contextUser.id} fullName={contextUser.full_name} username={contextUser.username}></UserInfo>
                                    <UserDropdown />
                                </div>
                            ) : (
                                <div className="px-5 flex flex-col gap-5">
                                    <SignInButton fromLandingPage={false}></SignInButton>
                                    <CreateAccountButton fromLandingPage={false}></CreateAccountButton>
                                </div>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
 
export default MobileSidebar;