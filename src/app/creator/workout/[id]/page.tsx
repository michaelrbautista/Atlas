"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import { createClient } from "@/utils/supabase/client";
import AddExerciseButton from "@/components/exercise/AddExerciseButton";
import ExerciseList from "@/components/exercise/ExerciseList";

const ViewCreatorWorkout = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [workout, setWorkout] = useState<Tables<"workouts">>();
    const [exercises, setExercises] = useState<Tables<"workout_exercises">[]>([] as Tables<"workout_exercises">[]);

    useEffect(() => {
        const getWorkout = async () => {
            setIsLoading(true);

            const supabase = createClient();

            // Get workout
            const { data: workoutData, error: workoutError } = await supabase
                .from("workouts")
                .select()
                .eq("id", params.id)
                .single()
            
            if (workoutError || !workoutData) {
                console.log(workoutError || "Error getting workout.");
                setIsLoading(false);
                return
            }

            setWorkout(workoutData);

            // Get exercises
            const { data: exercises, error: exercisesError } = await supabase
                .from("workout_exercises")
                .select()
                .eq("workout_id", workoutData.id)
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

    const addNewExercise = (exercise: Tables<"workout_exercises">) => {
        setExercises(exercises => [...exercises, exercise]);
    }

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-full sm:max-w-2xl px-5 py-20 sm:py-10 gap-3 sm:gap-10">
                <div>
                    <p className="text-primaryText text-3xl font-bold">{workout?.title}</p>
                    <p className="text-primaryText py-2">{workout?.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-foreground text-xl sm:text-2xl font-bold">Exercises</p>
                        <AddExerciseButton addNewExercise={addNewExercise} workoutId={params.id} exerciseNumber={exercises.length + 1} />
                    </div>
                    <ExerciseList exercises={exercises} />
                </div>
            </div>
        )
    }
}
 
export default ViewCreatorWorkout;