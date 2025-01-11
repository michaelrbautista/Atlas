"use client";

import { Button } from "@/components/ui/button"
import { Tables } from "../../../../../database.types"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { deleteProgramWorkout } from "@/server-actions/workout"
import { useToast } from "@/components/ui/use-toast"
import NewProgramWorkoutButton from "@/components/workout/creator/program/NewProgramWorkoutButton"

const Day = ({
    programId,
    workouts,
    week,
    day,
    disabled,
    addWorkout,
    removeWorkout
}: {
    programId: string,
    workouts: Tables<"program_workouts">[],
    week: number,
    day: string,
    disabled: boolean,
    addWorkout: (workout: Tables<"program_workouts">) => void,
    removeWorkout: (workoutId: string) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [deleteIsOpen, setDeleteIsOpen] = useState(false);

    const { toast } = useToast();

    const deleteWorkoutClient = async (workoutId: string) => {
        const error = await deleteProgramWorkout(workoutId);

        if (error) {
            toast({
                title: "An error occurred.",
                description: error.error
            })
            return
        }

        removeWorkout(workoutId);

        setDeleteIsOpen(false);
    }

    if (disabled) {
        return (
            <div className="bg-systemBackground border-r-[1px] flex flex-col gap-2 min-w-32 h-full p-2">
                <div className="flex flex-row justify-between items-center">
                    <p className={cn("text-sm font-semibold", disabled ? "text-systemGray4" : "text-secondaryText")}>{day.charAt(0).toUpperCase()}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="bg-systemGray6 border-r-[1px] flex flex-col gap-2 min-w-32 max-w-32 h-full p-2">
                <div className="flex flex-row justify-between items-center">
                    <p className="text-secondaryText text-sm font-semibold p-2">{day.charAt(0).toUpperCase()}</p>
                    <NewProgramWorkoutButton
                        programId={programId}
                        week={week}
                        day={day}
                        addWorkout={addWorkout}
                    />
                </div>
                {/* Workouts */}
                <div className="flex flex-col gap-2">
                    {workouts.map((workout) => {
                        return (
                            <Dialog open={deleteIsOpen} onOpenChange={setDeleteIsOpen} key={workout.id}>
                                <DialogContent className="bg-background max-w-96 sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle hidden></DialogTitle>
                                        <DialogDescription hidden></DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-5 pt-5">
                                        <p className="text-primaryText font-base">Are you sure you want to delete this workout?
                                        </p>
                                        <Button
                                            variant="destructive"
                                            size="full"
                                            onClick={() => {deleteWorkoutClient(workout.id)}}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </DialogContent>
                                <ContextMenu>
                                    <ContextMenuTrigger className="flex" asChild>
                                        <Link
                                            href={`workout/${workout.id}`}
                                            className="bg-systemGray4 p-2 rounded-md"
                                            key={workout.id}
                                        >
                                            <p className="text-primaryText text-sm font-semibold truncate">{workout.title}</p>
                                        </Link>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem asChild>
                                            <Button
                                                className="justify-start"
                                                variant="ghost"
                                                size="full"
                                                onClick={() => {setDeleteIsOpen(true)}}
                                            >
                                                <p className="text-systemRed">Delete</p>
                                            </Button>
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            </Dialog>
                        )
                    })}
                </div>
            </div>
        )
    }
}
export default Day