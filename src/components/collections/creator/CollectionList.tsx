"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "../../ui/skeleton";
import { useInView } from "react-intersection-observer";
import { Tables } from "../../../../database.types";
import { FetchedCollection } from "@/server-actions/models";
import CollectionItem from "./CollectionItem";
import { getCreatorsCollections } from "@/server-actions/collection";
import { ChevronRight } from "lucide-react";

const CollectionList = ({
    user
}: {
    user: Tables<"users">
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [collections, setCollections] = useState<FetchedCollection[]>([]);
    const [offset, setOffset] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [ref, inView] = useInView();

    useEffect(() => {
        const getMoreCollections = async () => {
            if (isFinished) {
                return
            }

            const newCollections = await getCreatorsCollections(user.id, offset);

            setCollections([...collections, ...newCollections]);

            if (newCollections.length < 10) {
                setIsFinished(true);
            }

            setOffset(offset + 10);

            setIsLoading(false);
        }

        getMoreCollections();
    }, [inView]);

    if (isLoading) {
        return (
            <div className="relative w-full gap-5 border-t-[1px]">
                {Array.from(Array(10), (e, i) => {
                    return (
                        <div className="flex flex-row gap-5 py-5 border-b-[1px]" key={i}>
                            <div className="flex flex-row items-center w-full justify-between">
                                <div className="flex flex-col w-full justify-start">
                                    <Skeleton className="h-7 w-32"/>
                                    <Skeleton className="h-6 w-full"/>
                                </div>
                                <ChevronRight />
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    } else {
        return (
            <div className="relative w-full gap-5 border-t-[1px]">
                {collections?.map((collection) => {
                    return (
                        <CollectionItem key={collection.id} collection={collection} />
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
 
export default CollectionList;