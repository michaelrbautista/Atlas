"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "../../ui/skeleton";
import { useInView } from "react-intersection-observer";
import { getCollectionsArticles } from "@/server-actions/articles";
import { useToast } from "@/components/ui/use-toast";
import ArticleItem from "./ArticleItem";
import { FetchedArticle } from "@/server-actions/models";

const ArticleList = ({
    collectionId
}: {
    collectionId: string
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [articles, setArticles] = useState<FetchedArticle[]>([]);
    const [offset, setOffset] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [ref, inView] = useInView();

    const { toast } = useToast();

    useEffect(() => {
        const getMoreArticles = async () => {
            if (isFinished) {
                return
            }

            const { data: newArticles, error } = await getCollectionsArticles(collectionId, offset);

            if (error && !newArticles) {
                toast({
                    title: "An error occurred.",
                    description: error
                })
                return
            }

            setArticles([...articles, ...newArticles!]);

            if (newArticles!.length < 10) {
                setIsFinished(true);
            }

            setOffset(offset + 10);

            setIsLoading(false);
        }

        getMoreArticles();
    }, [inView]);

    if (isLoading) {
        return (
            <div className="relative w-full gap-5 border-t-[1px]">
                {Array.from(Array(10), (e, i) => {
                    return (
                        <div className="flex flex-row gap-5 p-5 border-b-[1px]" key={i}>
                            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                            <div className="flex flex-col gap-2 w-full">
                                <Skeleton className="h-7 w-32"/>
                                <Skeleton className="h-6 w-full"/>
                                <Skeleton className="h-6 w-full"/>
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    } else {
        return (
            <div className="relative w-full gap-5 border-t-[1px]">
                {articles?.map((article) => {
                    return (
                        <ArticleItem key={article.id} article={article} />
                    )
                })}
                <div className="relative w-full gap-5 border-t-[1px]">
                    {!isFinished && (
                        <div ref={ref}>
                            {Array.from(Array(5), (e, i) => {
                                return (
                                    <div className="flex flex-row gap-5 p-5 border-b-[1px]" key={i}>
                                        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                                        <div className="flex flex-col gap-2 w-full">
                                            <Skeleton className="h-7 w-32"/>
                                            <Skeleton className="h-6 w-full"/>
                                            <Skeleton className="h-6 w-full"/>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
export default ArticleList