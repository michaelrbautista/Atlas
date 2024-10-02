"use client";

import Image from "next/image";
import Link from "next/link";
import { Tables } from "../../../database.types";
import { loadImage } from "@/utils/supabase/hooks/loadImage";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "../ui/skeleton";
import { Dumbbell } from "lucide-react";
import { Separator } from "../ui/separator";
import { useToast } from "../ui/use-toast";

const ProgramItem = ({
    isCreator,
    programId
}: {
    isCreator: boolean,
    programId: string
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [program, setProgram] = useState<Tables<"programs"> | null>(null);
    const [team, setTeam] = useState<Tables<"teams"> | null>(null);
    const [creatorId, setCreatorId] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const { toast } = useToast();

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
                toast({
                    title: "An error occurred.",
                    description: programError.message
                })
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

            if (teamError && !teamData) {
                toast({
                    title: "An error occurred.",
                    description: teamError.message
                })
                return
            }

            setTeam(teamData);

            // Get creator
            const { data: creatorData, error: creatorError } = await supabase
                .from("users")
                .select()
                .eq("id", programData.created_by)
                .single()

            if (creatorError && !creatorData) {
                toast({
                    title: "An error occurred.",
                    description: creatorError.message
                })
                return
            }

            setCreatorId(creatorData.id);
            
            setIsLoading(false); 
        }

        getProgram();
    }, []);

    if (isLoading || !program) {
        return (
            <div className="flex flex-col gap-5 pb-5">
                <Separator />
                <div className="flex flex-col md:flex-row md:min-w-[918px] gap-5">
                    <Skeleton className="h-[200px] w-[300px] rounded-xl shrink-0"/>
                    <div className="flex flex-col w-full gap-2">
                        <Skeleton className="h-7"></Skeleton>
                        <Skeleton className="h-5 sm:h-6"></Skeleton>
                        <Skeleton className="h-5 sm:h-6"></Skeleton>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col gap-5 pb-5">
                <Separator />
                <Link href={`/program/${programId}`} className="flex flex-col md:flex-row gap-5">
                    {program.image_url ? (
                            <Image
                                className="h-[120px] w-[200px] rounded-xl shrink-0"
                                height={120}
                                width={200}
                                src={program.image_url}
                                alt="programImage"
                                style={{objectFit: "cover"}}
                                priority
                            />
                        ) : (
                            <div className="bg-systemGray5 shrink-0 h-[120px] w-[200px] rounded-xl flex items-center justify-center">
                                <Dumbbell className="text-secondaryText" />
                            </div>
                        )}
                        <div className="flex flex-col w-full">
                            <h1 className="text-primaryText font-bold text-xl">{program.title}</h1>
                            <h1 className="text-secondaryText font-medium text-base">{team?.name}</h1>
                            <h1 className="text-secondaryText font-medium text-base line-clamp-4">{program.description}</h1>
                        </div>
                </Link>
            </div>
        )
    }
};

export default ProgramItem;