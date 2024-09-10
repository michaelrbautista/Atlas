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
import { useState } from "react";
import CreateExerciseForm from "./CreateExerciseForm";
import { Tables } from "../../../database.types";

const CreateExerciseButton = ({
    workoutId,
    exerciseNumber,
    selectExercise
}: {
    workoutId: string,
    exerciseNumber: number,
    selectExercise: (exercise: Tables<"exercises">) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button variant="secondary" size="full">Create new exercise</Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
                <SheetHeader>
                    <SheetTitle>New Exercise</SheetTitle>
                    <SheetDescription hidden></SheetDescription>
                </SheetHeader>
                <CreateExerciseForm
                    workoutId={workoutId}
                    exerciseNumber={exerciseNumber}
                    setIsOpen={setIsOpen}
                    selectExercise={selectExercise}
                />
            </SheetContent>
        </Sheet>
    )
}
export default CreateExerciseButton