"use client"

import BulletList from "@tiptap/extension-bullet-list"
import Heading from "@tiptap/extension-heading"
import ListItem from "@tiptap/extension-list-item"
import Placeholder from "@tiptap/extension-placeholder"
import OrderedList from "@tiptap/extension-ordered-list"
import { useEditor, EditorContent, mergeAttributes, JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { getArticle } from "@/server-actions/articles"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Tables } from "../../../../../database.types"
import ViewContent from "@/components/tiptap/ViewContent"
import { FetchedArticle } from "@/server-actions/models"

const Article = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [article, setArticle] = useState<FetchedArticle | null>(null);
    const [articleContent, setArticleContent] = useState("");

    const { toast } = useToast();

    useEffect(() => {
        const getArticleContent = async () => {
            setIsLoading(true);

            // Get article
            const { data, error } = await getArticle(params.id);

            if (error && !data) {
                toast({
                    title: "An error occurred.",
                    description: error
                })
                return
            }

            setArticle(data!);
            setArticleContent(data!.content);
            setIsLoading(false);
        }

        getArticleContent();
    }, []);

    if (isLoading || !articleContent || !article) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-full max-w-lg px-5 pt-10 pb-20 gap-10 sm:gap-10">
                <div className="flex flex-col items-start pb-5">
                    <p
                        className="text-primaryText text-2xl sm:text-3xl font-bold"
                    >
                        {article.title}
                    </p>
                    <p
                        className="text-secondaryText text-base sm:text-lg"
                    >
                        {article.created_by?.full_name}
                    </p>
                </div>
                <ViewContent content={articleContent} />
            </div>
        )
    }
}
export default Article