import { getArticle } from "@/server-actions/articles"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import ViewContent from "@/components/tiptap/ViewContent"
import { FetchedArticle } from "@/server-actions/models"
import ArticleOptionsButton from "@/components/articles/creator/ArticleOptionsButton"
import { useUserContext } from "@/context"
import { checkIfSubscribed, getUser } from "@/server-actions/user"
import { Button } from "@/components/ui/button"

const Article = async ({ 
    params
}: {
    params: { id: string }
}) => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [article, setArticle] = useState<FetchedArticle | null>(null);
    // const [articleContent, setArticleContent] = useState("");

    // const { toast } = useToast();

    // const userContext = useUserContext();

    // useEffect(() => {
    //     const getArticleContent = async () => {
    //         setIsLoading(true);

    //         // Get article
    //         const { data, error } = await getArticle(params.id);

    //         if (error && !data) {
    //             toast({
    //                 title: "An error occurred.",
    //                 description: error
    //             })
    //             return
    //         }

    //         setArticle(data!);
    //         setArticleContent(data!.content);
    //         setIsLoading(false);
    //     }

    //     getArticleContent();
    // }, []);

    // Get article
    const article = await getArticle(params.id);

    // Check if subscribed
    let isSubscribed;

    if (article.created_by?.id) {
        isSubscribed = await checkIfSubscribed(article.created_by.id);
    } else {
        isSubscribed = false;
    }

    return (
        <div className="flex flex-col w-full max-w-lg px-5 pt-10 pb-20 gap-10 sm:gap-10">
            <div className="flex flex-col items-start pb-5">
                <div className="flex flex-row w-full h-16 items-center justify-end py-5">
                    <ArticleOptionsButton
                        article={article}
                    />
                </div>
                <p className="text-primaryText text-2xl sm:text-3xl font-bold">
                    {article.title}
                </p>
                <p className="text-secondaryText text-base sm:text-lg">
                    {article.created_by?.full_name}
                </p>
            </div>
            {isSubscribed || article.free ? (
                <ViewContent content={article.content} />
            ) : (
                <Button
                    variant="disabled"
                >
                    Subscribers only
                </Button>
            )}
        </div>
    )
}
export default Article