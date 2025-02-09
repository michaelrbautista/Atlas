"use client";

import { useCallback, useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import NewCollectionButton from "@/components/collections/creator/NewCollectionButton";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { ReorderDataTable } from "./data-table";
import { reorderColumns } from "./reorderColumns";

const Collections = () => {
    const [collections, setCollections] = useState<Tables<"collections">[]>([])
    const [isReordering, setIsReordering] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        const getCreatorsPrograms = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "An error occurred.",
                    description: "Couldn't get the current user."
                })
                return
            }

            const { data, error } = await supabase
                .from("collections")
                .select()
                .eq("created_by", user.id)
                .order("collection_number", { ascending: true })

            if (data && !error) {
                setCollections(data);
            } else {
                toast({
                    title: "An error occurred.",
                    description: error.message
                })
            }
        }

        getCreatorsPrograms();
    }, []);

    const addCollection = useCallback((collection: Tables<"collections">) => {
        const newCollections = [...collections, collection];
        setCollections(newCollections);
    }, []);

    return (
        <div className="h-full w-full px-5 py-20 sm:py-10">
            {!isReordering ? (
                <div className="flex flex-col">
                    <div className="flex justify-between items-center pb-5">
                        <p className="text-foreground text-2xl sm:text-2xl font-bold">Collections</p>
                        <div className="flex flex-row gap-5">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setIsReordering(true);
                                }}
                            >
                                Reorder
                            </Button>
                            <NewCollectionButton
                                collectionNumber={collections.length + 1}
                                addCollection={addCollection}
                            />
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={collections}
                        setData={setCollections}
                    />
                </div>
            ): (
                <ReorderDataTable
                    columns={reorderColumns}
                    data={collections}
                    setData={setCollections}
                    isReordering={isReordering}
                    setIsReordering={setIsReordering}
                />
            )}
        </div>
    )
}
export default Collections