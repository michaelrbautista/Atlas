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

    const { toast } = useToast();

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

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
            
            setIsLoading(false); 
        }

        getProgram();
    }, []);

    if (isLoading || !program) {
        return (
            <div className="flex flex-col gap-5 pb-5">
                <Separator />
                <div className="flex flex-col md:flex-row gap-5">
                    <Skeleton className="h-[120px] w-[200px] rounded-xl shrink-0"/>
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
                            className="h-[120px] w-[200px] rounded-xl my-auto shrink-0"
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
                    <div className="flex flex-col w-full justify-start">
                        <h1 className="text-primaryText font-bold text-md">{program.title}</h1>
                        <h1 className="text-secondaryText font-bold text-sm">{team?.name}</h1>
                        <h1 className="text-secondaryText font-bold text-sm">{formatter.format(program.price)}</h1>
                        <h1 className="text-secondaryText font-medium text-sm line-clamp-3">{program.description}</h1>
                    </div>
                </Link>
            </div>
        )
    }
};

export default ProgramItem;