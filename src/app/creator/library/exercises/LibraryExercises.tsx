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
import { Tables } from "../../../../../database.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteLibraryExercise, getCreatorsExercises } from "@/server-actions/exercise";
import CreateExerciseButton from "@/components/creator/exercise/CreateExerciseButton";
import ExerciseOptions from "@/components/creator/exercise/ExerciseOptions";
import PlayExerciseVideoButton from "@/components/exercise/PlayExerciseVideoButton";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

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
        deleteLibraryExercise(exerciseId);

        setExercises(exercises => exercises.filter(exercise => exercise.id !== exerciseId));
    }

    return (
        <div className="h-full w-full">
            <div className="flex justify-end">
                <CreateExerciseButton buttonSize="default" exerciseCreated={addExercise} />
            </div>
            <DataTable
                columns={columns}
                data={exercises}
                setData={setExercises}
                libraryType="exercise"
                enableOnClick={true}
            />
        </div>
    );
}
export default LibraryExercises