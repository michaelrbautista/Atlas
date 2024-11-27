"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { FetchedExercise } from "@/server-actions/fetch-types";
import EditProgramExerciseForm from "./EditProgramExerciseForm";

const EditExerciseButton = ({
    editExerciseIsOpen,
    setEditExerciseIsOpen,
    deleteExerciseIsOpen,
    setDeleteExerciseIsOpen,
    updateExercise,
    deleteExerciseClient,
    exercise,
    index
}: {
    editExerciseIsOpen: boolean,
    setEditExerciseIsOpen: Dispatch<SetStateAction<boolean>>,
    deleteExerciseIsOpen: boolean,
    setDeleteExerciseIsOpen: Dispatch<SetStateAction<boolean>>,
    updateExercise: (workoutExercise: FetchedExercise, exerciseNumber: number) => void,
    deleteExerciseClient: (workoutExerciseId: string, workoutExerciseIndex: number) => void,
    exercise: FetchedExercise,
    index: number
}) => {
    return (
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
                {exercise.reps}
                <EditProgramExerciseForm
                    programExercise={exercise}
                    // setIsOpen={setEditExerciseIsOpen}
                    // updateExercise={updateExercise}
                />
            </SheetContent>
        </Sheet>
    )
}
export default EditExerciseButton