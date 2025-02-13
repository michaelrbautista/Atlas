"use client"

import { ColumnDef, RowData } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Dumbbell } from "lucide-react"
import React, { useMemo } from "react"
import { Tables } from "../../../../../database.types"
import ProgramOptionsDialog from "./ProgramOptionsDialog"
import { redirectToCreatorsProgram } from "@/server-actions/program"
import BlurImage from "@/components/misc/BlurImage"

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateProgram?: (newProgram: Tables<"programs">) => void;
        deleteProgram?: (program: Tables<"programs">) => void;
    }
}

export const useColumns = () => {
    return useMemo<ColumnDef<Tables<"programs">>[]>(() => [
        {
            accessorKey: "image_url",
            header: "Image",
            cell: ({ row }) => {
                const program = row.original
    
                return (
                    (!program.image_url) ? (
                        // Replace with placeholder image
                        <div className="bg-systemGray5 shrink-0 h-[80px] w-[80px] rounded-xl flex items-center justify-center">
                            <Dumbbell className="text-secondaryText" />
                        </div>
                    ) : (
                        <div className="relative w-[80px] h-[80px] shrink-0">
                            <BlurImage
                                alt="profilePicture"
                                src={program.image_url}
                                contentMode="cover"
                                sizes="80px"
                                className="rounded-md"
                                canSelect={false}
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
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => {
                const program = row.original
    
                return (
                    <p>{!program.free ? program.price : ""}</p>
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
    ], []);
}
