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
import ProgramExerciseOptionsDialog from "./ProgramExerciseOptionsDialog"

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
 
        return (
            <ProgramExerciseOptionsDialog
                exercise={exercise}
                table={table}
            />
        )
        },
    },
]