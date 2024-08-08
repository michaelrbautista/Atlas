"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import LoginButton from "./LoginButton";
import CreateAccountButton from "./CreateAccountButton";

const PurchaseModal = ({ 
    children
}: {
    children: React.ReactNode
}) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-background max-w-96 sm:max-w-md">
                <div className="px-5 pt-5 flex flex-col gap-5">
                    <p className="text-foreground text-sm">You must be signed in to purchase a program.</p>
                    <LoginButton></LoginButton>
                    <CreateAccountButton></CreateAccountButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
 
export default PurchaseModal;