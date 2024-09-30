"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import ProgramForm from "./ProgramForm";
import { Tables } from "../../../database.types";

const CreateProgramButton = ({
    addProgram
}: {
    addProgram: (program: Tables<"programs">) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button className={buttonVariants({ variant: "systemBlue", size: "sm"})}>Create Program</Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
                <SheetHeader>
                    <SheetTitle>New Program</SheetTitle>
                    <SheetDescription hidden></SheetDescription>
                </SheetHeader>
                <ProgramForm setIsOpen={setIsOpen} addProgram={addProgram}/>
            </SheetContent>
        </Sheet>
    );
}
 
export default CreateProgramButton;