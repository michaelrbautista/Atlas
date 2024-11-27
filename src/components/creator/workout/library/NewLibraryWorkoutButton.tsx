"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Tables } from "../../../../../database.types";
import NewLibraryWorkoutForm from "./NewLibraryWorkoutForm";

const NewLibraryWorkoutButton = ({
    addWorkout
}: {
    addWorkout: (workout: Tables<"workouts">) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="systemBlue">New workout</Button>
            </DialogTrigger>
            <DialogContent className="bg-background min-w-[600px]">
                <DialogHeader>
                    <DialogTitle>New Workout</DialogTitle>
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                <NewLibraryWorkoutForm
                    setIsOpen={setIsOpen}
                    addWorkout={addWorkout}
                />
            </DialogContent>
        </Dialog>
    );
}
 
export default NewLibraryWorkoutButton;