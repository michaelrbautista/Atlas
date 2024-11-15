"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Tables } from "../../../database.types";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import CreateExerciseButton from "./Buttons/CreateExerciseButton";
import ExistingExerciseForm from "./Forms/ExistingExerciseForm";
import { useToast } from "../ui/use-toast";

const SelectExerciseList = ({
    workoutId,
    exerciseNumber,
    setIsOpen,
    addNewExercise
}: {
    workoutId: string,
    exerciseNumber: number,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    addNewExercise: (exercise: Tables<"workout_exercises">) => void
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

            const { data: exerciseData, error: exerciseError } = await supabase
                .from("exercises")
                .select()
                .eq("created_by", user.id)

            if (exerciseError && !exerciseData) {
                toast({
                    title: "An error occurred.",
                    description: exerciseError.message
                })
                return
            }

            setExercises(exerciseData);
            setIsLoading(false);
        }

        getExercises();
    }, []);

    const selectExercise = (exercise: Tables<"exercises"> | null) => {
        setSelectedExercise(exercise);
    }

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
                <div className="p-5 absolute inset-x-0 bottom-0 border-t-[1px] bg-systemGray6">
                    <CreateExerciseButton
                        buttonSize="full"
                        exerciseCreated={selectExercise}
                    />
                </div>
            </div>
        )
    }
}
export default SelectExerciseList