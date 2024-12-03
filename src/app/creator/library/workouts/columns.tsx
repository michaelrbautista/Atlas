"use client"

import { ColumnDef, RowData } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import React from "react"
import { Tables } from "../../../../../database.types"
import WorkoutOptionsDialog from "./WorkoutOptionsDialog"
import { redirectToCreatorsWorkout } from "@/server-actions/workout"

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
        id: "view",
        cell: ({ row, table }) => {
            const workout = row.original

            return (
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        redirectToCreatorsWorkout(workout.id);
                    }}
                >
                    View
                </Button>
            )
        }
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
