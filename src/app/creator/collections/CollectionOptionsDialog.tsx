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
import { Tables } from "../../../../database.types"
import { Table } from "@tanstack/react-table"
import EditCollectionForm from "@/components/collections/creator/EditCollectionForm"

const CollectionOptionsDialog = ({
    collection,
    table
}: {
    collection: Tables<"collections">,
    table: Table<Tables<"collections">>
}) => {
    const [dialogType, setDialogType] = useState<"edit" | "delete">("edit");
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
                                setDialogType("edit");
                                setIsOpen(true);
                            }}
                        >
                            Edit collection
                        </DialogTrigger>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <DialogTrigger
                            className="w-full"
                            onClick={() => {
                                setDialogType("delete");
                                setIsOpen(true);
                            }}
                        >
                            Delete collection
                        </DialogTrigger>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                    {dialogType == "edit" ? (
                        <DialogTitle>Edit Collection</DialogTitle>
                    ) : (
                        <DialogTitle>Delete Collection</DialogTitle>
                    )}
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                {dialogType == "edit" ? (
                    <EditCollectionForm
                        collection={collection}
                        setIsOpen={setIsOpen}
                        updateCollection={table.options.meta?.updateCollection!}
                    />
                ) : (
                    <div className="flex flex-col gap-5 pt-5">
                        <p>Are you sure you want to delete this collection?</p>
                        <Button
                            onClick={() => {
                                table.options.meta?.deleteCollection!(collection);
                                setIsOpen(false);
                            }}
                            variant="destructive"
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
export default CollectionOptionsDialog