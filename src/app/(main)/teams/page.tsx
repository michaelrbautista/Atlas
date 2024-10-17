"use client";

import TeamList from "@/components/team/TeamList";
import { getAllTeams } from "@/server-actions/team";
import { useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Teams = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [teams, setTeams] = useState<Tables<"teams">[]>([]);

    const { toast } = useToast();

    useEffect(() => {
        const getTeamsClient = async () => {
            setIsLoading(true);

            const { data, error } = await getAllTeams();

            if (error && !data) {
                toast({
                    title: "An error occurred.",
                    description: error
                })
                return
            }

            setTeams(data!);
            setIsLoading(false);
        }

        getTeamsClient();
    }, []);

    if (isLoading || !teams) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="h-full w-full max-w-2xl px-5 sm:py-10">
                <div className="flex justify-between items-center pb-2">
                    <p className="text-foreground text-3xl font-bold">Home</p>
                </div>
                <TeamList teams={teams}/>
            </div>
        );
    }
}

export default Teams