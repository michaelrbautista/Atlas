import Search from "@/components/explore/Search";
import SearchResultsList from "@/components/explore/SearchResultsList";

const Home = async ({
    searchParams
}: {
    searchParams?: {
        query?: string
    }
}) => {
    const query = searchParams?.query || "";

    return (
        <div className="h-full w-full max-w-xl px-5 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-3xl font-bold">Explore</p>
            </div>
            <Search />
            <SearchResultsList query={query}/>
        </div>
    );
}

export default Home;