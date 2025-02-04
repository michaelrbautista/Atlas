"use client"

import { ColumnDef, RowData } from "@tanstack/react-table"
import React from "react"
import { Tables } from "../../../../database.types"
import CollectionOptionsDialog from "./CollectionOptionsDialog";
import { Button } from "@/components/ui/button";
import { redirectToCreatorsCollection } from "@/server-actions/collection";


declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateCollection?: (newCollection: Tables<"collections">) => void;
        deleteCollection?: (collection: Tables<"collections">) => void;
    }
}

export const columns: ColumnDef<Tables<"collections">>[] = [
    {
        accessorKey: "collection_number",
        header: "#",
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
        id: "view",
        cell: ({ row, table }) => {
            const collection = row.original

            return (
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        redirectToCreatorsCollection(collection.id);
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
        const collection = row.original
 
        return (
            <CollectionOptionsDialog
                collection={collection}
                table={table}
            />
        )
        },
    },
]
