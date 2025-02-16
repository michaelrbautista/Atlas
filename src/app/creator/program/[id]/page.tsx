"use client";

import { Dumbbell, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import Calendar from "@/components/program/creator/calendar/Calendar";
import { useToast } from "@/components/ui/use-toast";
import ProgramOptionsButton from "@/components/program/creator/ProgramOptionsButton";
import { InfoList } from "@/components/program/user/InfoList";
import BlurImage from "@/components/misc/BlurImage";

const ViewCreatorProgram = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [program, setProgram] = useState<Tables<"programs">>();
    const [programImageUrl, setProgramImageUrl] = useState<string>("");

    const { toast } = useToast();

    useEffect(() => {
        const getProgram = async () => {
            setIsLoading(true);

            const supabase = createClient();

            // Get program
            const { data: programData, error: programError } = await supabase
                .from("programs")
                .select()
                .eq("id", params.id)
                .single()
            
            if (programError || !programData) {
                toast({
                    title: "An error occurred.",
                    description: programError.message
                })
                setIsLoading(false);
                return
            }

            setProgram(programData);

            // Get program image
            if (programData?.image_url) {
                setProgramImageUrl(programData.image_url);
            }

            // Get current user
            const { data: { user }} = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "An error occurred.",
                    description: "No user is logged in or there was an error getting current auth user."
                })
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
        }

        getProgram();
    }, []);

    if (isLoading || !program) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-full sm:max-w-5xl px-5 py-20 sm:py-10 gap-10 sm:gap-10">
                <div className="flex flex-col gap-5 px-10">
                    <div className="flex flex-row justify-between w-full">
                        {(programImageUrl == "") ? (
                            // Replace with placeholder image
                            <div className="bg-systemGray5 shrink-0 h-[120px] w-[120px] rounded-xl flex items-center justify-center">
                                <Dumbbell className="text-secondaryText" />
                            </div>
                        ) : (
                            <div className="relative w-[120px] h-[120px] shrink-0">
                                <BlurImage
                                    alt="programImage"
                                    src={programImageUrl}
                                    contentMode="cover"
                                    sizes="120px"
                                    className="rounded-xl"
                                    canSelect={false}
                                />
                            </div>
                        )}
                        <div className="shrink-0">
                            <ProgramOptionsButton
                                program={program}
                            />
                        </div>
                    </div>
                    <p className="text-primaryText text-2xl font-bold">{program?.title}</p>
                    <InfoList
                        infoItems={program.description ? [
                            {
                                header: "Description",
                                info: program.description
                            },
                            {
                                header: "Duration",
                                info: `${program.weeks} ${program.weeks == 1 ? "week" : "weeks"}`
                            },
                            {
                                header: "Visibility",
                                info: program.private ? "Private" : "Public"
                            },
                            {
                                header: "Tier",
                                info: program.free ? "Free" : "Paid"
                            }
                        ] : [
                            {
                                header: "Duration",
                                info: `${program.weeks} ${program.weeks == 1 ? "week" : "weeks"}`
                            },
                            {
                                header: "Visibility",
                                info: program.private ? "Private" : "Public"
                            },
                            {
                                header: "Tier",
                                info: program.free ? "Free" : "Paid"
                            }
                        ]}
                    />
                </div>
                <div className="flex overflow-scroll">
                    <Calendar
                        programId={program.id}
                        weeks={program.weeks}
                        pages={program.weeks % 4 == 0 ? Math.floor(program.weeks / 4) : Math.floor(program.weeks / 4) + 1}
                    />
                </div>
            </div>
        )
    }
}
 
export default ViewCreatorProgram;