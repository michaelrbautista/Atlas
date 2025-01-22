import NewArticleForm from "@/components/articles/NewArticleForm";
import Tiptap from "@/components/tiptap/Tiptap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { JSONContent } from "@tiptap/react";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";

const NewArticle = async ({
    searchParams
} : {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
    const {
        collection = ""
    } = await searchParams

    return (
        <div className="h-full w-full max-w-xl px-5 sm:py-10">
            <Tiptap
                collection={collection}
            />
        </div>
    )
}



export default NewArticle
