import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { Dispatch, SetStateAction, useState } from "react";
import { Label } from "@/components/ui/label";
import { Tables } from "../../../../../database.types";
import { Loader2 } from "lucide-react";
import { addLibraryWorkoutToProgram } from "@/server-actions/workout";


const AddLibraryWorkoutButton = ({
    programId,
    week,
    day,
    setIsOpen,
    addWorkout,
    workout
}: {
    programId: string,
    week: number,
    day: string,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    addWorkout: (workout: Tables<"program_workouts">) => void,
    workout: Tables<"workouts">
}) => {
    const [isLoading, setIsLoading] = useState(false);

    async function addWorkoutToProgramClient() {
        setIsLoading(true);

        // Save workout to program_workout table
        let {
            data: workoutData,
            error: workoutError
        } = await addLibraryWorkoutToProgram(
            workout.id,
            workout.title,
            programId,
            week,
            day,
            workout.description
        );

        if (workoutError && !workoutData) {
            console.log(workoutError);
            return
        }

        addWorkout(workoutData!);
        setIsOpen(false);
    }

    return (
        <Button onClick={addWorkoutToProgramClient} variant="secondary" size="sm" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isLoading && "Add"}
        </Button>
    )
}

export default AddLibraryWorkoutButton