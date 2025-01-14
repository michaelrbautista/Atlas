"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { useState } from "react";
import { Tables } from "../../../../database.types";
import EditProgramForm from "./EditProgramForm";

let copyUrl: string;

if (process.env.NODE_ENV === "development") {
    copyUrl = "http://localhost:3000"
} else {
    copyUrl = "https://www.useatlas.xyz"
}

const ProgramOptionsButton = ({
    program,
    updateProgram
}: {
    program: Tables<"programs">,
    updateProgram: (updatedProgram: Tables<"programs">) => void
}) => {
    const [dialogType, setDialogType] = useState<"share" | "edit" | "delete">("share");
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(`${copyUrl}/program/${program.id}`)
                        }}
                    >
                        Copy link to program
                    </DropdownMenuItem>
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
                    {dialogType == "share" ? (
                        <DialogTitle>Share Program</DialogTitle>
                    ) : dialogType == "edit" ? (
                        <DialogTitle>Edit Program</DialogTitle>
                    ) : (
                        <DialogTitle>Delete Program</DialogTitle>
                    )}
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
                            onClick={() => {
                                // Delete program
                                setIsOpen(false);
                            }}
                            variant="destructive"
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
export default ProgramOptionsButton