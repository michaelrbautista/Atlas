"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../../components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useAppContext } from "@/context";
import Logo from "../../components/logo";
import SidebarRoutes from "./SidebarRoutes";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import CreateAccountForm from "./createAccountForm";
import SignInForm from "./signInForm";

const Sidebar = () => {
    const { authUserId } = useAppContext();

    const [showSignIn, setShowSignIn] = useState(false);
    const [showCreateAccount, setShowCreateAccount] = useState(false);

    return (
        <div className="sticky flex flex-col h-full w-full md:flex z-50 left-0 inset-y-0">
            <div className="flex flex-col h-full">
                <Logo></Logo>
                <SidebarRoutes></SidebarRoutes>
            </div>
            {authUserId ? (
                <div>
                    <h1>{authUserId}</h1>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-5 p-5">
                    <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
                        <DialogTrigger asChild>
                            <Button className={buttonVariants({ variant: "default", size: "lg" })}>Sign In</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-systemGray6 sm:max-w-md">
                            <SignInForm onOpenChange={setShowSignIn}></SignInForm>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={showCreateAccount} onOpenChange={setShowCreateAccount}>
                        <DialogTrigger asChild>
                            <Button className={buttonVariants({ variant: "default", size: "lg" })}>Create Account</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-systemGray6 sm:max-w-md">
                            <CreateAccountForm onOpenChange={setShowCreateAccount}></CreateAccountForm>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    )
};

export default Sidebar;