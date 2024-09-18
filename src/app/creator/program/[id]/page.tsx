"use client";

import { Dumbbell, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import Calendar from "@/components/program/Calendar/Calendar";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ViewCreatorProgram = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [program, setProgram] = useState<Tables<"programs">>();
    const [programImageUrl, setProgramImageUrl] = useState<string>("");
    const [creator, setCreator] = useState<Tables<"users">>();

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

    if (isLoading || !program) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-full sm:max-w-5xl px-5 py-20 sm:py-10 gap-10 sm:gap-10">
                <div className="flex flex-col sm:flex-row gap-5 w-full sm:px-16">
                    {(programImageUrl == "") ? (
                        // Replace with placeholder image
                        <div className="bg-systemGray5 shrink-0 h-[200px] w-[300px] rounded-xl flex items-center justify-center">
                            <Dumbbell className="text-secondaryText" />
                        </div>
                    ) : (
                        <Image
                            className="h-[200px] w-[300px] rounded-xl"
                            height={200}
                            width={300}
                            src={programImageUrl}
                            alt="programImage"
                            style={{objectFit: "cover"}}
                            priority
                        />
                    )}
                    <div className="flex flex-col">
                        <p className="text-primaryText text-2xl font-bold">{program?.title}</p>
                        <div className="flex flex-col gap-5">
                            <p className="text-secondaryText text-lg font-semibold">@{creator?.username}</p>
                            <p className="text-primaryText text-sm">{program?.description}</p>
                        </div>
                    </div>
                </div>
                <div className="flex overflow-scroll">
                    <Calendar
                        programId={program.id}
                        weeks={program.weeks}
                        pages={Math.floor(program.weeks / 4) + 1}
                        isCreator={true}
                    />
                </div>
            </div>
        )
    }
}
 
export default ViewCreatorProgram;