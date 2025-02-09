"use client";

import Link from "next/link";
import { Dumbbell, Lock } from "lucide-react";
import { FetchedProgram } from "@/server-actions/models";
import BlurImage from "@/components/misc/BlurImage";

const ProgramItem = ({
    program
}: {
    program: FetchedProgram
}) => {
    return (
        <Link href={`/program/${program.id}`} className="flex flex-row gap-5 py-5 border-b-[1px]">
            {program.image_url ? (
                <div className="relative w-[120px] h-[120px] shrink-0">
                    <BlurImage
                        alt="profilePicture"
                        src={program.image_url}
                        contentMode="cover"
                        sizes="120px"
                        className="rounded-xl"
                        canSelect={false}
                    />
                </div>
            ) : (
                <div className="bg-systemGray5 shrink-0 h-[120px] w-[120px] rounded-xl flex items-center justify-center">
                    <Dumbbell className="text-secondaryText" />
                </div>
            )}
            <div className="flex flex-col w-full justify-between">
                <div className="flex flex-col w-full justify-start">
                    <h1 className="text-primaryText font-bold text-md line-clamp-1">{program.title}</h1>
                    <h1 className="text-secondaryText font-bold text-sm">{program.created_by?.full_name}</h1>
                    <h1 className="text-secondaryText font-medium text-sm pt-2 line-clamp-2">{program.description}</h1>
                </div>
                {!program.free && (
                    <div className="flex flex-row gap-1 items-center">
                        <Lock color="gray" size={16} />
                        <p className="text-secondaryText text-sm">Subscribers only</p>
                    </div>
                )}
            </div>
        </Link>
    )
};

export default ProgramItem;