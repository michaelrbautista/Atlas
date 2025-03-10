"use client";

import { Menu } from "lucide-react";

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
import { useUserContext } from "@/context";
import UserDropdown from "./UserDropdown";
import { useState } from "react";

const anonRoutes = [
    // {
    //     label: "Home",
    //     href: "/home"
    // },
    {
        label: "Explore",
        href: "/explore"
    }
]

const userRoutes = [
    // {
    //     label: "Home",
    //     href: "/home"
    // },
    {
        label: "Explore",
        href: "/explore"
    },
    {
        label:"Subscriptions",
        href: "/subscriptions"
    },
    {
        label: "Programs",
        href: "/programs"
    }
]

const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Get user from context
    const userContext = useUserContext();

    return (
        <div className="bg-systemBackground sticky top-0 w-full z-50 flex flex-col lg:hidden h-16 text-white">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger className="lg:hidden hover:opacity-75 transition p-5">
                    <Menu color="white"/>
                </SheetTrigger>
                <SheetTitle hidden>Menu</SheetTitle>
                <SheetDescription hidden></SheetDescription>
                <SheetContent side="left" className="p-0 border-0 w-80 bg-background border-r-[1px] flex flex-col justify-between">
                    <div className="flex flex-col h-full pb-5">
                        <Logo></Logo>
                        <div className="flex flex-col h-full justify-between">
                            <MobileSidebarRoutes routes={userContext.user ? userRoutes : anonRoutes}></MobileSidebarRoutes>
                            {(userContext.user !== null) ? (
                                <div className="px-5 flex flex-row justify-between items-center">
                                    <div className="flex flex-col p-2 items-start">
                                        <p className="text-foreground text-base font-bold line-clamp-1">{userContext.user.full_name}</p>
                                        <p className="text-muted-foreground text-sm font-normal line-clamp-1">@{userContext.user.username}</p>
                                    </div>
                                    <UserDropdown username={userContext.user.username} setIsOpen={setIsOpen} />
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