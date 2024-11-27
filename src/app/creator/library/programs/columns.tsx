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
import ProgramOptionsDialog from "./ProgramOptionsDialog"

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

        return (
            <ProgramOptionsDialog
                program={program}
                table={table}
            />
        )
        },
    },
]
