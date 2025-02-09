"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { FetchedArticle, FetchedCollection } from "@/server-actions/models";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { getCollection } from "@/server-actions/collection";
import NewArticleButton from "@/components/articles/creator/NewArticleButton";
import EditCollectionButton from "@/components/collections/creator/EditCollectionButton";

const CreatorCollection = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [collection, setCollection] = useState<FetchedCollection | null>(null);
    const [editCollection, setEditCollection] = useState<Tables<"collections"> | null>(null);
    const [articles, setArticles] = useState<FetchedArticle[]>([]);

    const { toast } = useToast();

    useEffect(() => {
        const getCollectionData = async () => {
            setIsLoading(true);

            // Get collection
            const { data, error } = await getCollection(params.id);

            if (error && !data) {
                toast({
                    title: "An error occurred.",
                    description: error
                })
                return
            }

            const { articles, ...editCollection } = data!

            setCollection(data!);
            setEditCollection(editCollection)
            setArticles(data!.articles)
            setIsLoading(false);
        }

        getCollectionData();
    }, []);

    const updateCollection = useCallback((updatedCollection: Tables<"collections">) => {
        setCollection({
            ...collection!,
            title: updatedCollection.title,
            description: updatedCollection.description
        })
    }, []);

    if (isLoading || !collection) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="h-full w-full px-10 py-20 sm:py-10">
                <div className="flex flex-col gap-5 pb-5">
                    <div className="flex gap-5 items-center justify-between">
                        <p className="text-foreground text-2xl sm:text-2xl font-bold">{collection.title}</p>
                        <EditCollectionButton
                            collection={editCollection!}
                            updateCollection={updateCollection}
                        />
                    </div>
                    <p className="text-primaryText text-base font-normal">{collection.description}</p>
                </div>
                <Separator />
                <div className="flex flex-col">
                    <div className="flex justify-between items-center pb-5 pt-5">
                        <p className="text-foreground text-md sm:text-lg font-bold">Articles</p>
                        <div className="flex flex-row gap-5">
                            <NewArticleButton collectionId={collection.id} />
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={articles}
                        setData={setArticles}
                    />
                </div>
            </div>
        )
    }
}
 
export default CreatorCollection;