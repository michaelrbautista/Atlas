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
import { Loader2 } from "lucide-react";
import { createProgram } from "@/server-actions/program";
import { useFormStatus } from "react-dom";
import { ProgramSchema } from "@/app/schema";
import EditProgramForm from "./EditProgramForm";
import { Tables } from "../../../../database.types";

const EditProgramButton = ({
    program,
    updateProgram
}: {
    program: Tables<"programs">,
    updateProgram: (program: Tables<"programs">) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button variant="ghost" size="sm">
                    Edit
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
                <SheetHeader>
                    <SheetTitle>Edit Program</SheetTitle>
                    <SheetDescription hidden></SheetDescription>
                </SheetHeader>
                <EditProgramForm
                    program={program}
                    updateProgram={updateProgram}
                    setIsOpen={setIsOpen}
                />
            </SheetContent>
        </Sheet>
    );
}
 
export default EditProgramButton;