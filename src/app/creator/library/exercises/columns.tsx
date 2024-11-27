"use client"

import { FetchedProgram } from "@/server-actions/fetch-types"
import { ColumnDef, RowData } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dumbbell, MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React, { useState } from "react"
import { Tables } from "../../../../../database.types"
import EditProgramForm from "@/components/creator/program/EditProgramForm"
import Image from "next/image"
import PlayExerciseVideoButton from "@/components/exercise/PlayExerciseVideoButton"
import EditExerciseForm from "@/components/creator/exercise/EditExerciseForm"

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateLibraryExercise?: (newExercise: Tables<"exercises">) => void;
        deleteLibraryExercise?: (exerciseId: string) => void;
    }
}

export const columns: ColumnDef<Tables<"exercises">>[] = [
    {
        accessorKey: "video_url",
        header: "Video",
        cell: ({ row }) => {
            const exercise = row.original

            return (
                (!exercise.video_url || exercise.video_url == "") ? (
                    // Replace with placeholder image
                    <p className="text-secondaryText">No video</p>
                ) : (
                    <PlayExerciseVideoButton videoUrl={exercise.video_url} />
                )
            )
        }
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "instructions",
        header: "Instructions",
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
                        <EditExerciseForm
                            exercise={exercise}
                            setIsOpen={setIsOpen}
                            updateLibraryExercise={table.options.meta?.updateLibraryExercise!}
                        />
                    ) : (
                        <div className="flex flex-col gap-5 pt-5">
                            <p>Are you sure you want to delete this exercise?</p>
                            <Button
                                onClick={() => {
                                    table.options.meta?.deleteLibraryExercise!(exercise.id);
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
