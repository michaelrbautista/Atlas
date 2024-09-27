"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import SignInForm from "@/components/auth/SignInForm";

const SignInButton = ({
    fromLandingPage
}: {
    fromLandingPage: boolean
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className={buttonVariants({ variant: "secondary", size: "full" })}>Sign In</Button>
            </DialogTrigger>
            <DialogContent className="bg-background max-w-96 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle hidden></DialogTitle>
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                <SignInForm fromLandingPage={fromLandingPage} setIsOpen={setIsOpen}></SignInForm>
            </DialogContent>
        </Dialog>
    );
}
 
export default SignInButton;