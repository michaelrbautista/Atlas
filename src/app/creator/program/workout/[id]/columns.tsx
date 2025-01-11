"use client"

import { FetchedExercise } from "@/server-actions/models"
import { ColumnDef, RowData } from "@tanstack/react-table"
import React from "react"
import ProgramExerciseOptionsDialog from "./ProgramExerciseOptionsDialog"
import PlayExerciseVideoButton from "@/components/exercise/user/exercise/PlayExerciseVideoButton"

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateProgramExercise?: (exercise: FetchedExercise, exerciseNumber: number) => void;
        deleteProgramExercise?: (
            programExerciseId: string,
            exerciseNumber: number,
            workoutId?: string,
            programWorkoutId?: string) => void;
    }
}

export const columns: ColumnDef<FetchedExercise>[] = [
    {
        accessorKey: "exercise_number",
        header: "#",
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
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
        const exercise = row.original
 
        return (
            <ProgramExerciseOptionsDialog
                workoutId={exercise.workout_id ?? undefined}
                programWorkoutId={exercise.program_workout_id ?? undefined}
                exercise={exercise}
                table={table}
            />
        )
        },
    },
]
