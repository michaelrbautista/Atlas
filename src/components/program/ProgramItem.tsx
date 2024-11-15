"use client";

import Image from "next/image";
import Link from "next/link";
import { Dumbbell } from "lucide-react";

export type FetchedProgram = {
    created_by: {
        full_name: string;
    } | null;
    programs: {
        id: string;
        title: string;
        price: number;
        description: string | null;
        image_url: string | null;
    } | null;
}

const ProgramItem = ({
    id,
    title,
    imageUrl,
    price,
    description,
    userFullName
}: {
    id: string,
    title: string,
    imageUrl?: string,
    price: number,
    description?: string,
    userFullName: string
}) => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    return (
        <div className="flex flex-col gap-5 py-5">
            <Link href={`/program/${id}`} className="flex flex-col md:flex-row gap-5">
                {imageUrl ? (
                    <Image
                        className="h-[120px] w-[200px] rounded-xl my-auto shrink-0"
                        height={120}
                        width={200}
                        src={imageUrl}
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
                    <h1 className="text-primaryText font-bold text-md line-clamp-1">{title}</h1>
                    <h1 className="text-secondaryText font-bold text-sm">{userFullName}</h1>
                    <h1 className="text-secondaryText font-bold text-sm">{formatter.format(price)}</h1>
                    <h1 className="text-secondaryText font-medium text-sm line-clamp-3">{description}</h1>
                </div>
            </Link>
        </div>
    )
};

export default ProgramItem;