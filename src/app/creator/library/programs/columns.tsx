"use client"

import { ColumnDef, RowData } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Dumbbell } from "lucide-react"
import React from "react"
import { Tables } from "../../../../../database.types"
import Image from "next/image"
import ProgramOptionsDialog from "./ProgramOptionsDialog"
import { redirectToCreatorsProgram } from "@/server-actions/program"

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateProgram?: (newProgram: Tables<"programs">) => void;
        deleteProgram?: (program: Tables<"programs">) => void;
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
                    <div className="bg-systemGray5 shrink-0 h-[60px] w-[60px] rounded-xl flex items-center justify-center">
                        <Dumbbell className="text-secondaryText" />
                    </div>
                ) : (
                    <div className="relative flex items-center w-[60px] h-[60px]">
                        <Image
                            className="rounded-md"
                            fill
                            src={program.image_url}
                            alt="programImage"
                            style={{objectFit: "cover"}}
                            priority
                        />
                    </div>
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
        accessorKey: "tier",
        header: "Tier",
        cell: ({ row }) => {
            const program = row.original

            return (
                <p>{program.free ? "Free" : "Paid"}</p>
            )
        }
    },
    {
        accessorKey: "weeks",
        header: "Weeks",
    },
    {
        id: "view",
        cell: ({ row, table }) => {
            const program = row.original

            return (
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        redirectToCreatorsProgram(program.id);
                    }}
                >
                    View
                </Button>
            )
        }
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
