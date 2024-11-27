"use client"

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
import React, { useState } from "react"
import { Tables } from "../../../../../database.types"
import EditLibraryWorkoutForm from "@/components/creator/workout/library/EditLibraryWorkoutForm"
import WorkoutOptionsDialog from "./WorkoutOptionsDialog"

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateLibraryWorkout?: (newWorkout: Tables<"workouts">) => void;
        deleteLibraryWorkout?: (workoutId: string) => void;
    }
}

export const columns: ColumnDef<Tables<"workouts">>[] = [
{
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
        const workout = row.original
 
        return (
            <WorkoutOptionsDialog
                workout={workout}
                table={table}
            />
        )
        },
    },
]
