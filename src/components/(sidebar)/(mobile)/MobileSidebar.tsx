import { Ellipsis, Menu } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";

import Logo from "@/components/(misc)/Logo";
import MobileSidebarRoutes from "./MobileSidebarRoutes";
import LoginButton from "../../(auth)/LoginButton";
import CreateAccountButton from "../../(auth)/CreateAccountButton";
import { Button, buttonVariants } from "@/components/ui/button";
import UserInfo from "../../(auth)/UserInfo";
import { createClient } from "@/utils/supabase/server";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import LogoutButton from "../../(auth)/LogoutButton";

const MobileSidebar = async () => {
    const supabase = createClient();

    const { data: { user }} = await supabase.auth.getUser();

    var currentUser = null

    if (user !== null) {
        currentUser = await supabase
            .from("users")
            .select()
            .eq("id", user!.id)
            .single()
    }

    return (
        <Sheet>
            <SheetTrigger className="md:hidden hover:opacity-75 transition p-5">
                <Menu color="white"/>
            </SheetTrigger>
            <SheetTitle hidden>Menu</SheetTitle>
            <SheetContent side="left" className="p-0 border-0 w-80 bg-background border-r-[1px] flex flex-col justify-between">
                <div className="flex flex-col h-full pb-5">
                    <Logo></Logo>
                    <div className="flex flex-col h-full justify-between">
                        <MobileSidebarRoutes></MobileSidebarRoutes>
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
                                <LoginButton></LoginButton>
                                <CreateAccountButton></CreateAccountButton>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
 
export default MobileSidebar;