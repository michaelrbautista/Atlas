"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { logout } from "@/server-actions/auth";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { useUserContext } from "@/context";

const UserInfo = () => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const { toast } = useToast();

    const userContext = useUserContext();

    async function clientLogout() {
        userContext.logout();

        const error = await logout();

        if (error) {
            toast({
                title: "An error occurred.",
                description: error.message
            })
            return
        }
    }

    return (
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
            <DialogContent className="bg-background max-w-96 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Help</DialogTitle>
                    <DialogDescription>For help, please send an email to mrbautistadev@gmail.com</DialogDescription>
                </DialogHeader>
            </DialogContent>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="userInfo">
                        <div className="flex flex-col p-2 items-start">
                            <p className="text-foreground text-base font-bold line-clamp-1">{userContext.user?.full_name}</p>
                            <p className="text-muted-foreground text-sm font-normal line-clamp-1">@{userContext.user?.username}</p>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <Link href={`/${userContext.user?.username}`} className="w-full h-full px-2 py-1.5 text-start cursor-pointer">View profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Button
                            className="justify-start h-8 cursor-pointer"
                            variant="ghost"
                            size="full"
                            onClick={() => {setDialogIsOpen(true)}}
                        >
                            Help
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <form action={clientLogout}>
                            <button className="w-full text-start">Logout</button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Dialog>
    );
}
 
export default UserInfo;