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

import { loadImage } from "@/utils/supabase/hooks/loadImage";
import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

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

            // Get program image
            if (programData?.image_path) {
                const programImage = loadImage(programData?.image_path ?? "", "team_images");
                setProgramImageUrl(programImage);
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

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </div>
        )
    } else {
        return (
            <div className="bg-background flex flex-col w-full sm:max-w-2xl px-5 pt-20 sm:pt-10 gap-5 sm:gap-10">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                    {(programImageUrl == "") ? (
                        // Replace with placeholder image
                        <div></div>
                    ) : (
                        <Image fill src={programImageUrl} alt="programImage"></Image>
                    )}
                </div>
                <div>
                    <p className="text-primaryText text-3xl font-bold">{program?.title}</p>
                    <p className="text-secondaryText">@{creator?.username}</p>
                    <p className="py-5">{program?.description}</p>
                </div>
                {isPurchased ? (
                    <div>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Week"></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel hidden></SelectLabel>
                                    <SelectItem value="week 1">Week 1</SelectItem>
                                    <SelectItem value="week 2">Week 2</SelectItem>
                                    <SelectItem value="week 3">Week 3</SelectItem>
                                    <SelectItem value="week 4">Week 4</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                ) : (
                    <div>Not purchased</div>
                )}
            </div>
        )
    }
}

export default Program;
