"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Tables } from "../../../database.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteExercise, getCreatorsExercises } from "@/server-actions/exercise";
import CreateExerciseButton from "@/components/exercise/Buttons/CreateExerciseButton";
import ExerciseOptions from "@/components/exercise/ExerciseOptions";
import PlayExerciseVideoButton from "@/components/exercise/Buttons/PlayExerciseVideoButton";

const LibraryExercises = () => {
    const [exercises, setExercises] = useState<Tables<"exercises">[]>([])

    useEffect(() => {
        const getExercises = async () => {
            const exercises = await getCreatorsExercises();

            setExercises(exercises)
        }

        getExercises();
    }, []);

    const addExercise = (exercise: Tables<"exercises">) => {
        const newExercises = [exercise, ...exercises];
        setExercises(newExercises);
    }

    const updateExercise = (updatedExercise: Tables<"exercises">) => {
        setExercises(exercises.map(exercise => exercise.id === updatedExercise.id ? updatedExercise : exercise));
    }

    const deleteExerciseClient = (exerciseId: string) => {
        deleteExercise(exerciseId);

        setExercises(exercises => exercises.filter(exercise => exercise.id !== exerciseId));
    }

    return (
        <div className="h-full w-full">
            {/* <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-2xl sm:text-2xl font-bold">My Exercises</p>
                <CreateExerciseButton buttonSize="default" exerciseCreated={addExercise} />
            </div> */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Video</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Instructions</TableHead>
                        <TableHead />
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {exercises.map((exercise) => {
                        return (
                            <TableRow key={exercise.id}>
                                <TableCell>
                                    {(!exercise.video_url || exercise.video_url == "") ? (
                                        // Replace with placeholder image
                                        <p className="text-secondaryText">No video</p>
                                    ) : (
                                        <PlayExerciseVideoButton videoUrl={exercise.video_url} />
                                    )}
                                </TableCell>
                                <TableCell>{exercise.title}</TableCell>
                                <TableCell>{exercise.instructions}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link
                                            href={`/creator/exercise/${exercise.id}`}
                                            className="cursor-pointer"
                                        >
                                            View
                                        </Link>
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <ExerciseOptions
                                        exercise={exercise}
                                        updateExercise={updateExercise}
                                        deleteExerciseClient={deleteExerciseClient}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
export default LibraryExercises