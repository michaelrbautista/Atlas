"use client";

import Logo from "@/components/misc/Logo";
import SidebarRoutes from "./SidebarRoutes";
import SignInButton from "../auth/SignInButton";
import CreateAccountButton from "../auth/CreateAccountButton";
import UserInfo from "./UserInfo";
import { useUserContext } from "@/context";
import { Loader2 } from "lucide-react";
import PostButton from "../post/PostButton";
import BecomeCreatorButton from "./BecomeCreatorButton";

export type UserRole = "user" | "creator";

const anonRoutes = [
    {
        label: "Home",
        href:"/home"
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
        label: "Programs",
        href: "/programs"
    }
]

const creatorRoutes = [
    {
        label: "Library",
        href: "/creator/library"
    }
]

const Sidebar = () => {
    // Get user from context
    const {
        user: contextUser,
        isLoading: contextIsLoading   
    } = useUserContext();
    
    return (
        <aside className="sticky left-0 top-0 z-50 h-screen w-64 shrink-0 hidden lg:flex flex-col text-white bg-background border-r-[1px] pb-2">
            <Logo></Logo>
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-10 pt-5">
                    <SidebarRoutes routes={contextUser ? userRoutes : anonRoutes}></SidebarRoutes>
                    {contextUser?.payments_enabled && (
                        <div className="flex flex-col gap-2">
                            <p className="text-secondaryText text-xs font-bold px-5">Creator</p>
                            <SidebarRoutes routes={creatorRoutes}></SidebarRoutes>
                        </div>
                    )}
                </div>
                {(!contextIsLoading) && (
                    (contextUser) ? (
                        <div className="w-full flex flex-col gap-5">
                            {(!contextUser.payments_enabled ?
                                <div className="px-5">
                                    <BecomeCreatorButton />
                                    <p className="text-secondaryText text-sm p-2">
                                        Become a creator to monetize your content.
                                    </p>
                                </div>
                             : 
                                <div className="px-5">
                                    <PostButton />
                                </div>
                            )}
                            <div className="flex flex-row gap-2 px-2 justify-between items-center">
                                <UserInfo
                                    id={contextUser.id}
                                    fullName={contextUser.full_name}
                                    username={contextUser.username}
                                />
                                {/* <UserDropdown /> */}
                            </div>
                        </div>
                    ) : (
                        <div className="px-5 flex flex-col gap-5">
                            <SignInButton fromLandingPage={false} />
                            <CreateAccountButton fromLandingPage={false} />
                        </div>
                    )
                )}
            </div>
        </aside>
    );
}
 
export default Sidebar;