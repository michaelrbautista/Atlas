"use client"

import { FetchedProgram } from "@/server-actions/fetch-types"
import { ColumnDef, RowData } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dumbbell, MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React, { useState } from "react"
import { Tables } from "../../../../../database.types"
import EditProgramForm from "@/components/creator/program/EditProgramForm"
import Image from "next/image"

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateProgram?: (newProgram: Tables<"programs">) => void;
        deleteProgram?: (programId: string) => void;
    }
}

const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

export const columns: ColumnDef<Tables<"programs">>[] = [
    {
        accessorKey: "image_url",
        header: "Image",
        cell: ({ row }) => {
            const program = row.original

            return (
                (!program.image_url) ? (
                    // Replace with placeholder image
                    <div className="bg-systemGray5 shrink-0 h-[60px] w-[100px] rounded-xl flex items-center justify-center">
                        <Dumbbell className="text-secondaryText" />
                    </div>
                ) : (
                    <Image
                        className="h-[60px] w-[100px] rounded-md"
                        height={60}
                        width={100}
                        src={program.image_url}
                        alt="programImage"
                        style={{objectFit: "cover"}}
                        priority
                    />
                )
            )
        }
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const program = row.original

            return (
                <p>{program.free ? "Free" : formatter.format(program.price)}</p>
            )
        }
    },
    {
        accessorKey: "weeks",
        header: "Weeks",
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
        const program = row.original

        const [dialogType, setDialogType] = useState<"edit" | "delete">("edit");
        const [isOpen, setIsOpen] = useState(false);
 
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
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
        },
    },
]
