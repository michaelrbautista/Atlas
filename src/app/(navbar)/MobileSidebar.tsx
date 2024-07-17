"use client";

import { Menu } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";

import { useState } from "react";
import Logo from "../../components/logo";
import MobileSidebarRoutes from "./MobileSidebarRoutes";
import Link from "next/link";
import { Button, buttonVariants } from "../../components/ui/button";
import { useAppContext } from "@/context";
import { SheetClose } from "@/components/ui/sheet";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import CreateAccountForm from "../(sidebar)/createAccountForm";
import SignInForm from "../(sidebar)/signInForm";

const MobileSidebar = () => {
    const { authUserId } = useAppContext();

    const [showSignIn, setShowSignIn] = useState(false);
    const [showCreateAccount, setShowCreateAccount] = useState(false);

    return (
        <Sheet>
            <SheetTrigger className="md:hidden hover:opacity-75 transition">
                <Menu color="white"/>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-0 w-72 bg-systemGray6 flex flex-col justify-between">
                <div>
                    <Logo></Logo>
                    <MobileSidebarRoutes></MobileSidebarRoutes>
                </div>
                {authUserId ? (
                    <div>
                        <h1>Account</h1>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-5 p-5">
                        <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
                            <DialogTrigger asChild>
                                <Button className={buttonVariants({ variant: "systemBlue", size: "wide" })}>Sign In</Button>
                            </DialogTrigger>
                            <DialogContent className="bg-systemGray6 sm:max-w-md">
                                <SignInForm onOpenChange={setShowSignIn}></SignInForm>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={showCreateAccount} onOpenChange={setShowCreateAccount}>
                            <DialogTrigger asChild>
                                <Button className={buttonVariants({ variant: "systemGray", size: "wide" })}>Create Account</Button>
                            </DialogTrigger>
                            <DialogContent className="bg-systemGray6 sm:max-w-md">
                                <CreateAccountForm onOpenChange={setShowCreateAccount}></CreateAccountForm>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
 
export default MobileSidebar;