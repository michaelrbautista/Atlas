"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Tables } from "../../../database.types";
import { createClient } from "@/utils/supabase/client";
import AddExerciseButton from "@/components/exercise/Buttons/AddExerciseButton";
import ExerciseList from "@/components/exercise/ExerciseList";

const WorkoutPage = ({
    workout
}: {
    workout: Tables<"workouts">
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [exercises, setExercises] = useState<Tables<"workout_exercises">[]>([] as Tables<"workout_exercises">[]);

    useEffect(() => {
        const getWorkout = async () => {
            setIsLoading(true);

            const supabase = createClient();

            // Get exercises
            const { data: exercises, error: exercisesError } = await supabase
                .from("workout_exercises")
                .select()
                .eq("workout_id", workout.id)
                .order("exercise_number", { ascending: true });

            if (exercisesError && !exercises) {
                console.log("Couldn't get workout's exercises.");
                setIsLoading(false);
                return
            }

            setExercises(exercises);
            setIsLoading(false);
        }

        getWorkout();
    }, []);

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-full sm:max-w-2xl pt-5">
                <div className="flex flex-row justify-between items-center">
                    <p className="text-foreground text-xl sm:text-xl font-bold">Exercises</p>
                    {/* <AddExerciseButton addNewExercise={addNewExercise} workoutId={params.id} exerciseNumber={exercises.length + 1} /> */}
                </div>
                <ExerciseList exercises={exercises} />
            </div>
        )
    }
}
export default WorkoutPage