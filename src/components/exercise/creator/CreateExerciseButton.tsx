"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { memo, useState } from "react";
import CreateExerciseForm from "./CreateExerciseForm";
import { Tables } from "../../../../database.types";

const CreateExerciseButton = ({
    buttonSize,
    exerciseCreated
}: {
    buttonSize: "default" | "sm" | "lg" | "icon" | "smallIcon" | "full",
    exerciseCreated: (exercise: Tables<"exercises">) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button variant="systemBlue" size={buttonSize}>New exercise</Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
                <SheetHeader>
                    <SheetTitle>New Exercise</SheetTitle>
                    <SheetDescription hidden></SheetDescription>
                </SheetHeader>
                <CreateExerciseForm
                    setIsOpen={setIsOpen}
                    exerciseCreated={exerciseCreated}
                />
            </SheetContent>
        </Sheet>
    )
}
export default memo(CreateExerciseButton)