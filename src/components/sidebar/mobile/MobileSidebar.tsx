import { Ellipsis, Menu } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";

import Logo from "@/components/misc/Logo";
import MobileSidebarRoutes from "./MobileSidebarRoutes";
import SignInButton from "../../auth/SignInButton";
import CreateAccountButton from "../../auth/CreateAccountButton";
import { Button } from "@/components/ui/button";
import UserInfo from "../../auth/UserInfo";
import { createClient } from "@/utils/supabase/server";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import LogoutButton from "../../auth/LogoutButton";

type UserRole = "user" | "creator";

const anonRoutes = [
    {
        label: "Home",
        href: "/home"
    }
]

const userRoutes = [
    {
        label: "Home",
        href: "/home"
    },
    {
        label:"Programs",
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
    }
]

const MobileSidebar = async ({
    userRole
}: {
    userRole: UserRole
}) => {
    const supabase = createClient();

    const { data: { user }} = await supabase.auth.getUser();

    let currentUser = null
    let routes = anonRoutes;

    if (user) {
        currentUser = await supabase
            .from("users")
            .select()
            .eq("id", user.id)
            .single()

        if (userRole == "creator") {
            routes = creatorRoutes
        } else {
            routes = userRoutes
        }
    }

    return (
        <div className="bg-systemBackground sticky top-0 w-full z-50 flex md:hidden h-16 text-white">
            <Sheet>
                <SheetTrigger className="md:hidden hover:opacity-75 transition p-5">
                    <Menu color="white"/>
                </SheetTrigger>
                <SheetTitle hidden>Menu</SheetTitle>
                <SheetContent side="left" className="p-0 border-0 w-80 bg-background border-r-[1px] flex flex-col justify-between">
                    <div className="flex flex-col h-full pb-5">
                        <Logo></Logo>
                        <div className="flex flex-col h-full justify-between">
                            <MobileSidebarRoutes routes={routes}></MobileSidebarRoutes>
                            {(currentUser !== null && currentUser.data !== null) ? (
                                <div className="px-5 flex flex-row justify-between items-center">
                                <UserInfo fullName={currentUser.data.full_name} username={currentUser.data.username}></UserInfo>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Ellipsis className="font-primaryText"></Ellipsis>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem className="p-0">
                                                <button className="w-full h-full px-2 py-1.5 text-start">Switch to creator view</button>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator></DropdownMenuSeparator>
                                            <DropdownMenuItem className="p-0">
                                                <LogoutButton></LogoutButton>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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