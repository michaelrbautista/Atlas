import { Users } from "lucide-react"
import { Tables } from "../../../database.types"
import Image from "next/image"
import Link from "next/link"
import LoadImage from "../misc/BlurImage"


const UserItem = ({
    fullName,
    username,
    bio,
    profilePictureUrl
}: {
    fullName: string,
    username: string,
    bio?: string,
    profilePictureUrl?: string
}) => {
    return (
        <Link href={{
            pathname: `/${username}`
        }} className="flex flex-row gap-5 p-5 border-b-[1px]">
            {(!profilePictureUrl) ? (
                // Replace with placeholder image
                <div className="bg-systemGray5 shrink-0 h-12 w-12 rounded-full flex items-center justify-center">
                    <Users className="text-secondaryText" />
                </div>
            ) : (
                <div className="relative flex items-center w-[50px] h-[50px] shrink-0">
                    <LoadImage
                        alt="userProfilePicture"
                        src={profilePictureUrl}
                        contentMode="cover"
                        sizes="100px"
                        className="rounded-full"
                        canSelect={true}
                    />
                </div>
            )}
            <div className="flex flex-col w-full">
                <p className="text-primaryText text-lg font-bold">{fullName}</p>
                <p className="text-secondaryText text-sm">@{username}</p>
                <p className="text-secondaryText pt-3 text-sm line-clamp-2">{bio}</p>
            </div>
        </Link>
    )
}
export default UserItem