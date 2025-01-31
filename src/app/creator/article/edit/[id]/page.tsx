import Tiptap from "@/components/tiptap/Tiptap";
import { getArticleClient } from "@/server-actions/articles";

const EditArticle = async ({ 
    params
}: {
    params: { id: string }
}) => {
    // Get article
    const { data, error } = await getArticleClient(params.id);

    if (error && !data) {
        throw new Error(error);
    }

    return (
        <div className="h-full w-full max-w-xl px-5 sm:py-10">
            <Tiptap
                article={data}
            />
        </div>
    )
}



export default EditArticle