"use client";

import { Users } from "lucide-react"
import { Tables } from "../../../database.types"
import Image from "next/image"
import Link from "next/link"

const SearchResultUser = ({
    user
}: {
    user: Tables<"users">
}) => {
    return (
        <Link href={{
            pathname: `/${user.username}`
        }} className="flex flex-row gap-5 p-5 border-b-[1px]">
            {(!user.profile_picture_url) ? (
                // Replace with placeholder image
                <div className="bg-systemGray5 shrink-0 h-12 w-12 rounded-full flex items-center justify-center">
                    <Users className="text-secondaryText" />
                </div>
            ) : (
                <Image
                    className="h-12 w-12 rounded-full"
                    height={48}
                    width={48}
                    src={user.profile_picture_url}
                    alt="profilePicture"
                    style={{objectFit: "cover"}}
                    priority
                />
            )}
            <div className="flex flex-col w-full">
                <p className="text-primaryText text-lg font-bold">{user.full_name}</p>
                <p className="text-secondaryText text-sm">@{user.username}</p>
                <p className="text-secondaryText text-sm line-clamp-2">{user.bio}</p>
            </div>
        </Link>
    )
}
export default SearchResultUser