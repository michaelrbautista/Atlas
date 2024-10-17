"use client";

import Image from "next/image";
import Link from "next/link";
import { Tables } from "../../../database.types";
import { loadImage } from "@/utils/supabase/hooks/loadImage";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Users } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "../ui/use-toast";
import { Separator } from "../ui/separator";

const TeamItem = ({
    team,
    teamId
}: {
    team?: Tables<"teams">,
    teamId?: string
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [finalTeam, setFinalTeam] = useState<Tables<"teams"> | null>(null);

    const { toast } = useToast();

    useEffect(() => {
        const getTeam = async () => {
            setIsLoading(true);

            const supabase = createClient();

            const { data, error } = await supabase
                .from("teams")
                .select()
                .eq("id", teamId!)
                .single()

            if (error && !data) {
                toast({
                    title: "An error occurred.",
                    description: "Couldn't get team."
                })
                return
            }

            setFinalTeam(data);
        }

        if (teamId && !team) {
            getTeam();
        } else {
            setFinalTeam(team!);
        }
    })

    if (isLoading || !finalTeam) {
        return (
            <div></div>
        )
    } else {
        return (
            <div className="flex flex-col gap-5 pb-5">
                <Separator />
                <Link href={`team/${finalTeam.id}`}>
                    <div className="flex flex-row h-full gap-5">
                        {finalTeam.image_url ? (
                            <Image
                                className="h-[80px] w-[80px] rounded-full"
                                height={80}
                                width={80}
                                src={finalTeam.image_url}
                                alt="teamImage"
                                style={{objectFit: "cover"}}
                                priority
                            />
                        ) : (
                            <div className="h-[80px] w-[80px] rounded-full bg-systemGray5 flex items-center justify-center">
                                <Users className="text-secondaryText" />
                            </div>
                        )}
                        <div className="flex flex-col items-start h-full">
                            <h1 className="text-primaryText font-bold text-xl">{finalTeam.name}</h1>
                            <h1 className="text-secondaryText font-medium text-sm line-clamp-2">{finalTeam.description}</h1>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }
};

export default TeamItem;