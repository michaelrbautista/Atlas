"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog"
import { Tables } from "../../../database.types";
import { createClient } from "@/utils/supabase/client";
import { Ellipsis, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const ExerciseItem = ({
    workoutExercise
}: {
    workoutExercise: Tables<"workout_exercises">
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [exercise, setExercise] = useState<Tables<"exercises"> | null>(null);

    const [viewExerciseIsOpen, setViewExerciseIsOpen] = useState(false);

    useEffect(() => {
        const getExercise = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.log("Couldn't get current user.");
                return
            }

            const { data: exerciseData, error: exerciseError } = await supabase
                .from("exercises")
                .select()
                .eq("id", workoutExercise.exercise_id)
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

    if (isLoading || !exercise) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <Dialog open={viewExerciseIsOpen} onOpenChange={setViewExerciseIsOpen}>
                <div onClick={() => {setViewExerciseIsOpen(true)}} className="bg-systemGray5 flex flex-row w-full justify-between items-center p-3 rounded-lg cursor-pointer">
                    <div className="flex flex-col items-start">
                        <p className="text-primaryText font-bold">{exercise.title}</p>
                        <p className="text-secondaryText">{workoutExercise.sets} {workoutExercise.sets == 1 ? "set" : "sets"}</p>
                        <p className="text-secondaryText">{workoutExercise.reps} {workoutExercise.reps == 1 ? "rep" : "reps"}</p>
                    </div>
                </div>
                <DialogContent className="max-w-sm sm:max-w-3xl h-5/6 overflow-scroll">
                    <DialogHeader>
                        <DialogTitle hidden></DialogTitle>
                        <DialogDescription hidden></DialogDescription>
                    </DialogHeader>
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
                </DialogContent>
            </Dialog>
        )
    }
}
export default ExerciseItem