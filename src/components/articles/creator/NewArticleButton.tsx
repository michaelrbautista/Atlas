"use client";

import { Button } from "@/components/ui/button";

import { redirectToNewArticle } from "@/server-actions/articles";

const NewArticleButton = ({
    collectionId
}: {
    collectionId: string
}) => {
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