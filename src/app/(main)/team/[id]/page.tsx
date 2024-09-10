"use client";

import { createClient } from "@/utils/supabase/client";
import { Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import { Separator } from "@/components/ui/separator";
import { redirectToHome } from "@/server-actions/creator";
import Image from "next/image";
import { loadImage } from "@/utils/supabase/hooks/loadImage";
import ProgramList from "@/components/program/ProgramList";

const Team = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [team, setTeam] = useState<Tables<"teams">>();
    const [teamImageUrl, setTeamImageUrl] = useState("");
    const [programIds, setProgramIds] = useState<string[]>([]);

    useEffect(() => {
        const getTeam = async () => {
            const supabase = createClient();

            const { data: teamData, error: teamError } = await supabase
                .from("teams")
                .select()
                .eq("id", params.id)
                .single()

            if (teamError && !teamData) {
                console.log(teamError);
                return
            }

            setTeam(teamData);

            // Get team image
            if (teamData?.image_path) {
                const teamImage = loadImage(teamData?.image_path ?? "", "team_images");
                setTeamImageUrl(teamImage);
            }

            // Get team programs
            const { data: programsData, error: programsError } = await supabase
                .from("programs")
                .select("id")
                .eq("team_id", params.id)

            if (programsError && !programsData) {
                console.log(programsError);
                return
            }

            setProgramIds(programsData.map(program => program.id));

            setIsLoading(false);
        }

        getTeam();
    }, []);

    if (isLoading || !team) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col gap-5 items-center w-full sm:max-w-4xl px-5 pt-20 sm:pt-10">
                <div className="relative w-32 sm:w-48 aspect-square rounded-full overflow-hidden bg-slate-700">
                    {(teamImageUrl == "") ? (
                        // Replace with placeholder image
                        <div className="w-full h-full bg-systemGray5 flex items-center justify-center">
                            <Users className="text-secondaryText" />
                        </div>
                    ) : (
                        <Image
                            fill
                            sizes="(max-width: 430px) 128px, (max-width: 1190px) 192px"
                            src={teamImageUrl}
                            alt="teamImage"
                            style={{objectFit: "cover"}}
                        />
                    )}
                </div>
                <div className="flex flex-col w-full rounded-xl">
                    <p className="text-primaryText text-center text-3xl font-bold sm:px-40">{team?.name}</p>
                    <p className="text-secondaryText text-center text-base font-medium px-0 sm:px-10 lg:px-40">{team?.description}</p>
                </div>
                <Separator></Separator>
                <p className="w-full text-foreground text-2xl font-bold">Programs</p>
                <ProgramList isCreator={false} programIds={programIds} />
            </div>
        )
    }
}
 
export default Team;