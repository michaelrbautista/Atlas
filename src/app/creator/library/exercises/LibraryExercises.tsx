"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Tables } from "../../../../../database.types";
import { getCreatorsExercises } from "@/server-actions/exercise";
import CreateExerciseButton from "@/components/exercise/creator/CreateExerciseButton";
import { DataTable } from "@/components/ui/data-table";
import { useColumns } from "./columns";

const LibraryExercises = () => {
    const [exercises, setExercises] = useState<Tables<"exercises">[]>([])

    useEffect(() => {
        const getExercises = async () => {
            const exercises = await getCreatorsExercises();

            setExercises(exercises)
        }

        getExercises();
    }, []);

    const addExercise = useCallback((exercise: Tables<"exercises">) => {
        const newExercises = [exercise, ...exercises];
        setExercises(newExercises);
    }, [exercises]);

    const columns = useColumns();
    const data = useMemo(() => exercises, [exercises]);

    return (
        <div className="flex flex-col gap-5 h-full w-full">
            <div className="flex justify-end">
                <CreateExerciseButton buttonSize="default" exerciseCreated={addExercise} />
            </div>
            <DataTable
                columns={columns}
                data={data}
                setData={setExercises}
            />
        </div>
    );
}
export default LibraryExercises