"use client";

import ProgramList from "@/components/program/ProgramList";
import CreateProgramButton from "../../../components/program/CreateProgramButton";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirectToHome } from "@/server-actions/creator";

const MyPrograms = () => {
    const [programIds, setProgramIds] = useState<string[]>([]);

    useEffect(() => {
        const getTeamPrograms = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.log("Couldn't get current user.");
                return
            }

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select()
                .eq("id", user.id)
                .single()

            if (userError && !userData) {
                console.log(userError);
                return
            }

            if (!userData.team_id) {
                console.log("User has not created a team yet.");
                redirectToHome();
                return
            }

            const { data, error } = await supabase
                .from("programs")
                .select()
                .eq("team_id", userData.team_id)

            if (data && !error) {
                setProgramIds(data.map(program => program.id));
            } else {
                console.log("Couldnt get team's programs.");
            }
        }

        getTeamPrograms();
    }, []);

    return (
        <div className="h-full w-full sm:max-w-4xl px-5 py-20 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-2xl sm:text-3xl font-bold">My Programs</p>
                <CreateProgramButton></CreateProgramButton>
            </div>
            <ProgramList isCreator={true} programIds={programIds}></ProgramList>
        </div>
    );
}
 
export default MyPrograms;