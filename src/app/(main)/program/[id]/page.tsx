"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Tables } from "../../../../../database.types";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Dumbbell, Loader2 } from "lucide-react";
import PurchaseProgramButton from "@/components/program/PurchaseProgramButton";
import { Separator } from "@/components/ui/separator";

const Program = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [program, setProgram] = useState<Tables<"programs">>();
    const [programImageUrl, setProgramImageUrl] = useState<string>("");
    const [creator, setCreator] = useState<Tables<"users">>();
    const [user, setUser] = useState<Tables<"users">>();
    const [isPurchased, setIsPurchased] = useState(false);
    const [week, setWeek] = useState(1);

    const [weeksLoop, setWeeksLoop] = useState<number[]>([]);

    useEffect(() => {
        const getProgram = async () => {
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

            const { data: currentUserData, error: currentUserError } = await supabase
                .from("users")
                .select()
                .eq("id", user!.id)
                .single()

            if (currentUserError || !currentUserData) {
                console.log(currentUserError || "Error getting current db user.");
                setIsLoading(false);
                return;
            }

            setUser(currentUserData);

            // Check is program is purchased
            const { data: purchasedData, error: purchasedError } = await supabase
                .from("purchased_programs")
                .select()
                .eq("program_id", programData.id)
                .eq("purchased_by", currentUserData.id)
                .single()
            
            if (!purchasedError && purchasedData) {
                setIsPurchased(true);
            }

            setIsLoading(false);
        }

        getProgram();
    }, []);

    const onValueChange = (value: string) => {
        const week = parseInt(value);
        setWeek(week);
    }

    if (isLoading || !program) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="bg-systemBackground flex flex-col w-full sm:max-w-2xl px-5 pt-20 sm:pt-10 gap-5 sm:gap-10">
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
                            priority
                        />
                    )}
                </div>
                <div>
                    <div>
                        <p className="text-primaryText text-3xl font-bold">{program?.title}</p>
                        <p className="text-secondaryText">@{creator?.username}</p>
                        <p className="text-primaryText py-5">{program?.description}</p>
                    </div>
                    {isPurchased ? (
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
                    ) : (
                        <PurchaseProgramButton program={program}/>
                    )}
                </div>
            </div>
        )
    }
}

export default Program;
