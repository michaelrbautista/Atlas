"use client";

import Image from "next/image";
import Link from "next/link";
import { Dumbbell, Lock } from "lucide-react";
import { useUserContext } from "@/context";
import { FetchedArticle } from "@/server-actions/models";

const ArticleItem = ({
    article
}: {
    article: FetchedArticle
}) => {
    const {
        subscriptions
    } = useUserContext();

    return (
        <Link href={`/article/${article.id}`} className="flex flex-row gap-5 py-5 border-b-[1px]">
            {article.image_url ? (
                <div className="relative flex items-center w-[120px] h-[120px] shrink-0">
                    <Image
                        className="rounded-xl shrink-0"
                        fill
                        src={article.image_url}
                        alt="articleImage"
                        style={{objectFit: "cover"}}
                        priority
                    />
                </div>
            ) : (
                <div className="bg-systemGray5 shrink-0 h-[120px] w-[120px] rounded-xl flex items-center justify-center">
                    <Dumbbell className="text-secondaryText" />
                </div>
            )}
            <div className="flex flex-col w-full justify-between">
                <div className="flex flex-col w-full justify-start">
                    <h1 className="text-primaryText font-bold text-md line-clamp-1">{article.title}</h1>
                    <h1 className="text-secondaryText font-bold text-sm">{article.created_by?.full_name}</h1>
                    {/* <h1 className="text-secondaryText font-medium text-sm pt-2 line-clamp-2">{article.description}</h1> */}
                </div>
                {!article.free && (
                    <div className="flex flex-row gap-1 items-center">
                        <Lock color="gray" size={16} />
                        <p className="text-secondaryText text-sm">Subscribers only</p>
                    </div>
                )}
            </div>
        </Link>
    )
};

export default ArticleItem;