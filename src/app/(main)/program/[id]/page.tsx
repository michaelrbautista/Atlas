"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Tables } from "../../../../../database.types";
import { useEffect, useState } from "react";
import { Dumbbell, Loader2 } from "lucide-react";
import PurchaseProgramButton from "@/components/program/PurchaseProgramButton";
import LoggedOutPurchaseButton from "@/components/auth/LoggedOutPurchaseButton";
import MobileCalendar from "@/components/program/MobileCalendar/MobileCalendar";
import { useToast } from "@/components/ui/use-toast";

const Program = ({ 
    params
}: {
    params: { id: string }
}) => {
    const [isLoading, setIsLoading] = useState(true);

    const [program, setProgram] = useState<Tables<"programs">>();
    const [programImageUrl, setProgramImageUrl] = useState<string>("");
    const [isPurchased, setIsPurchased] = useState(false);

    const [creator, setCreator] = useState<Tables<"users">>();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { toast } = useToast();

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
                toast({
                    title: "An error occurred.",
                    description: programError.message
                })
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
                toast({
                    title: "An error occurred.",
                    description: creatorError.message
                })
                return
                return
            }

            setCreator(creatorData);

            // Get current user
            const { data: { user }} = await supabase.auth.getUser();

            if (!user) {
                setIsLoading(false);
                return
            }

            const { data: currentUserData, error: currentUserError } = await supabase
                .from("users")
                .select()
                .eq("id", user!.id)
                .single()

            if (currentUserError || !currentUserData) {
                toast({
                    title: "An error occurred.",
                    description: currentUserError.message
                })
                return
            }

            setIsLoggedIn(true);

            // Check is program is purchased
            const { data: purchasedData, error: purchasedError } = await supabase
                .from("purchased_programs")
                .select()
                .eq("program_id", programData.id)
                .eq("purchased_by", currentUserData.id)

            if (purchasedError && !purchasedData) {
                toast({
                    title: "An error occurred.",
                    description: purchasedError.message
                })
                return
            }

            if (purchasedData.length > 0) {
                setIsPurchased(true);
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
            <div className="flex flex-col w-full max-w-2xl px-5 py-10 gap-10 sm:gap-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-5 w-full">
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
                    <div className="flex flex-col w-full">
                        <p className="text-primaryText text-2xl font-bold">{program?.title}</p>
                        <div className="flex flex-col gap-2">
                            <p className="text-secondaryText text-lg font-semibold">@{creator?.username}</p>
                            <p className="text-primaryText text-sm">{program?.description}</p>
                        </div>
                    </div>
                </div>
                {!isPurchased && (
                    isLoggedIn ? (
                        <PurchaseProgramButton program={program}/>
                    ) : (
                        <LoggedOutPurchaseButton program={program} />
                    )
                )}
                {isPurchased && (
                    <MobileCalendar
                        programId={program.id}
                        weeks={program.weeks}
                        pages={Math.floor(program.weeks / 4) + 1}
                    />
                )}
            </div>
        )
    }
}

export default Program;
