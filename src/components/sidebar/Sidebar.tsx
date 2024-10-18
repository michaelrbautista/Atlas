"use client";

import Logo from "@/components/misc/Logo";
import SidebarRoutes from "./SidebarRoutes";
import SignInButton from "../auth/SignInButton";
import CreateAccountButton from "../auth/CreateAccountButton";
import UserInfo from "../auth/UserInfo";
import UserDropdown from "./UserDropdown";
import CreateTeamSidebarButton from "./CreateTeamSidebarButton";
import { useUserContext } from "@/context";
import { Separator } from "../ui/separator";

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

const Sidebar = () => {
    // Get user from context
    const { user: contextUser, team: contextTeam } = useUserContext();
    
    return (
        <aside className="sticky left-0 top-0 z-50 h-screen w-64 shrink-0 hidden lg:flex flex-col text-white bg-background border-r-[1px] pb-5">
            <Logo></Logo>
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-10 pt-5">
                    <SidebarRoutes routes={contextUser ? userRoutes : anonRoutes}></SidebarRoutes>
                    {contextUser?.team_id && (
                        <div className="flex flex-col gap-2">
                            <p className="text-secondaryText text-xs font-bold px-5">Creator</p>
                            <SidebarRoutes routes={creatorRoutes}></SidebarRoutes>
                        </div>
                    )}
                </div>
                {(contextUser) ? (
                    <div className="w-full flex flex-col px-5 gap-5">
                        {(!contextUser.team_id &&
                        <div>
                            <CreateTeamSidebarButton></CreateTeamSidebarButton>
                            <p className="text-secondaryText text-sm p-2">
                                Create a team to start selling training programs.
                            </p>
                        </div>
                        )}
                        <div className="flex flex-row justify-between items-center">
                            <UserInfo fullName={contextUser.full_name} username={contextUser.username}></UserInfo>
                            <UserDropdown />
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