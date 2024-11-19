"use client";

import CreateProgramButton from "../program/Buttons/CreateProgramButton";
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
import { Tables } from "../../../database.types";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { deleteProgram } from "@/server-actions/program";
import ProgramOptions from "@/components/program/ProgramOptions";
import { useToast } from "@/components/ui/use-toast";

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
            {/* <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-2xl sm:text-2xl font-bold">My Programs</p>
                <CreateProgramButton addProgram={addProgram}></CreateProgramButton>
            </div> */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead />
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {workouts.map((workout, index) => {
                        return (
                            <TableRow key={workout.id}>
                                <TableCell>{workout.title}</TableCell>
                                <TableCell>{workout.description}</TableCell>
                                <TableCell>
                                    <Button variant="secondary" size="sm" asChild>
                                        <Link
                                            href={`/creator/workout/${workout.id}`}
                                            className="cursor-pointer"
                                        >
                                            View
                                        </Link>
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    {/* Workout Options (edit, delete) */}
                                    {/* <ProgramOptions
                                        program={program}
                                        updateProgram={updateProgram}
                                        deleteProgramClient={deleteProgramClient}
                                    /> */}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
export default LibraryWorkouts