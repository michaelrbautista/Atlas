"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Button } from "../../../ui/button";
import { Plus } from "lucide-react";
import NewProgramWorkoutForm from "./NewProgramWorkoutForm";
import ExistingWorkoutList from "./ExistingWorkoutList";
import { Tables } from "../../../../../database.types";

const NewProgramWorkoutButton = ({
    programId,
    week,
    day,
    addWorkout
}: {
    programId: string,
    week: number,
    day: string,
    addWorkout: (workout: Tables<"program_workouts">) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="smallIcon">
                    <Plus className="text-secondaryText"></Plus>
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-systemBackground flex flex-col gap-5 min-w-[800px] min-h-[600px] max-h-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Workout</DialogTitle>
                    <DialogDescription>
                        Week: {week}<br/>
                        Day: {day.charAt(0).toUpperCase() + day.slice(1)}
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="Existing workout" className="w-full flex flex-col items-start gap-5">
                    <TabsList>
                        <TabsTrigger value="Existing workout">Existing workout</TabsTrigger>
                        <TabsTrigger value="New workout">New workout</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Existing workout" className="w-full overflow-scroll">
                        <ExistingWorkoutList
                            programId={programId}
                            week={week}
                            day={day}
                            setIsOpen={setIsOpen}
                            addWorkout={addWorkout}
                        />
                    </TabsContent>
                    <TabsContent value="New workout" className="w-full h-full overflow-scroll">
                        <NewProgramWorkoutForm
                            programId={programId}
                            week={week}
                            day={day}
                            setIsOpen={setIsOpen}
                            addWorkout={addWorkout}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
export default NewProgramWorkoutButton