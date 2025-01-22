"use client";

import { useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import { getCreatorsExercises } from "@/server-actions/exercise";
import CreateExerciseButton from "@/components/exercise/creator/CreateExerciseButton";
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