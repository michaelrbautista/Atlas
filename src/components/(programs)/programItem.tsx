"use client";

import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/utils/supabase/queries/userQueries";
import { Tables } from "../../../types/supabase";
import { loadImage } from "@/utils/supabase/hooks/loadImage";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "../ui/skeleton";

interface ProgramProps {
    program: Tables<"programs">,
}

const ProgramItem = ({ program }: ProgramProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState("");

    const imagePath = loadImage(program.image_path || "", "program_images");

    useEffect(() => {
        const getUsername = async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from("users")
                .select()
                .eq("id", program.created_by)
                .single()

            if (!error && data) {
                setUsername(data.username);
                setIsLoading(false);
            }
        }

        getUsername();
    });

    if (isLoading) {
        return (
            <div className="bg-systemGray4 w-auto aspect-6/4 rounded-xl">
                <div className="flex flex-col h-full justify-end">
                    <div className="relative rounded-t-xl h-full overflow-hidden">
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
            <Link href={`program/${program.id}`} className="bg-systemGray4 w-auto aspect-6/4 rounded-xl">
                <div className="flex flex-col h-full justify-end">
                    <div className="relative rounded-t-xl h-full overflow-hidden">
                        <Image fill objectFit="cover" src={imagePath} alt="programImage"></Image>
                    </div>
                    <div className="flex flex-col p-2 sm:p-3">
                        <h1 className="text-primaryText font-bold text-lg sm:text-xl">{program.title}</h1>
                        <h1 className="text-secondaryText font-medium text-sm sm:text-base">{`@${username}`}</h1>
                    </div>
                </div>
            </Link>
        )
    }
};

export default ProgramItem;