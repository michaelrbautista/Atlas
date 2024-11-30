import { Table } from "@tanstack/react-table"
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
import React, { useState } from "react"
import { Tables } from "../../../../../database.types"
import EditProgramForm from "@/components/creator/program/EditProgramForm"

const ProgramOptionsDialog = ({
    program,
    table
}: {
    program: Tables<"programs">,
    table: Table<Tables<"programs">>
}) => {
    const [dialogType, setDialogType] = useState<"edit" | "delete">("edit");
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <DialogTrigger
                            className="w-full"
                            onClick={() => {
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
                    {dialogType == "edit" ? (
                        <DialogTitle>Edit Program</DialogTitle>
                    ) : (
                        <DialogTitle>Delete Program</DialogTitle>
                    )}
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                {dialogType == "edit" ? (
                    <EditProgramForm
                        program={program}
                        updateProgram={table.options.meta?.updateProgram!}
                        setIsOpen={setIsOpen}
                    />
                ) : (
                    <div className="flex flex-col gap-5 pt-5">
                        <p>Are you sure you want to delete this program?</p>
                        <Button
                            onClick={() => {
                                table.options.meta?.deleteProgram!(program.id);
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
export default ProgramOptionsDialog