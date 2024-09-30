"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Tables } from "../../../database.types";
import { useState } from "react";
import { Button } from "../ui/button";
import { Ellipsis, Loader2 } from "lucide-react";
import { deleteExercise } from "@/server-actions/exercise";
import EditExerciseForm from "./EditExerciseForm";


const ExerciseOptions = ({
    exercise,
    updateExercise,
    deleteExerciseClient
}: {
    exercise: Tables<"exercises">,
    updateExercise: (exercise: Tables<"exercises">) => void,
    deleteExerciseClient: (exerciseId: string) => void
}) => {
    const [editIsOpen, setEditIsOpen] = useState(false);
    const [deleteIsOpen, setDeleteIsOpen] = useState(false);
    const [deleteIsLoading, setDeleteIsLoading] = useState(false);

    const deleteProgram = (exerciseId: string) => {
        setDeleteIsLoading(true);

        deleteExerciseClient(exerciseId);

        setDeleteIsOpen(false);
        setDeleteIsLoading(false);
    }

    return (
        <Sheet open={editIsOpen} onOpenChange={setEditIsOpen}>
            <Dialog open={deleteIsOpen} onOpenChange={setDeleteIsOpen}>
                <DialogContent className="bg-background max-w-96 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle hidden></DialogTitle>
                        <DialogDescription hidden></DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-5 pt-5">
                        <p className="text-primaryText font-base">Are you sure you want to delete this exercise?
                        </p>
                        <Button
                            variant={deleteIsLoading ? "disabled" : "destructive"}
                            size="full"
                            disabled={deleteIsLoading}
                            onClick={() => {
                                deleteExercise(exercise.id)
                            }}
                        >
                            {deleteIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {deleteIsLoading ? "Deleting Exercise" : "Delete Exercise"}
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
                                onClick={() => {setEditIsOpen(true)}}
                            >
                                Edit
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Button
                                className="justify-start"
                                variant="ghost"
                                size="full"
                                onClick={() => {setDeleteIsOpen(true)}}
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
                {/* Edit Exercise Form */}
                <EditExerciseForm
                    exercise={exercise}
                    updateExercise={updateExercise}
                    setIsOpen={setEditIsOpen}
                />
            </SheetContent>
        </Sheet>
    )
}
export default ExerciseOptions