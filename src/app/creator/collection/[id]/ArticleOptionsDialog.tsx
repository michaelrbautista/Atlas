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

const ArticleOptionsDialog = ({
    article,
    table
}: {
    article: FetchedArticle,
    table: Table<FetchedArticle>
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
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
                            table.options.meta?.deleteArticle!(article);
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
export default ArticleOptionsDialog