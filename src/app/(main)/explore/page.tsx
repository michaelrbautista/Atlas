import AllUsers from "@/components/explore/AllUsers";
import Search from "@/components/explore/Search";
import SearchResultsList from "@/components/explore/SearchResultsList";

const Home = async ({
    searchParams
}: {
    searchParams?: {
        query?: string
    }
}) => {
    const query = searchParams?.query ?? "";

    return (
        <div className="h-full w-full max-w-xl px-5 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-3xl font-bold">Explore</p>
            </div>
            <Search />
            {query == "" ? (
                <div>
                    <div className="flex justify-between items-center pt-5 pb-2">
                        <p className="text-foreground text-xl font-bold">Users</p>
                    </div>
                    <AllUsers />
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center pt-5 pb-2">
                        <p className="text-foreground text-xl font-bold">Results</p>
                    </div>
                    <SearchResultsList query={query}/>
                </div>
            )}
        </div>
    );
}

export default Home;