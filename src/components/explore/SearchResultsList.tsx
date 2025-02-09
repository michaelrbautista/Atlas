import { searchUsers } from "@/server-actions/search"
import UserItem from "../subscriptions/UserItem";
import { memo } from "react";

const SearchResultsList = async ({
    query
}: {
    query: string
}) => {

    const results = await searchUsers(query);

    return (
        <div className="border-t-[1px]">
            {results?.map((result) => {
                return <UserItem
                    fullName={result.full_name}
                    username={result.username}
                    bio={result.bio ?? undefined}
                    profilePictureUrl={result.profile_picture_url ?? undefined}
                    key={result.username}
                />
            })}
        </div>
    )
}
export default memo(SearchResultsList)