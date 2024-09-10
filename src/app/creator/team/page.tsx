"use client";

import { createClient } from "@/utils/supabase/client";
import { Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import { Separator } from "@/components/ui/separator";
import { redirectToHome } from "@/server-actions/creator";
import Image from "next/image";
import { loadImage } from "@/utils/supabase/hooks/loadImage";

const TeamPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [team, setTeam] = useState<Tables<"teams">>();
    const [teamImageUrl, setTeamImageUrl] = useState("");

    useEffect(() => {
        const getTeam = async () => {
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

            const { data: teamData, error: teamError } = await supabase
                .from("teams")
                .select()
                .eq("id", userData.team_id)
                .single()

            if (teamError && !teamData) {
                console.log(teamError);
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

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col gap-5 items-center w-full sm:max-w-4xl px-5 pt-20 sm:pt-10">
                <div className="relative w-32 sm:w-48 aspect-square rounded-full overflow-hidden">
                    {(teamImageUrl == "") ? (
                        // Replace with placeholder image
                        <div className="w-full h-full bg-systemGray5 flex items-center justify-center">
                            <Users className="text-secondaryText" />
                        </div>
                    ) : (
                        <Image
                            placeholder="empty"
                            className="z-50"
                            fill
                            sizes="(max-width: 430px) 128px, (max-width: 1190px) 192px"
                            src={teamImageUrl}
                            alt="teamImage"
                            style={{objectFit: "cover"}}
                        />
                    )}
                </div>
                <div className="flex flex-col gap-5 w-full rounded-xl">
                    <p className="text-primaryText text-center text-3xl font-bold sm:px-40">{team?.name}</p>
                    <p className="text-secondaryText text-center text-base font-medium px-0 sm:px-10 lg:px-40">{team?.description}</p>
                </div>
                <Separator></Separator>
            </div>
        )
    }
}
 
export default TeamPage;
