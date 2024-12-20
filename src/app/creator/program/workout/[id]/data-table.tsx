"use client"

import {
    ColumnDef,
    Row,
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
import { FetchedExercise } from "@/server-actions/models"
import React, { Dispatch, SetStateAction, useState } from "react"
import { decrementProgramExercises, deleteLibraryExercise, deleteProgramExercise, udpateOrderOfExercises } from "@/server-actions/exercise"
import { deleteProgram } from "@/server-actions/program"
import { Tables } from "../../../../../../database.types"
import { deleteLibraryWorkout } from "@/server-actions/workout"
import { Reorder } from "framer-motion";
import { useFieldArray, useForm, useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    setData: Dispatch<SetStateAction<TData[]>>
    isReordering: boolean
    setIsReordering: Dispatch<SetStateAction<boolean>>
}

export function ReorderDataTable<TData, TValue>({
    columns,
    data,
    setData,
    isReordering,
    setIsReordering
}: DataTableProps<TData, TValue>) {
    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
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
                        exercise.id !== programExerciseId

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
            }
        }
    })

    type ExercisesForm = {
        exercises: Row<TData>[]
    }

    const form = useForm<ExercisesForm>({
        defaultValues: {
            exercises: table.getRowModel().rows
        }
    })

    const { control } = form;
    const { fields, move } = useFieldArray({
        control,
        name: "exercises"
    });

    const [active, setActive] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const saveOrder = async () => {
        const newExercises = fields.map((row, index) => {
            const exercise = row.original as FetchedExercise;
            exercise.exercise_number = index + 1;
            return exercise
        })
        setData(newExercises as TData[]);

        await udpateOrderOfExercises(newExercises);

        setIsReordering(false);
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center pb-5 pt-5">
                <p className="text-foreground text-md sm:text-lg font-bold">Exercises</p>
                <div className="flex flex-row gap-5">
                    <Button
                        variant={isLoading ? "disabled" : "secondary"}
                        disabled={isLoading}
                        onClick={() => {
                            setIsReordering(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={isLoading ? "disabled" : "systemBlue"}
                        disabled={isLoading}
                        onClick={() => {
                            saveOrder();
                            setIsReordering(false);
                        }}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {!isLoading && "Save"}
                    </Button>
                </div>
            </div>
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
                    {/* Allow reordering */}
                    {isReordering ? (
                        <Reorder.Group
                            as="tbody"
                            values={fields}
                            onReorder={(e) => {
                                e.map((row, index) => {
                                    const activeElement = fields[active];
                                    if (row === activeElement) {
                                        move(active, index);
                                        setActive(index);
                                    }
                                })
                            }}
                        >
                            {table.getRowModel().rows?.length ? (
                                fields.map((row, index) => (
                                    <Reorder.Item
                                        as="tr"
                                        key={row.id}
                                        id={row.id}
                                        value={row}
                                        onDragStart={(e) => {
                                            setActive(index);
                                        }}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </Reorder.Item>
                                ))
                            ): (
                                /* Don't allow reordering */
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </Reorder.Group>
                    ): (
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
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
                    )}
                </Table>
            </div>
        </div>
    )
}
