"use client";

import { memo, useState } from "react";
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
import { Tables } from "../../../../database.types";
import CreateAccountForm from "../../auth/CreateAccountForm";

const LoggedOutPurchaseButton = ({
    program
}: {
    program: Tables<"programs">
}) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="w-full" asChild>
                <Button variant="systemBlue" size="full">
                    Purchase Program {program.price && `- ${formatter.format(program.price)}`}
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
export default memo(LoggedOutPurchaseButton)