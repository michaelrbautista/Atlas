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
import { redirectToNewArticle } from "@/server-actions/articles";

const NewArticleButton = ({
    collectionId
}: {
    collectionId: string
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Button
            variant="systemBlue"
            size="sm"
            onClick={() => {
                redirectToNewArticle(collectionId);
            }}
        >
            New article
        </Button>
    );
}
 
export default NewArticleButton;