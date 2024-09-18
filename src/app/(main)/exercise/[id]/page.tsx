"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import { Loader2 } from "lucide-react";

const Exercise = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [workoutExercise, setWorkoutExercise] = useState<Tables<"workout_exercises"> | null>(null);
    const [exercise, setExercise] = useState<Tables<"exercises"> | null>(null);

    useEffect(() => {
        const getExercise = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.log("Couldn't get current user.");
                return
            }

            const { data: workoutExerciseData, error: workoutExerciseError } = await supabase
                .from("workout_exercises")
                .select()
                .eq("id", params.id)
                .single()

            if (workoutExerciseError || !workoutExerciseData) {
                console.log(workoutExerciseError);
                return
            }

            setWorkoutExercise(workoutExerciseData);

            const { data: exerciseData, error: exerciseError } = await supabase
                .from("exercises")
                .select()
                .eq("id", workoutExerciseData.exercise_id)
                .single()

            if (exerciseError || !exerciseData) {
                console.log(exerciseError);
                return
            }

            setExercise(exerciseData);
            setIsLoading(false);
        }

        getExercise();
    }, []);

    if (isLoading || !exercise || !workoutExercise) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-full sm:max-w-2xl px-5 py-20 sm:py-10 gap-3 sm:gap-10">
                <div className="flex flex-col gap-5">
                    {exercise.video_url &&
                    <div className="relative w-full aspect-video flex justify-center">
                        <div className="object-fill h-full w-52">
                            <video controls className="rounded-lg">
                                <source src={exercise.video_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                    }
                    <div>
                        <p className="text-primaryText text-3xl font-bold">{exercise.title}</p>
                        <p className="text-secondaryText">{workoutExercise.sets} {workoutExercise.sets == 1 ? "set" : "sets"}</p>
                        <p className="text-secondaryText">{workoutExercise.reps} {workoutExercise.reps == 1 ? "rep" : "reps"}</p>
                    </div>
                    <p className="text-primaryText py-2">{exercise.instructions}</p>
                </div>
            </div>
        )
    }
}
export default Exercise