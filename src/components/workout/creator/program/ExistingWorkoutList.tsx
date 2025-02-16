"use client";

import { Tables } from "../../../../../database.types"
import { Loader2 } from "lucide-react"
import { Dispatch, SetStateAction, memo, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import AddLibraryWorkoutButton from "./AddLibraryWorkoutButton";

const ExistingWorkoutList = ({
    programId,
    week,
    day,
    setIsOpen,
    addWorkout
}: {
    programId: string,
    week: number,
    day: string
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    addWorkout: (workout: Tables<"program_workouts">) => void
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [workouts, setWorkouts] = useState<Tables<"workouts">[] | null>(null);

    const { toast } = useToast();

    useEffect(() => {
        const getWorkouts = async () => {
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

            const { data: workoutData, error: workoutError } = await supabase
                .from("workouts")
                .select()
                .eq("created_by", user.id)

            if (workoutError && !workoutData) {
                toast({
                    title: "An error occurred.",
                    description: workoutError.message
                })
                return
            }

            setWorkouts(workoutData);
            setIsLoading(false);
        }

        getWorkouts();
    }, []);

    const returnWorkouts = () => {
        if (workouts && workouts.length == 0) {
            return (
                <div className="text-secondaryText text-sm pt-5">You haven't created any workouts yet.</div>
            )
        } else if (workouts) {
            return (
                <div className="flex flex-col gap-5 pb-10 w-full max-h-[400px] overflow-scroll">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workouts.map((workout) => {
                                return (
                                    <TableRow key={workout.id}>
                                        <TableCell>{workout.title}</TableCell>
                                        <TableCell>{workout.description}</TableCell>
                                        <TableCell>
                                            <AddLibraryWorkoutButton
                                                programId={programId}
                                                week={week}
                                                day={day}
                                                setIsOpen={setIsOpen}
                                                addWorkout={addWorkout}
                                                workout={workout}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            )
        }
    }

    return (
        <div className="flex flex-col items-center h-full pt-5">
            {(isLoading || !workouts) ?
                (
                    <div className="h-full w-full flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    </div>
                ) : (
                    returnWorkouts()
                )
            }
        </div>
    )
}

export default memo(ExistingWorkoutList)