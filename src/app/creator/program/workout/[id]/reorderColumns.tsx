"use client"

import { FetchedExercise } from "@/server-actions/models"
import { ColumnDef, RowData } from "@tanstack/react-table"
import React from "react"
import ProgramExerciseOptionsDialog from "./ProgramExerciseOptionsDialog"
import PlayExerciseVideoButton from "@/components/exercise/user/PlayExerciseVideoButton"
import { Menu } from "lucide-react"

export const reorderColumns: ColumnDef<FetchedExercise>[] = [
    {
        header: "Reorder",
        cell: ({ row }) => {
            const exercise = row.original

            return (
                <Menu size={20}/>
            )
        }
    },
    {
        accessorKey: "video_url",
        header: "Video",
        cell: ({ row }) => {
            const exercise = row.original

            return (
                (!exercise.exercises?.video_url || exercise.exercises?.video_url == "") ? (
                    // Replace with placeholder image
                    <p className="text-secondaryText">No video</p>
                ) : (
                    <PlayExerciseVideoButton videoUrl={exercise.exercises?.video_url} />
                )
            )
        }
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
        accessorKey: "other",
        header: "Other notes",
    }
]
