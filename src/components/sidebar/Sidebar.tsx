"use client";

import Logo from "@/components/misc/Logo";
import SidebarRoutes from "./SidebarRoutes";
import SignInButton from "../auth/SignInButton";
import CreateAccountButton from "../auth/CreateAccountButton";
import { createClient } from "@/utils/supabase/client";
import UserInfo from "../auth/UserInfo";
import UserDropdown from "./UserDropdown";
import CreateTeamSidebarButton from "./CreateTeamSidebarButton";
import { updateStripePaymentsEnabled } from "@/server-actions/creator";
import { useUserContext } from "@/context";
import { useEffect } from "react";

export type UserRole = "user" | "creator";

const anonRoutes = [
    {
        label: "Home",
        href:"/home"
    }
]

const userRoutes = [
    {
        label: "Home",
        href: "/home"
    },
    {
        label: "Programs",
        href: "/programs"
    }
]

const creatorRoutes = [
    {
        label: "My Team",
        href: "/creator/team"
    },
    {
        label: "My Programs",
        href: "/creator/programs"
    },
    {
        label: "My Exercises",
        href: "/creator/exercises"
    }
]

let url: string;
if (process.env.NODE_ENV === "production") {
    url = process.env.PROD_URL as string
} else {
    url = process.env.TEST_URL as string
}

const Sidebar = ({
    userRole
}: {
    userRole: UserRole
}) => {
    // Get user from context
    const { user: contextUser, team: contextTeam } = useUserContext();

    let routes = anonRoutes;

    if (contextUser) {
        if (contextTeam) {
            routes = creatorRoutes
        } else {
            routes = userRoutes
        }
    }
    
    return (
        <aside className="sticky left-0 top-0 z-50 h-screen w-64 shrink-0 hidden md:flex flex-col text-white bg-background border-r-[1px] pb-5">
            <Logo></Logo>
            <div className="flex flex-col justify-between h-full">
                <SidebarRoutes routes={routes}></SidebarRoutes>
                {(contextUser) ? (
                    <div className="w-full flex flex-col px-5 gap-5">
                        {(!contextUser.team_id &&
                            <CreateTeamSidebarButton></CreateTeamSidebarButton>
                        )}
                        <div className="flex flex-row justify-between items-center">
                            <UserInfo fullName={contextUser.full_name} username={contextUser.username}></UserInfo>
                            <UserDropdown teamId={contextUser.team_id != null} userRole={userRole}></UserDropdown>
                        </div>
                    </div>
                ) : (
                    <div className="px-5 flex flex-col gap-5">
                        <SignInButton fromLandingPage={false}></SignInButton>
                        <CreateAccountButton fromLandingPage={false}></CreateAccountButton>
                    </div>
                )}
            </div>
        </aside>
    );
}
 
export default Sidebar;