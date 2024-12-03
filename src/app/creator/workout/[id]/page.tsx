"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import AddExerciseButton from "@/components/creator/exercise/AddExerciseButton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import EditLibraryWorkoutButton from "@/components/creator/workout/library/EditLibraryWorkoutButton";
import { getLibraryWorkout } from "@/server-actions/workout";
import { FetchedExercise, FetchedWorkout } from "@/server-actions/fetch-types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../../program/workout/[id]/columns";

const CreatorLibraryWorkout = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [workout, setWorkout] = useState<FetchedWorkout | null>(null);
    const [editWorkout, setEditWorkout] = useState<Tables<"workouts"> | null>(null);
    const [exercises, setExercises] = useState<FetchedExercise[]>([]);

    const { toast } = useToast();

    useEffect(() => {
        const getWorkout = async () => {
            setIsLoading(true);

            // Get workout
            const { data, error } = await getLibraryWorkout(params.id);

            if (error && !data) {
                toast({
                    title: "An error occurred.",
                    description: error
                })
                return
            }

            const { program_exercises, ...editWorkout } = data!

            setWorkout(data!);
            setEditWorkout(editWorkout)
            setExercises(data!.program_exercises)
            setIsLoading(false);
        }

        getWorkout();
    }, []);

    const updateWorkout = (updatedWorkout: Tables<"workouts">) => {
        setWorkout({
            ...workout!,
            title: updatedWorkout.title,
            description: updatedWorkout.description
        })
    }

    const addNewTableExercise = (newExercise: FetchedExercise) => {
        setExercises(exercises => [newExercise, ...exercises]);
    }

    if (isLoading || !workout) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="h-full w-full px-10 py-20 sm:py-10">
                <div className="flex flex-col gap-5 pb-5">
                    <div className="flex gap-5 items-center justify-between">
                        <p className="text-foreground text-2xl sm:text-2xl font-bold">{workout.title}</p>
                        <EditLibraryWorkoutButton
                            workout={editWorkout!}
                            updateWorkout={updateWorkout}
                        />
                    </div>
                    <p className="text-primaryText text-base font-normal">{workout.description}</p>
                </div>
                <Separator />
                <div className="flex justify-between items-center pb-5 pt-5">
                    <p className="text-foreground text-md sm:text-lg font-bold">Exercises</p>
                    <AddExerciseButton
                        addNewExercise={addNewTableExercise}
                        workoutId={params.id}
                        exerciseNumber={exercises.length + 1}
                    />
                </div>
                <DataTable
                    columns={columns}
                    data={exercises}
                    setData={setExercises}
                />
            </div>
        )
    }
}
 
export default CreatorLibraryWorkout;