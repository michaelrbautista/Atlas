"use client";

import Image from "next/image";
import Link from "next/link";
import { Tables } from "../../../database.types";
import { loadImage } from "@/utils/supabase/hooks/loadImage";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Users } from "lucide-react";

const TeamItem = ({
    team
}: {
    team: Tables<"teams">
}) => {
    const [isLoading, setIsLoading] = useState(true);

    const imagePath = loadImage(team.image_path || "", "team_images");

    return (
        <Link href={`team/${team.id}`} className="bg-systemGray6 h-36 rounded-lg p-5">
            <div className="flex flex-row h-full gap-2 items-center">
                {team.image_url ? (
                    <Image
                        className="h-24 w-24 rounded-full"
                        height={100}
                        width={100}
                        src={imagePath}
                        alt="teamImage"
                        style={{objectFit: "cover"}}
                        priority
                    />
                ) : (
                    <div className="w-full bg-systemGray5 flex items-center justify-center">
                        <Users className="text-secondaryText" />
                    </div>
                )}
                <div className="flex flex-col justify-center h-full w-full p-2 sm:p-3">
                    <h1 className="text-primaryText font-bold text-xl">{team.name}</h1>
                    <h1 className="text-secondaryText font-medium text-base line-clamp-2">{team.description}</h1>
                </div>
            </div>
        </Link>
    )
};

export default TeamItem;