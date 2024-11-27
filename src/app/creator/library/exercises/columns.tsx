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
import ExerciseOptionsDialog from "./ExerciseOptionsDialog"

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
 
        return (
            <ExerciseOptionsDialog
                exercise={exercise}
                table={table}
            />
        )
        },
    },
]
