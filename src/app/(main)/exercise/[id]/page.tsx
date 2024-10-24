import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getExercise, getWorkoutExercise } from "@/server-actions/exercise";

const Exercise = async ({ 
    params
}: {
    params: { id: string }
}) => {

    const workoutExercise = await getWorkoutExercise(params.id);

    const exercise = await getExercise(workoutExercise.exercise_id);

    return (
        <div className="flex flex-col w-full sm:max-w-lg px-5 py-20 sm:py-10 gap-3 sm:gap-10">
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
export default Exercise