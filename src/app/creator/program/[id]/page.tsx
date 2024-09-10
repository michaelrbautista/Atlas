"use client";

import { Dumbbell, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import Image from "next/image";
import { 
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import CreatorProgramWeek from "@/components/program/CreatorProgramWeek";

const ViewCreatorProgram = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [program, setProgram] = useState<Tables<"programs">>();
    const [programImageUrl, setProgramImageUrl] = useState<string>("");
    const [creator, setCreator] = useState<Tables<"users">>();
    const [week, setWeek] = useState(1);

    const [weeksLoop, setWeeksLoop] = useState<number[]>([]);

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
                console.log(programError || "Error getting program.");
                setIsLoading(false);
                return
            }

            setProgram(programData);

            setWeeksLoop(Array.from({length: programData.weeks}, (_, i) => i + 1));

            // Get program image
            if (programData?.image_url) {
                setProgramImageUrl(programData.image_url);
            }

            // Get program creator
            const { data: creatorData, error: creatorError } = await supabase
                .from("users")
                .select()
                .eq("id", programData.created_by)
                .single()

            if (creatorError || !creatorData) {
                console.log(creatorError || "Error getting creator.");
                setIsLoading(false);
                return
            }

            setCreator(creatorData);

            // Get current user
            const { data: { user }} = await supabase.auth.getUser();

            if (!user) {
                console.log("No user is logged in or there was an error getting current auth user.");
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
        }

        getProgram();
    }, []);

    const onValueChange = (value: string) => {
        const week = parseInt(value);
        setWeek(week);
    }

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-full sm:max-w-2xl px-5 py-20 sm:py-10 gap-5 sm:gap-10">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                    {(programImageUrl == "") ? (
                        // Replace with placeholder image
                        <div className="w-full h-full bg-systemGray5 flex items-center justify-center">
                            <Dumbbell className="text-secondaryText" />
                        </div>
                    ) : (
                        <Image
                            fill
                            sizes="(max-width: 430px) 192px, (max-width: 1190px) 256px"
                            src={programImageUrl}
                            alt="programImage"
                        />
                    )}
                </div>
                <div>
                    <p className="text-primaryText text-3xl font-bold">{program?.title}</p>
                    <p className="text-secondaryText">@{creator?.username}</p>
                    <p className="text-primaryText py-5">{program?.description}</p>
                </div>
                <Select onValueChange={onValueChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Week 1"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel hidden></SelectLabel>
                            {program && 
                                weeksLoop?.map((week) => {
                                    return <SelectItem value={week.toString()} key={week}>Week {week}</SelectItem>
                                })
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {program && (
                    <CreatorProgramWeek programId={program.id} week={week}/>
                )}
            </div>
        )
    }
}
 
export default ViewCreatorProgram;