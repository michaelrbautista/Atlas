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
import CreateExerciseButton from "@/components/exercise/creator/CreateExerciseButton";
import ExerciseOptions from "@/components/exercise/creator/ExerciseOptions";
import PlayExerciseVideoButton from "@/components/exercise/user/exercise/PlayExerciseVideoButton";
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
        const newExercises = [...exercises, exercise];
        setExercises(newExercises);
    }

    return (
        <div className="flex flex-col gap-5 h-full w-full">
            <div className="flex justify-end">
                <CreateExerciseButton buttonSize="default" exerciseCreated={addExercise} />
            </div>
            <DataTable
                columns={columns}
                data={exercises}
                setData={setExercises}
            />
        </div>
    );
}
export default LibraryExercises