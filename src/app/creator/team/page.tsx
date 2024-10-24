"use client";

import { createClient } from "@/utils/supabase/client";
import { Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import { Separator } from "@/components/ui/separator";
import { redirectToHome } from "@/server-actions/creator";
import Image from "next/image";
import { loadImage } from "@/utils/supabase/hooks/loadImage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import EditTeamButton from "@/components/team/Buttons/EditTeamButton";
import { copyTeamUrl } from "@/server-actions/team";

const TeamPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [copyButtonText, setCopyButtonText] = useState("Copy Link to Team");
    const [team, setTeam] = useState<Tables<"teams">>();
    const [teamImageUrl, setTeamImageUrl] = useState("");

    const { toast } = useToast();

    useEffect(() => {
        const getTeam = async () => {
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

            if (!userData.team_id) {
                toast({
                    title: "An error occurred.",
                    description: "User has not created a team yet.."
                })
                redirectToHome();
                return
            }

            const { data: teamData, error: teamError } = await supabase
                .from("teams")
                .select()
                .eq("id", userData.team_id)
                .single()

            if (teamError && !teamData) {
                toast({
                    title: "An error occurred.",
                    description: teamError.message
                })
                return
            }

            // Get team image
            if (teamData?.image_path) {
                const teamImage = loadImage(teamData?.image_path ?? "", "team_images");
                setTeamImageUrl(teamImage);
            }

            setTeam(teamData);

            setIsLoading(false);
        }

        getTeam();
    }, []);

    const updateTeam = (updatedTeam: Tables<"teams">) => {
        setTeam(updatedTeam);
    }

    const copyTeamLink = async () => {
        const link = await copyTeamUrl(team!.id);

        navigator.clipboard.writeText(link);

        setCopyButtonText("Team Link Copied");

        setTimeout(() => {
            setCopyButtonText("Copy Link to Team");
        }, 2000);
    }

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
                        <div className="bg-systemGray5 shrink-0 h-[150px] w-[150px] rounded-full flex items-center justify-center">
                            <Users className="text-secondaryText" />
                        </div>
                    ) : (
                        <Image
                            className="h-[150px] w-[150px] rounded-full"
                            height={150}
                            width={150}
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
                <div className="flex flex-col lg:flex-row gap-5">
                    <EditTeamButton team={team} updateTeam={updateTeam} />
                    <Button
                        onClick={async () => {
                            copyTeamLink();
                        }}
                        variant="secondary"
                        size="full">
                        {copyButtonText}
                    </Button>
                </div>
                <Separator />
            </div>
        )
    }
}
 
export default TeamPage;
