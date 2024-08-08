"use client";

import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";
import SignInForm from "@/components/(auth)/signInForm";

const LoginButton = () => {
    const [showSignIn, setShowSignIn] = useState(false);

    return (
        <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
            <DialogTrigger asChild>
                <Button className={buttonVariants({ variant: "secondary", size: "full" })}>Sign In</Button>
            </DialogTrigger>
            <DialogContent className="bg-background max-w-96 sm:max-w-md">
                <SignInForm onOpenChange={setShowSignIn}></SignInForm>
            </DialogContent>
        </Dialog>
    );
}
 
export default LoginButton;