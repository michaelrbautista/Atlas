"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { FetchedArticle, FetchedExercise } from "@/server-actions/models"
import React, { Dispatch, SetStateAction } from "react"
import { decrementProgramExercises, deleteLibraryExercise, deleteProgramExercise } from "@/server-actions/exercise"
import { deleteProgram } from "@/server-actions/program"
import { Tables } from "../../../database.types"
import { deleteLibraryWorkout } from "@/server-actions/workout"
import { decrementCollectionNumbers, deleteCollection } from "@/server-actions/collection"
import { deleteArticle } from "@/server-actions/articles"

interface DataTableProps<TData, TValue> {
    readonly columns: ColumnDef<TData, TValue>[]
    readonly data: TData[]
    readonly setData: Dispatch<SetStateAction<TData[]>>
}

export function DataTable<TData, TValue>({
    columns,
    data,
    setData
}: DataTableProps<TData, TValue>) {
    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateProgram: (newProgram: Tables<"programs">) => {
                const updatedPrograms = data.map((program) => {
                    const fetchedProgram = program as Tables<"programs">
                    if (fetchedProgram.id == newProgram.id) {
                        return newProgram as TData
                    } else {
                        return program
                    }
                })
                setData(updatedPrograms)
            },
            deleteProgram: (program: Tables<"programs">) => {
                deleteProgram(program);

                const fetchedData = data as FetchedExercise[]
                setData(
                    fetchedData.filter(listProgram =>
                        listProgram.id !== program.id
                    ) as TData[]
                );
            },
            updateLibraryWorkout: (newWorkout: Tables<"workouts">) => {
                const updatedWorkouts = data.map((workout) => {
                    const fetchedWorkout = workout as Tables<"workouts">
                    if (fetchedWorkout.id == newWorkout.id) {
                        return newWorkout as TData
                    } else {
                        return workout
                    }
                })
                setData(updatedWorkouts)
            },
            deleteLibraryWorkout: (workoutId: string) => {
                deleteLibraryWorkout(workoutId);

                const fetchedData = data as FetchedExercise[]
                setData(
                    fetchedData.filter(workout =>
                        workout.id !== workoutId
                    ) as TData[]
                );
            },
            updateProgramExercise: (newExercise: FetchedExercise, exerciseNumber: number) => {
                const updatedExercises = data.map((exercise) => {
                    const fetchedExercise = exercise as FetchedExercise
                    if (fetchedExercise.exercise_number == exerciseNumber) {
                        return newExercise as TData
                    } else {
                        return exercise
                    }
                })
                setData(updatedExercises)
            },
            deleteProgramExercise: (programExerciseId: string, exerciseNumber: number, workoutId?: string, programWorkoutId?: string) => {
                // Delete exercise from program
                deleteProgramExercise(programExerciseId);

                // Decrement exercises
                decrementProgramExercises(exerciseNumber, workoutId, programWorkoutId);

                const fetchedData = data as FetchedExercise[]
                setData(
                    fetchedData.filter(exercise => {
                        // Decrement exercises on UI
                        if (exercise.id !== programExerciseId) {
                            if (exercise.exercise_number > exerciseNumber) {
                                exercise.exercise_number -= 1
                            }

                            return exercise
                        }
                    }) as TData[]
                );
            },
            updateLibraryExercise: (newExercise: Tables<"exercises">) => {
                const updatedExercises = data.map((exercise) => {
                    const fetchedExercise = exercise as Tables<"exercises">
                    if (fetchedExercise.id == newExercise.id) {
                        return newExercise as TData
                    } else {
                        return exercise
                    }
                })
                setData(updatedExercises)
            },
            deleteLibraryExercise: (exercise: Tables<"exercises">) => {
                deleteLibraryExercise(exercise);

                const fetchedData = data as FetchedExercise[]
                setData(
                    fetchedData.filter(listExercise =>
                        listExercise.id !== exercise.id
                    ) as TData[]
                );
            },
            updateCollection: (newCollection: Tables<"collections">) => {
                const updatedCollections = data.map((collection) => {
                    const fetchedCollection = collection as Tables<"collections">
                    if (fetchedCollection.id == newCollection.id) {
                        return newCollection as TData
                    } else {
                        return collection
                    }
                })
                setData(updatedCollections)
            },
            deleteCollection: (collection: Tables<"collections">) => {
                // Delete exercise from program
                deleteCollection(collection.id);

                // Decrement exercises
                decrementCollectionNumbers(collection.collection_number, collection.created_by);

                const fetchedData = data as Tables<"collections">[]
                setData(
                    fetchedData.filter(listCollection => {
                        // listCollection.id !== collection.id
                        // Decrement exercises on UI
                        if (listCollection.id !== collection.id) {
                            if (listCollection.collection_number > collection.collection_number) {
                                listCollection.collection_number -= 1
                            }

                            return listCollection
                        }
                    }) as TData[]
                );
            },
            deleteArticle: (article: FetchedArticle) => {
                deleteArticle(article.id, article.content);

                const fetchedData = data as FetchedExercise[]
                setData(
                    fetchedData.filter(listArticle =>
                        listArticle.id !== article.id
                    ) as TData[]
                );
            }
        }
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ): (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
