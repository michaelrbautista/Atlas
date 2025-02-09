"use client"

import { ColumnDef, RowData } from "@tanstack/react-table"
import React from "react"
import { Button } from "@/components/ui/button";
import { redirectToArticle } from "@/server-actions/articles";
import { FetchedArticle } from "@/server-actions/models";
import ArticleOptionsButton from "@/components/articles/creator/ArticleOptionsButton";


declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
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
        cell: ({ row }) => {
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
        const article = row.original
 
        return (
            <ArticleOptionsButton
                article={article}
                table={table}
            />
        )
        },
    },
]
