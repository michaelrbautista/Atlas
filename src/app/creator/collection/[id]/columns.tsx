"use client"

import { ColumnDef, RowData } from "@tanstack/react-table"
import React from "react"
import { Tables } from "../../../../../database.types";
import { Button } from "@/components/ui/button";
import { redirectToCreatorsCollection } from "@/server-actions/collection";
import { redirectToArticle } from "@/server-actions/articles";
import { FetchedArticle } from "@/server-actions/models";


declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateArticle?: (newArticle: FetchedArticle) => void;
        deleteArticle?: (article: FetchedArticle) => void;
    }
}

export const columns: ColumnDef<FetchedArticle>[] = [
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
            const article = row.original

            return (
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        // Redirect to article
                        redirectToArticle(article.id);
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
            <Button>Options</Button>
            // <CollectionOptionsDialog
            //     collection={collection}
            //     table={table}
            // />
        )
        },
    },
]
