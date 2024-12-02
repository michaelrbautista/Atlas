import { searchUsers } from "@/server-actions/search"
import SearchResultUser from "./SearchResultUser";

const SearchResultsList = async ({
    query
}: {
    query: string
}) => {

    const results = await searchUsers(query);

    return (
        <div className="border-t-[1px]">
            {results?.map((result) => {
                return <SearchResultUser user={result} key={result.id}/>
            })}
        </div>
    )
}
export default SearchResultsList