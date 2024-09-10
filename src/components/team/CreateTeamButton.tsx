"use client";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { createTeam } from "@/server-actions/team";
import { Loader2 } from "lucide-react";
import { TeamSchema } from "@/app/schema";
import { useFormStatus } from "react-dom";
import TeamForm from "./TeamForm";

const CreateTeamButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button className={buttonVariants({ variant: "systemBlue", size: "sm"})}>Create Team</Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
                <SheetHeader>
                    <SheetTitle>New Team</SheetTitle>
                    <SheetDescription hidden></SheetDescription>
                </SheetHeader>
                <TeamForm setIsOpen={setIsOpen}/>
            </SheetContent>
        </Sheet>
    );
}
 
export default CreateTeamButton;