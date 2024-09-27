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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Team = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [team, setTeam] = useState<Tables<"teams">>();
    const [teamImageUrl, setTeamImageUrl] = useState("");
    const [programIds, setProgramIds] = useState<string[]>([]);

    const { toast } = useToast();

    useEffect(() => {
        const getTeam = async () => {
            const supabase = createClient();

            const { data: teamData, error: teamError } = await supabase
                .from("teams")
                .select()
                .eq("id", params.id)
                .single()

            if (teamError && !teamData) {
                toast({
                    title: "An error occurred.",
                    description: teamError.message
                })
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
                toast({
                    title: "An error occurred.",
                    description: programsError.message
                })
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
            <div className="flex flex-col w-full sm:max-w-5xl px-5 py-10 gap-10 sm:gap-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 w-full">
                    {(teamImageUrl == "") ? (
                        // Replace with placeholder image
                        <div className="bg-systemGray5 shrink-0 h-[200px] w-[200px] rounded-full flex items-center justify-center">
                            <Users className="text-secondaryText" />
                        </div>
                    ) : (
                        <Image
                            className="h-[200px] w-[200px] rounded-full"
                            height={200}
                            width={200}
                            src={teamImageUrl}
                            alt="programImage"
                            style={{objectFit: "cover"}}
                            priority
                        />
                    )}
                    <div className="flex flex-col w-full">
                        <p className="text-primaryText text-2xl font-bold">{team.name}</p>
                        <p className="text-secondaryText text-base">{team.description}</p>
                    </div>
                </div>
                <Button variant="secondary" size="full">Custom Program</Button>
                {/* <div className="flex flex-col lg:flex-row gap-3">
                    <Button variant="systemBlue" size="full">Join Team</Button>
                    <Button variant="secondary" size="full">Custom Program</Button>
                </div> */}
                <Separator />
                <p className="w-full text-foreground text-2xl font-bold">Programs</p>
                <ProgramList isCreator={false} programIds={programIds} />
            </div>
        )
    }
}
 
export default Team;