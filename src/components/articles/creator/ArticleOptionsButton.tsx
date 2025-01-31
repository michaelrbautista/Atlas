"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React, { useState } from "react"
import { Table } from "@tanstack/react-table"
import { FetchedArticle } from "@/server-actions/models"
import { redirectToEditArticle } from "@/server-actions/articles";
import { useUserContext } from "@/context";
import { cn } from "@/lib/utils";

const ArticleOptionsButton = ({
    article,
    table
}: {
    article: FetchedArticle,
    table?: Table<FetchedArticle>
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const userContext = useUserContext();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        // className="h-8 w-8 p-0"
                        className={cn("h-8 w-8 p-0", userContext.user?.id != article.created_by?.id && "hidden")}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Button
                            className="justify-start h-8 cursor-pointer"
                            variant="ghost"
                            size="full"
                            onClick={() => {
                                // Redirect to edit article page
                                redirectToEditArticle(article.id);
                            }}
                        >
                            Edit article
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <DialogTrigger
                            className="w-full cursor-pointer"
                            onClick={() => {
                                setIsOpen(true);
                            }}
                        >
                            Delete article
                        </DialogTrigger>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Delete Article</DialogTitle>
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-5 pt-5">
                    <p>Are you sure you want to delete this article?</p>
                    <Button
                        onClick={() => {
                            if (table) {
                                // Delete from table
                                table.options.meta?.deleteArticle!(article);
                            } else {
                                // Delete from article detail view
                                
                            }
                            
                            setIsOpen(false);
                        }}
                        variant="destructive"
                    >
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default ArticleOptionsButton