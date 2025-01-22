"use client";

import { Users } from "lucide-react"
import { Tables } from "../../../database.types"
import Image from "next/image"
import Link from "next/link"
import BlurImage from "../misc/BlurImage";

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
                <div className="relative flex items-center w-[50px] h-[50px] shrink-0">
                    <BlurImage
                        alt="userProfilePicture"
                        src={user.profile_picture_url}
                        contentMode="cover"
                        sizes="100px"
                        className="rounded-full"
                        canSelect={true}
                    />
                </div>
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