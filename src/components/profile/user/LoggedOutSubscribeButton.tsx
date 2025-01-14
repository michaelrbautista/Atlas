"use client";

import { useState } from "react";
import SignInForm from "../../auth/SignInForm";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import CreateAccountForm from "../../auth/CreateAccountForm";

const LoggedOutSubscribeButton = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="w-full" asChild>
                <Button variant="systemBlue" size="full">
                    Subscribe
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                {isSignIn ? (
                    <div className="flex flex-col">
                        <SignInForm fromLandingPage={false} setIsOpen={setIsOpen}/>
                        <Button onClick={() => {
                            setIsSignIn(false);
                        }} variant="link">
                            Create an account
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <CreateAccountForm fromLandingPage={false} setIsOpen={setIsOpen}/>
                        <Button onClick={() => {
                            setIsSignIn(true);
                        }} variant="link">
                            Sign in
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
export default LoggedOutSubscribeButton