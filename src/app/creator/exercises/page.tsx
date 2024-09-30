"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirectToHome } from "@/server-actions/creator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Tables } from "../../../../database.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { deleteExercise } from "@/server-actions/exercise";
import CreateExerciseButton from "@/components/exercise/CreateExerciseButton";
import ExerciseOptions from "@/components/exercise/ExerciseOptions";

const MyExercises = () => {
    const [exercises, setExercises] = useState<Tables<"exercises">[]>([]);
    const [viewVideoIsOpen, setViewVideoIsOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const getExercises = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "An error occurred.",
                    description: "Couldn't get the current user."
                })
                return
            }

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select()
                .eq("id", user.id)
                .single()

            if (userError && !userData) {
                toast({
                    title: "An error occurred.",
                    description: userError.message
                })
                return
            }

            if (!userData.team_id) {
                toast({
                    title: "An error occurred.",
                    description: "The user has not created a team yet."
                })
                redirectToHome();
                return
            }

            const { data, error } = await supabase
                .from("exercises")
                .select()
                .eq("created_by", userData.id)
                .order("created_at", { ascending: false })

            if (data && !error) {
                setExercises(data);
            } else {
                toast({
                    title: "An error occurred.",
                    description: error.message
                })
                return
            }
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

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    return (
        <div className="h-full w-full px-5 py-20 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-2xl sm:text-2xl font-bold">My Exercises</p>
                <CreateExerciseButton buttonSize="default" exerciseCreated={addExercise} />
            </div>
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
                                        <Dialog open={viewVideoIsOpen} onOpenChange={setViewVideoIsOpen}>
                                            <Button onClick={() => {setViewVideoIsOpen(true)}} variant="secondary">
                                                View Video
                                            </Button>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle hidden></DialogTitle>
                                                    <DialogDescription hidden></DialogDescription>
                                                </DialogHeader>
                                                <div className="object-fill h-full flex items-center justify-center">
                                                    <video controls className="rounded-lg">
                                                        <source src={exercise.video_url} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
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
 
export default MyExercises;