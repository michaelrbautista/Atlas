"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { useState } from "react";
import { Tables } from "../../../../database.types";

let copyUrl: string;

if (process.env.NODE_ENV === "development") {
    copyUrl = "http://localhost:3000"
} else {
    copyUrl = "https://www.useatlas.xyz"
}

const ArticleOptionsButton = ({
    article
}: {
    article: Tables<"articles">
}) => {
    const [dialogType, setDialogType] = useState<"share" | "delete">("share");
    const [isOpen, setIsOpen] = useState(false);

    const returnDialogTitle = () => {
        if (dialogType == "share") {
            return (
                <DialogTitle>Share Article</DialogTitle>
            )
        } else {
            return (
                <DialogTitle>Delete Article</DialogTitle>
            )
        }
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(`${copyUrl}/article/${article.id}`)
                        }}
                    >
                        Copy link to article
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <DialogTrigger
                            className="w-full"
                            onClick={() => {
                                setDialogType("delete");
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
                    {returnDialogTitle()}
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-5 pt-5">
                    <p>Are you sure you want to delete this article?</p>
                    <Button
                        onClick={() => {
                            // Delete program
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