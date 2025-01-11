"use client"

import { ColumnDef, RowData } from "@tanstack/react-table"
import React from "react"
import { Tables } from "../../../../../database.types"
import PlayExerciseVideoButton from "@/components/exercise/user/exercise/PlayExerciseVideoButton"
import ExerciseOptionsDialog from "./ExerciseOptionsDialog"

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateLibraryExercise?: (newExercise: Tables<"exercises">) => void;
        deleteLibraryExercise?: (exercise: Tables<"exercises">) => void;
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
 
        return (
            <ExerciseOptionsDialog
                exercise={exercise}
                table={table}
            />
        )
        },
    },
]
