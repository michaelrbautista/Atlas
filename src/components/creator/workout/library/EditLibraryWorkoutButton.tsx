"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../../../ui/button";
import EditLibraryWorkoutForm from "./EditLibraryWorkoutForm";
import { FetchedWorkout } from "@/server-actions/fetch-types";

const EditLibraryWorkoutButton = ({
    workout,
    updateWorkout
}: {
    workout: FetchedWorkout,
    updateWorkout: (workout: FetchedWorkout) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    Edit workout
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-systemBackground flex flex-col gap-5 min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Edit Workout</DialogTitle>
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                <EditLibraryWorkoutForm
                    workout={workout}
                    setIsOpen={setIsOpen}
                    updateWorkout={updateWorkout}
                />
            </DialogContent>
        </Dialog>
    )
}
export default EditLibraryWorkoutButton