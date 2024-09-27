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
            <div className="flex flex-col gap-5 pb-5">
                <Separator />
                <Link href={`/program/${programId}`} className="flex flex-col md:flex-row md:min-w-[918px] gap-5">
                    {program.image_url ? (
                            <Image
                                className="h-[200px] w-[300px] rounded-xl"
                                height={200}
                                width={300}
                                src={program.image_url}
                                alt="programImage"
                                style={{objectFit: "cover"}}
                                priority
                            />
                        ) : (
                            <div className="bg-systemGray5 shrink-0 h-[200px] w-[300px] rounded-xl flex items-center justify-center">
                                <Dumbbell className="text-secondaryText" />
                            </div>
                        )}
                        <div className="flex flex-col w-full">
                            <h1 className="text-primaryText font-bold text-xl">{program.title}</h1>
                            <h1 className="text-secondaryText font-medium text-base">{team?.name}</h1>
                            <h1 className="text-secondaryText font-medium text-base line-clamp-4">{team?.description}</h1>
                        </div>
                </Link>
            </div>
            // <Link
            //     href={isCreator ? `/creator/program/${programId}` : `/program/${programId}`}
            //     className="bg-systemGray6 aspect-video rounded-lg"
            // >
            //     <div className="relative h-full rounded-t-lg overflow-hidden">
            //         {program.image_url ? (
            //             <Image
            //                 fill
            //                 sizes="(max-width: 430px) 390px, (max-width: 830px) 241px, (max-width: 1190px) 418px"
            //                 src={imageUrl}
            //                 alt="programImage"
            //                 style={{objectFit: "cover"}}
            //                 priority
            //             />
            //         ) : (
            //             <div className="w-full h-full bg-systemGray5 flex items-center justify-center">
            //                 <Dumbbell className="text-secondaryText" />
            //             </div>
            //         )}
            //     </div>
            //     <div className="flex flex-col p-2 sm:p-3">
            //         <h1 className="text-primaryText font-bold text-xl">{program.title}</h1>
            //         <h1 className="text-secondaryText font-medium text-base">{`${teamName}`}</h1>
            //     </div>
            // </Link>
        )
    }
};

export default ProgramItem;