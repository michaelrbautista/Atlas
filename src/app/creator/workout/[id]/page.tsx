"use client";

import { Ellipsis, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import { createClient } from "@/utils/supabase/client";
import AddExerciseButton from "@/components/exercise/AddExerciseButton";
import ExerciseList from "@/components/exercise/ExerciseList";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { deleteExercise } from "@/server-actions/exercise";
import EditWorkoutForm from "@/components/workout/EditWorkoutForm";
import EditExerciseForm from "@/components/exercise/EditExerciseForm";
import { useToast } from "@/components/ui/use-toast";

const ViewCreatorWorkout = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [workout, setWorkout] = useState<Tables<"workouts">>();
    const [exercises, setExercises] = useState<Tables<"workout_exercises">[]>([] as Tables<"workout_exercises">[]);
    const [editWorkoutIsOpen, setEditWorkoutIsOpen] = useState(false);
    const [editExerciseIsOpen, setEditExerciseIsOpen] = useState(false);
    const [deleteExerciseIsOpen, setDeleteExerciseIsOpen] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        const getWorkout = async () => {
            setIsLoading(true);

            const supabase = createClient();

            // Get workout
            const { data: workoutData, error: workoutError } = await supabase
                .from("workouts")
                .select()
                .eq("id", params.id)
                .single()
            
            if (workoutError || !workoutData) {
                toast({
                    title: "An error occurred.",
                    description: workoutError.message
                })
                setIsLoading(false);
                return
            }

            setWorkout(workoutData);

            // Get exercises
            const { data: exercises, error: exercisesError } = await supabase
                .from("workout_exercises")
                .select()
                .eq("workout_id", workoutData.id)
                .order("exercise_number", { ascending: true });

            if (exercisesError && !exercises) {
                toast({
                    title: "An error occurred.",
                    description: exercisesError.message
                })
                setIsLoading(false);
                return
            }

            setExercises(exercises);
            setIsLoading(false);
        }

        getWorkout();
    }, []);

    const updateWorkout = (workout: Tables<"workouts">) => {
        setWorkout(workout);
    }

    const addNewExercise = (exercise: Tables<"workout_exercises">) => {
        setExercises(exercises => [...exercises, exercise]);
    }

    const updateExercise = (workoutExercise: Tables<"workout_exercises">, exerciseNumber: number) => {
        const oldExercises = exercises;

        oldExercises[exerciseNumber - 1] = workoutExercise;

        setExercises(oldExercises);
    }

    const deleteExerciseClient = (workoutExerciseId: string, workoutExerciseIndex: number) => {
        deleteExercise(workoutExerciseId);
        setDeleteExerciseIsOpen(false);

        const oldExercises = exercises.splice(workoutExerciseIndex, workoutExerciseIndex);

        setExercises(oldExercises);
    }

    if (isLoading || !workout) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="h-full w-full px-10 py-20 sm:py-10">
                <div className="flex flex-col gap-5 pb-5">
                    <div className="flex gap-5 items-center justify-between">
                        <p className="text-foreground text-2xl sm:text-2xl font-bold">{workout.title}</p>
                        <Sheet open={editWorkoutIsOpen} onOpenChange={setEditWorkoutIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="secondary">
                                    Edit Workout
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Edit Workout</SheetTitle>
                                    <SheetDescription hidden></SheetDescription>
                                </SheetHeader>
                                <EditWorkoutForm workout={workout} setIsOpen={setEditWorkoutIsOpen} updateWorkout={updateWorkout} />
                            </SheetContent>
                        </Sheet>
                    </div>
                    <p className="text-primaryText text-base font-normal">{workout.description}</p>
                </div>
                <Separator />
                <div className="flex justify-between items-center pb-5 pt-5">
                    <p className="text-foreground text-md sm:text-lg font-bold">Exercises</p>
                    <AddExerciseButton addNewExercise={addNewExercise} workoutId={params.id} exerciseNumber={exercises.length + 1} />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Instructions</TableHead>
                            <TableHead>Sets</TableHead>
                            <TableHead>Reps</TableHead>
                            <TableHead />
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {exercises.map((exercise, index) => {
                            return (
                                <TableRow key={exercise.id}>
                                    <TableCell>{exercise.title}</TableCell>
                                    <TableCell>{}</TableCell>
                                    <TableCell>{exercise.sets}</TableCell>
                                    <TableCell>{exercise.reps}</TableCell>
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
                                        <Sheet open={editExerciseIsOpen} onOpenChange={setEditExerciseIsOpen}>
                                            <Dialog open={deleteExerciseIsOpen} onOpenChange={setDeleteExerciseIsOpen}>
                                                <DialogContent className="bg-background max-w-96 sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle hidden></DialogTitle>
                                                        <DialogDescription hidden></DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex flex-col gap-5 pt-5">
                                                        <p className="text-primaryText font-base">Are you sure you want to delete this exercise?
                                                        </p>
                                                        <Button
                                                            variant="destructive"
                                                            size="full"
                                                            onClick={() => {deleteExerciseClient(exercise.id, index)}}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Ellipsis />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem asChild>
                                                            <Button
                                                                className="justify-start"
                                                                variant="ghost"
                                                                size="full"
                                                                onClick={() => {setEditExerciseIsOpen(true)}}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Button
                                                                className="justify-start"
                                                                variant="ghost"
                                                                size="full"
                                                                onClick={() => {setDeleteExerciseIsOpen(true)}}
                                                            >
                                                                <p className="text-systemRed">Delete</p>
                                                            </Button>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </Dialog>
                                            <SheetContent>
                                                <SheetHeader>
                                                    <SheetTitle>Edit Exercise</SheetTitle>
                                                    <SheetDescription hidden></SheetDescription>
                                                </SheetHeader>
                                                <EditExerciseForm workoutExercise={exercise} setIsOpen={setEditExerciseIsOpen} updateExercise={updateExercise} />
                                            </SheetContent>
                                        </Sheet>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        )
    }
}
 
export default ViewCreatorWorkout;