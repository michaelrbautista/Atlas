"use client";

import { Dispatch, SetStateAction, memo, useCallback, useEffect, useState } from "react"
import { Tables } from "../../../../database.types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import ExistingExerciseForm from "./ExistingExerciseForm";
import { useToast } from "../../ui/use-toast";
import { FetchedExercise } from "@/server-actions/models";
import { getCreatorsExercises } from "@/server-actions/exercise";

const SelectExerciseList = ({
    workoutId,
    programWorkoutId,
    exerciseNumber,
    setIsOpen,
    addNewExercise
}: {
    workoutId?: string,
    programWorkoutId?: string,
    exerciseNumber: number,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    addNewExercise: (exercise: FetchedExercise) => void
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [exercises, setExercises] = useState<Tables<"exercises">[] | null>(null);
    
    const [selectedExercise, setSelectedExercise] = useState<Tables<"exercises"> | null>(null);

    const { toast } = useToast();

    useEffect(() => {
        const getExercises = async () => {
            setIsLoading(true);

            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "An error occurred.",
                    description: "Couldn't get current user."
                })
                return
            }

            const { data: exerciseData, error: exerciseError } = await getCreatorsExercises();

            if (exerciseError || !exerciseData) {
                toast({
                    title: "An error occurred.",
                    description: exerciseError
                })
                return
            }

            setExercises(exerciseData);
            setIsLoading(false);
        }

        getExercises();
    }, []);

    const selectExercise = useCallback((exercise: Tables<"exercises"> | null) => {
        setSelectedExercise(exercise);
    }, []);

    if (selectedExercise) {
        return (
            <div className="h-full flex flex-col gap-3">
                <div className="flex flex-col gap-5 bg-systemGray6 p-5 rounded-lg">
                    <div>
                        <p className="text-primaryText font-semibold">{selectedExercise.title}</p>
                        <p className="text-secondaryText text-sm">{selectedExercise.instructions}</p>
                    </div>
                </div>
                <Button onClick={() => {selectExercise(null)}} variant="secondary" size="full">Select different exercise</Button>
                <ExistingExerciseForm
                    exercise={selectedExercise}
                    workoutId={workoutId}
                    programWorkoutId={programWorkoutId}
                    exerciseNumber={exerciseNumber}
                    setIsOpen={setIsOpen}
                    addNewExercise={addNewExercise}
                />
            </div>
        )
    } else {
        return (
            <div className="flex flex-col h-full pt-5">
                {(isLoading || !exercises) ?
                    (
                        <div className="h-full w-full flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        </div>
                    ) : exercises?.length == 0 ? (
                        <div className="text-secondaryText text-sm pt-5">You haven't created any exercises yet.</div>
                    ) : 
                        <div className="flex flex-col gap-5 pb-32 overflow-scroll">
                            {exercises?.map((exercise) => {
                                return (
                                    <div className="flex flex-col gap-5 bg-systemGray6 p-5 rounded-lg" key={exercise.id}>
                                        <div>
                                            <p className="text-primaryText font-semibold">{exercise.title}</p>
                                            <p className="text-secondaryText text-sm">{exercise.instructions}</p>
                                        </div>
                                        <Button onClick={() => {selectExercise(exercise)}} variant="systemBlue" size="full">Select</Button>
                                    </div>
                                )
                            })}
                        </div>
                }
            </div>
        )
    }
}
export default memo(SelectExerciseList)