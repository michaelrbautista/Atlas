"use client";

import CreateProgramButton from "../../../../components/creator/program/NewProgramButton";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Tables } from "../../../../../database.types";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { deleteProgram } from "@/server-actions/program";
import ProgramOptions from "@/components/creator/program/ProgramOptions";
import { useToast } from "@/components/ui/use-toast";
import NewLibraryWorkoutButton from "../../../../components/creator/workout/library/NewLibraryWorkoutButton";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const LibraryWorkouts = () => {
    const [workouts, setWorkouts] = useState<Tables<"workouts">[]>([]);
    
    const { toast } = useToast();

    useEffect(() => {
        const getTeamPrograms = async () => {
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

        getTeamPrograms();
    }, []);

    const addWorkout = (workout: Tables<"workouts">) => {
        const newWorkouts = [workout, ...workouts];
        setWorkouts(newWorkouts);
    }

    const updateWorkout = (updatedWorkout: Tables<"workouts">) => {
        setWorkouts(workouts.map(workout => workout.id === updatedWorkout.id ? updatedWorkout : workout));
    }

    const deleteWorkoutClient = (workoutId: string) => {
        // Delete workout
        // deleteWorkout(programId);

        setWorkouts(workouts => workouts.filter(workout => workout.id !== workoutId));
    }

    return (
        <div className="h-full w-full">
            <div className="flex justify-end">
                <NewLibraryWorkoutButton addWorkout={addWorkout} />
            </div>
            <DataTable
                columns={columns}
                data={workouts}
                setData={setWorkouts}
                libraryType="workout"
                enableOnClick={true}
            />
        </div>
    );
}
export default LibraryWorkouts