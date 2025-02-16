"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Tables } from "../../../../../database.types";
import { getCreatorsExercises } from "@/server-actions/exercise";
import CreateExerciseButton from "@/components/exercise/creator/CreateExerciseButton";
import { DataTable } from "@/components/ui/data-table";
import { useColumns } from "./columns";
import { useToast } from "@/components/ui/use-toast";

const LibraryExercises = () => {
    const [exercises, setExercises] = useState<Tables<"exercises">[]>([]);

    const { toast } = useToast();

    useEffect(() => {
        const getExercises = async () => {
            const { data, error } = await getCreatorsExercises();

            if (error || !data) {
                toast({
                    title: "An error occurred.",
                    description: "Couldn't get the current user."
                })
                return
            } else {
                setExercises(data);
            }
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