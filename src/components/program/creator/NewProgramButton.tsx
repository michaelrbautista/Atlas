"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import NewProgramForm from "./NewProgramForm";
import { Tables } from "../../../../database.types";

const NewProgramButton = ({
    addProgram
}: {
    addProgram: (program: Tables<"programs">) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button variant="systemBlue" size="sm">New program</Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
                <SheetHeader>
                    <SheetTitle>New Program</SheetTitle>
                    <SheetDescription hidden></SheetDescription>
                </SheetHeader>
                <NewProgramForm setIsOpen={setIsOpen} addProgram={addProgram}/>
            </SheetContent>
        </Sheet>
    );
}
 
export default NewProgramButton;