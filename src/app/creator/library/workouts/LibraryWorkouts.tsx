"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../../../database.types";
import { useToast } from "@/components/ui/use-toast";
import NewLibraryWorkoutButton from "../../../../components/workout/creator/library/NewLibraryWorkoutButton";
import { DataTable } from "@/components/ui/data-table";
import { useColumns } from "./columns";

const LibraryWorkouts = () => {
    const [workouts, setWorkouts] = useState<Tables<"workouts">[]>([]);
    
    const { toast } = useToast();

    useEffect(() => {
        const getCreatorsPrograms = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "An error occurred.",
                    description: "Couldn't get the current user."
                })
                return
            }

            const { data, error } = await supabase
                .from("workouts")
                .select()
                .eq("created_by", user.id)
                .order("created_at", { ascending: false })

            if (data && !error) {
                setWorkouts(data);
            } else {
                toast({
                    title: "An error occurred.",
                    description: error.message
                })
            }
        }

        getCreatorsPrograms();
    }, []);

    const addWorkout = useCallback((workout: Tables<"workouts">) => {
        const newWorkouts = [workout, ...workouts];
        setWorkouts(newWorkouts);
    }, [workouts]);

    const columns = useColumns();
    const data = useMemo(() => workouts, [workouts]);

    return (
        <div className="flex flex-col gap-5 h-full w-full">
            <div className="flex justify-end">
                <NewLibraryWorkoutButton addWorkout={addWorkout} />
            </div>
            <DataTable
                columns={columns}
                data={data}
                setData={setWorkouts}
            />
        </div>
    );
}
export default LibraryWorkouts