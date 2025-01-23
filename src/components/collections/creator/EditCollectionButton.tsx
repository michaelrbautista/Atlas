"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tables } from "../../../../database.types";
import EditCollectionForm from "./EditCollectionForm";

const EditCollectionButton = ({
    collection,
    updateCollection
}: {
    collection: Tables<"collections">,
    updateCollection: (collection: Tables<"collections">) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm">Edit collection</Button>
            </DialogTrigger>
            <DialogContent className="bg-background min-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Collection</DialogTitle>
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                <EditCollectionForm
                    collection={collection}
                    setIsOpen={setIsOpen}
                    updateCollection={updateCollection}
                />
            </DialogContent>
        </Dialog>
    );
}
 
export default EditCollectionButton;