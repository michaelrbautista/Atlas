"use client";

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react";
import { Tables } from "../../../database.types";
import SelectExerciseList from "./SelectExerciseList";

const AddExerciseButton = ({
    workoutId,
    exerciseNumber,
    addNewExercise
}: {
    workoutId: string,
    exerciseNumber: number,
    addNewExercise: (exercise: Tables<"workout_exercises">) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button variant="systemBlue">+ Add exercise</Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
                <SheetHeader>
                    <SheetTitle>Add Exercise</SheetTitle>
                    <SheetDescription hidden></SheetDescription>
                </SheetHeader>
                <SelectExerciseList addNewExercise={addNewExercise} workoutId={workoutId} exerciseNumber={exerciseNumber} setIsOpen={setIsOpen}/>
            </SheetContent>
        </Sheet>
    )
}

export default AddExerciseButton