"use client";

import Image from "next/image";
import { Dumbbell } from "lucide-react";
import { getProgram } from "@/server-actions/program";
import { Tables } from "../../../database.types";
import { getUser } from "@/server-actions/user";
import { useEffect, useState } from "react";

const PostProgram = ({
    program
}: {
    program: Tables<"programs">
}) => {
    const [user, setUser] = useState<Tables<"users"> | null>(null);

    useEffect(() => {
        const getUserClient = async () => {
            const user = await getUser(program.created_by);
            
            setUser(user);
        }

        getUserClient()
    }, []);

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col md:flex-row gap-5">
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
                    <h1 className="text-primaryText font-bold text-md">{program.title}</h1>
                    <h1 className="text-secondaryText font-bold text-sm">{user?.full_name}</h1>
                    <h1 className="text-secondaryText font-bold text-sm">{formatter.format(program.price)}</h1>
                    <h1 className="text-secondaryText font-medium text-sm line-clamp-3">{program.description}</h1>
                </div>
            </div>
        </div>
    )
};

export default PostProgram;