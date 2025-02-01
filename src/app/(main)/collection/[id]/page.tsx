import ArticleList from "@/components/articles/user/ArticleList";
import { getCollectionServer } from "@/server-actions/collection";


const Collection = async ({ 
    params
}: {
    params: { id: string }
}) => {
    // Get collection
    const collection = await getCollectionServer(params.id);

    return (
        <div className="flex flex-col w-full sm:max-w-lg px-5 py-5 sm:py-10 gap-3 sm:gap-10">
            <div>
                <p className="text-primaryText text-3xl font-bold">{collection?.title}</p>
                <p className="text-secondaryText py-2">{collection?.description}</p>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                    <p className="text-foreground text-xl sm:text-2xl font-bold">Articles</p>
                </div>
                <ArticleList collectionId={params.id} />
            </div>
        </div>
    )
}
export default Collection