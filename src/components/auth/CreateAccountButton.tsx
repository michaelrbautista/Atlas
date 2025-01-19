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
import CreateAccountForm from "@/components/auth/CreateAccountForm";

const CreateAccountButton = ({
    fromLandingPage
}: {
    fromLandingPage: boolean
}) => {
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    
    return (
        <Dialog open={showCreateAccount} onOpenChange={setShowCreateAccount}>
            <DialogTrigger asChild>
                <Button variant="systemBlue" size="full">Create Account</Button>
            </DialogTrigger>
            <DialogContent className="max-w-96 sm:max-w-md">
            <DialogHeader>
                <DialogTitle hidden></DialogTitle>
                <DialogDescription hidden></DialogDescription>
            </DialogHeader>
                <CreateAccountForm fromLandingPage={fromLandingPage} setIsOpen={setShowCreateAccount}></CreateAccountForm>
            </DialogContent>
        </Dialog>
    );
}
 
export default CreateAccountButton;