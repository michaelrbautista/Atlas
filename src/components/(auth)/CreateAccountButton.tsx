"use client";

import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";
import CreateAccountForm from "@/components/(auth)/createAccountForm";

const CreateAccountButton = () => {
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    
    return (
        <Dialog open={showCreateAccount} onOpenChange={setShowCreateAccount}>
            <DialogTrigger asChild>
                <Button className={buttonVariants({ variant: "systemBlue", size: "full" })}>Create Account</Button>
            </DialogTrigger>
            <DialogContent className="max-w-96 sm:max-w-md">
                <CreateAccountForm onOpenChange={setShowCreateAccount}></CreateAccountForm>
            </DialogContent>
        </Dialog>
    );
}
 
export default CreateAccountButton;