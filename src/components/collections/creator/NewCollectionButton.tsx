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
import NewCollectionForm from "./NewCollectionForm";

const NewCollectionButton = ({
    collectionNumber,
    addCollection
}: {
    collectionNumber: number,
    addCollection: (collection: Tables<"collections">) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="systemBlue" size="sm">New collection</Button>
            </DialogTrigger>
            <DialogContent className="bg-background min-w-[600px]">
                <DialogHeader>
                    <DialogTitle>New Collection</DialogTitle>
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                <NewCollectionForm
                    setIsOpen={setIsOpen}
                    collectionNumber={collectionNumber}
                    addCollection={addCollection}
                />
            </DialogContent>
        </Dialog>
    );
}
 
export default NewCollectionButton;