"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "../ui/button";
import { Tables } from "../../../database.types";
import { getUsersWorkouts } from "@/server-actions/workout";

const AddWorkoutToPostButton = ({
    setWorkout
}: {
    setWorkout: Dispatch<SetStateAction<Tables<"workouts"> | null>>
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [workouts, setWorkouts] = useState<Tables<"workouts">[]>([]);

    useEffect(() => {
        const getWorkoutsClient = async () => {
            setIsLoading(true);

            const workouts = await getUsersWorkouts();

            setWorkouts(workouts);
        }

        getWorkoutsClient();
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="secondary" size="full" className="mt-3">Add workout</Button>
            </DialogTrigger>
            <DialogContent className="bg-background pt-12 min-w-[800px]">
                <DialogHeader>
                    <DialogTitle hidden></DialogTitle>
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workouts.map((workout) => {
                            return (
                                <TableRow key={workout.id}>
                                    <TableCell>{workout.title}</TableCell>
                                    <TableCell>{workout.description}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => {setWorkout(workout)}} variant="secondary" size="sm">
                                            Add to post
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
}
export default AddWorkoutToPostButton