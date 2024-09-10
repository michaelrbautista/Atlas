"use client";

import Image from "next/image";
import Link from "next/link";
import { Tables } from "../../../database.types";
import { loadImage } from "@/utils/supabase/hooks/loadImage";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "../ui/skeleton";
import { Dumbbell } from "lucide-react";

const ProgramItem = ({
    isCreator,
    programId
}: {
    isCreator: boolean,
    programId: string
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [program, setProgram] = useState<Tables<"programs"> | null>(null);
    const [teamName, setTeamName] = useState("");
    const [creatorId, setCreatorId] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // const imagePath = loadImage(program.image_path || "", "program_images");

    useEffect(() => {
        const getProgram = async () => {
            const supabase = createClient();

            // Get program
            const { data: programData, error: programError } = await supabase
                .from("programs")
                .select()
                .eq("id", programId)
                .single()

            if (programError && !programData) {
                console.log(programError.message);
                return
            }

            setProgram(programData);

            if (programData.image_url) {
                setImageUrl(programData.image_url);
            }

            // Get team
            const { data: teamData, error: teamError } = await supabase
                .from("teams")
                .select()
                .eq("id", programData.team_id)
                .single()

            if (teamData && !teamError) {
                setTeamName(teamData.name);
            } else {
                console.log(teamError.message);
                return
            }

            // Get creator
            const { data: creatorData, error: creatorError } = await supabase
                .from("users")
                .select()
                .eq("id", programData.created_by)
                .single()

            if (creatorData && !creatorError) {
                setCreatorId(creatorData.id);
            } else {
                console.log(creatorError.message);
                return
            }

            setIsLoading(false);
        }

        getProgram();
    }, []);

    if (isLoading || !program) {
        return (
            <div className="bg-systemGray4 rounded-xl">
                <div className="flex flex-col h-full justify-end">
                    <div className="relative rounded-t-xl h-full aspect-video overflow-hidden">
                        <Skeleton className="w-full h-full" />
                    </div>
                    <div className="flex flex-col p-2 sm:p-3">
                        <Skeleton className="w-full h-7"></Skeleton>
                        <Skeleton className="w-full h-5 sm:h-6"></Skeleton>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <Link
                href={isCreator ? `/creator/program/${programId}` : `/program/${programId}`}
                className="bg-systemGray6 aspect-video rounded-lg"
            >
                <div className="relative h-full rounded-t-lg overflow-hidden">
                    {program.image_url ? (
                        <Image
                            fill
                            sizes="(max-width: 430px) 390px, (max-width: 830px) 241px, (max-width: 1190px) 418px"
                            src={imageUrl}
                            alt="programImage"
                            style={{objectFit: "cover"}}
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-systemGray5 flex items-center justify-center">
                            <Dumbbell className="text-secondaryText" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col p-2 sm:p-3">
                    <h1 className="text-primaryText font-bold text-xl">{program.title}</h1>
                    <h1 className="text-secondaryText font-medium text-base">{`${teamName}`}</h1>
                </div>
            </Link>
        )
    }
};

export default ProgramItem;