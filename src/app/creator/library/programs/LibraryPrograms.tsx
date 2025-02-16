"use client";

import NewProgramButton from "../../../../components/program/creator/NewProgramButton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../../../database.types";
import { useToast } from "@/components/ui/use-toast";
import { useColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

const LibraryPrograms = () => {
    const [programs, setPrograms] = useState<Tables<"programs">[]>([]);
    
    const { toast } = useToast();

    useEffect(() => {
        const getTeamPrograms = async () => {
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
                .from("programs")
                .select()
                .eq("created_by", user.id)
                .order("created_at", { ascending: false })

            if (data && !error) {
                setPrograms(data);
            } else {
                toast({
                    title: "An error occurred.",
                    description: error.message
                })
            }
        }

        getTeamPrograms();
    }, []);

    const columns = useColumns();
    const data = useMemo(() => programs, [programs]);

    return (
        <div className="flex flex-col gap-5 h-full w-full">
            <div className="flex justify-end">
                <NewProgramButton />
            </div>
            <DataTable
                columns={columns}
                data={data}
                setData={setPrograms}
            />
        </div>
    );
}

export default LibraryPrograms