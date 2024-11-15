"use client";

import { useEffect, useState } from "react";
import { getCreatorsPosts } from "@/server-actions/post";
import CreatorPostItem, { CreatorFetchedPost } from "./CreatorPostItem";
import { Skeleton } from "../ui/skeleton";
import { useInView } from "react-intersection-observer";
import { Tables } from "../../../database.types";

const CreatorPostList = ({
    user
}: {
    user: Tables<"users">
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<CreatorFetchedPost[]>([]);
    const [offset, setOffset] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [ref, inView] = useInView();

    useEffect(() => {
        const getMorePosts = async () => {
            if (isFinished) {
                return
            }

            const newPosts = await getCreatorsPosts(user.id, offset);

            setPosts([...posts, ...newPosts]);

            if (newPosts.length < 10) {
                setIsFinished(true);
            }

            setOffset(offset + 10);

            setIsLoading(false);
        }

        getMorePosts();
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
                {posts?.map((post) => {
                    return <CreatorPostItem post={post} user={user} key={post.id} />
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
 
export default CreatorPostList;