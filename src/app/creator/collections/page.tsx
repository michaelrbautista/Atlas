"use client";

import { useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import NewCollectionButton from "@/components/collections/creator/NewCollectionButton";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

const Collections = () => {
    const [collections, setCollections] = useState<Tables<"collections">[]>([])

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
                .order("created_at", { ascending: false })

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

    const addCollection = (collection: Tables<"collections">) => {
        const newCollections = [...collections, collection];
        setCollections(newCollections);
    }

    return (
        <div className="h-full w-full px-5 py-20 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-2xl sm:text-2xl font-bold">Collections</p>
                <NewCollectionButton addCollection={addCollection} />
            </div>
            <DataTable
                columns={columns}
                data={collections}
                setData={setCollections}
            />
        </div>
    )
}
export default Collections