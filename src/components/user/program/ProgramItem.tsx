"use client";

import Image from "next/image";
import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { FetchedProgram } from "@/server-actions/fetch-types";

const ProgramItem = ({
    program
}: {
    program: FetchedProgram
}) => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    return (
        <div className="flex flex-col gap-5 py-5 border-b-[1px]">
            <Link href={`/program/${program.id}`} className="flex flex-col md:flex-row gap-5">
                {program.image_url ? (
                    <Image
                        className="h-[120px] w-[200px] rounded-xl my-auto shrink-0"
                        height={120}
                        width={200}
                        src={program.image_url}
                        alt="programImage"
                        style={{objectFit: "cover"}}
                        priority
                    />
                ) : (
                    <div className="bg-systemGray5 shrink-0 h-[120px] w-[200px] rounded-xl flex items-center justify-center">
                        <Dumbbell className="text-secondaryText" />
                    </div>
                )}
                <div className="flex flex-col w-full justify-start">
                    <h1 className="text-primaryText font-bold text-md line-clamp-1">{program.title}</h1>
                    <h1 className="text-secondaryText font-bold text-sm">{program.created_by?.full_name}</h1>
                    {!program.free ? (
                        <h1 className="text-secondaryText font-bold text-sm">{formatter.format(program.price)}</h1>
                    ) : (
                        <h1 className="text-secondaryText font-bold text-sm">Free</h1>
                    )}
                    <h1 className="text-secondaryText font-medium text-sm line-clamp-2">{program.description}</h1>
                </div>
            </Link>
        </div>
    )
};

export default ProgramItem;