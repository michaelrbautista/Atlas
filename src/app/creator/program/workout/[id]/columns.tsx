"use client"

import { FetchedExercise } from "@/server-actions/fetch-types"
import { ColumnDef, RowData } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import EditProgramExerciseForm from "@/components/creator/exercise/EditProgramExerciseForm"
import React, { useState } from "react"

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateProgramExercise?: (exercise: FetchedExercise, exerciseNumber: number) => void;
        deleteProgramExercise?: (programExerciseId: string, programExerciseIndex: number) => void;
    }
}

export const columns: ColumnDef<FetchedExercise>[] = [
    {
        accessorKey: "exercises.video_url",
        header: "Video",
    },
    {
        accessorKey: "exercises.title",
        header: "Title",
    },
    {
        accessorKey: "sets",
        header: "Sets",
    },
    {
        accessorKey: "reps",
        header: "Reps",
    },
    {
        accessorKey: "time",
        header: "Time",
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
        const exercise = row.original

        const [dialogType, setDialogType] = useState<"edit" | "delete">("edit");
        const [isOpen, setIsOpen] = useState(false);
 
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <DialogTrigger
                                className="w-full"
                                onClick={() => {
                                    setIsOpen(true);
                                }}
                            >
                                Edit exercise
                            </DialogTrigger>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DialogTrigger
                                className="w-full"
                                onClick={() => {
                                    setDialogType("delete");
                                    setIsOpen(true);
                                }}
                            >
                                Delete exercise
                            </DialogTrigger>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                    <DialogHeader>
                        {dialogType == "edit" ? (
                            <DialogTitle>Edit Exercise</DialogTitle>
                        ) : (
                            <DialogTitle>Delete Exercise</DialogTitle>
                        )}
                        <DialogDescription hidden></DialogDescription>
                    </DialogHeader>
                    {dialogType == "edit" ? (
                        <EditProgramExerciseForm
                            programExercise={exercise}
                            setIsOpen={setIsOpen}
                            updateProgramExercise={table.options.meta?.updateProgramExercise!}
                        />
                    ) : (
                        <div className="flex flex-col gap-5 pt-5">
                            <p>Are you sure you want to delete this exercise?</p>
                            <Button
                                onClick={() => {
                                    table.options.meta?.deleteProgramExercise!(exercise.id, exercise.exercise_number);
                                    setIsOpen(false);
                                }}
                                variant="destructive"
                            >
                                Delete
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        )
        },
    },
]
