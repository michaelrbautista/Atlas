"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Search = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);

        if (query) {
            params.set("query", query);
        } else {
            params.delete("query");
        }

        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
        }} className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <Input
                type="text"
                name="searchText"
                placeholder="Search..."
                className="w-full rounded-md bg-muted pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                defaultValue={searchParams.get("query")?.toString()}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
            />
        </form>
    )
}
export default Search