"use client"
import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { Menu } from "lucide-react"
import { Tables } from "../../../../database.types"

export const reorderColumns: ColumnDef<Tables<"collections">>[] = [
    {
        header: "Reorder",
        cell: () => {
            return (
                <Menu size={20}/>
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
]
