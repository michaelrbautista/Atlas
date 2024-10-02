"use client";

import ProgramList from "@/components/program/ProgramList";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";


const Programs = () => {
    const [programIds, setProgramIds] = useState<string[]>([]);

    const { toast } = useToast();

    useEffect(() => {
        const getTeamPrograms = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "An error occurred.",
                    description: "Couldn't get current user."
                })
                return
            }

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select()
                .eq("id", user.id)
                .single()

            if (userError && !userData) {
                toast({
                    title: "An error occurred.",
                    description: userError.message
                })
                return
            }

            const { data, error } = await supabase
                .from("purchased_programs")
                .select()
                .eq("purchased_by", userData.id)

            if (error && !data) {
                toast({
                    title: "An error occurred.",
                    description: error.message
                })
                return
            }

            setProgramIds(data.map(program => program.program_id));
        }

        getTeamPrograms();
    }, []);

    return (
        <div className="h-full w-full max-w-2xl px-5 py-20 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-2xl sm:text-3xl font-bold">My Programs</p>
            </div>
            <ProgramList isCreator={false} programIds={programIds}></ProgramList>
        </div>
    );
}
 
export default Programs;