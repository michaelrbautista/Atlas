import { useUserContext } from "@/context";
import { FetchedCollection } from "@/server-actions/models";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const CollectionItem = ({
    collection
}: {
    collection: FetchedCollection
}) => {
    const {
        subscriptions
    } = useUserContext();

    return (
        <Link href={`/collection/${collection.id}`} className="flex flex-row gap-5 py-5 border-b-[1px]">
            <div className="flex flex-row items-center w-full justify-between">
                <div className="flex flex-col w-full justify-start">
                    <h1 className="text-primaryText font-bold text-md line-clamp-2">{collection.title}</h1>
                    <h1 className="text-secondaryText font-medium text-sm line-clamp-3">{collection.description}</h1>
                </div>
                <ChevronRight />
            </div>
        </Link>
    )
}
export default CollectionItem