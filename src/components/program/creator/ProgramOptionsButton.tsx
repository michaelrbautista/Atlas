"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Loader2, MoreHorizontal } from "lucide-react"
import { Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { memo, useState } from "react";
import { Tables } from "../../../../database.types";
import EditProgramForm from "./EditProgramForm";
import { deleteProgram } from "@/server-actions/program";
import { redirectToLibrary } from "@/server-actions/creator";

const ProgramOptionsButton = ({
    program,
    updateProgram
}: {
    program: Tables<"programs">,
    updateProgram: (updatedProgram: Tables<"programs">) => void
}) => {
    const [dialogType, setDialogType] = useState<"edit" | "delete">("edit");
    const [isOpen, setIsOpen] = useState(false);
    const [deleteIsLoading, setDeleteIsLoading] = useState(false);

    const returnDialogTitle = () => {
        if (dialogType == "edit") {
            return (
                <DialogTitle>Edit Program</DialogTitle>
            )
        } else {
            return (
                <DialogTitle>Delete Program</DialogTitle>
            )
        }
    }

    const deleteProgramClient = () => {
        setDeleteIsLoading(true);
        deleteProgram(program);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <DialogTrigger
                            className="w-full"
                            onClick={() => {
                                setDialogType("edit");
                                setIsOpen(true);
                            }}
                        >
                            Edit program
                        </DialogTrigger>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <DialogTrigger
                            className="w-full"
                            onClick={() => {
                                setDialogType("delete");
                                setIsOpen(true);
                            }}
                        >
                            Delete program
                        </DialogTrigger>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                    {returnDialogTitle()}
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                {dialogType == "edit" ? (
                    <EditProgramForm
                        program={program}
                        updateProgram={updateProgram}
                        setIsOpen={setIsOpen}
                    />
                ) : (
                    <div className="flex flex-col gap-5 pt-5">
                        <p>Are you sure you want to delete this program?</p>
                        <Button
                        variant={deleteIsLoading ? "disabled" : "destructive"}
                        size="full"
                        disabled={deleteIsLoading}
                        onClick={() => {
                            deleteProgramClient();
                            redirectToLibrary();
                        }}
                    >
                        {deleteIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {!deleteIsLoading && "Delete program"}
                    </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
export default memo(ProgramOptionsButton)