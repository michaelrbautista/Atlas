import { getArticle } from "@/server-actions/articles"
import ViewContent from "@/components/tiptap/ViewContent"
import ArticleOptionsButton from "@/components/articles/creator/ArticleOptionsButton"
import { checkIfSubscribed, getCurrentUser } from "@/server-actions/user"
import { Button } from "@/components/ui/button"

const Article = async ({ 
    params
}: {
    params: { id: string }
}) => {
    // Get article
    const article = await getArticle(params.id);

    // Get current user
    const { user, none } = await getCurrentUser();

    // Check if subscribed
    let isSubscribed = false;

    if (user && !none) {
        if (article.created_by?.id == user.id) {
            isSubscribed = true;
        } else if (article.created_by?.id) {
            const checkSubscribed  = await checkIfSubscribed(article.created_by.id);
            if (checkSubscribed) {
                isSubscribed = checkSubscribed
            }
        } else {
            isSubscribed = false;
        }
    }

    return (
        <div className="flex flex-col w-full max-w-lg px-5 pb-20 gap-10 sm:gap-10">
            <div className="flex flex-col items-start pb-5">
                <div className="flex flex-row w-full items-center justify-end py-5">
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