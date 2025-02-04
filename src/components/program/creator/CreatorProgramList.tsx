"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "../../ui/skeleton";
import { useInView } from "react-intersection-observer";
import { Tables } from "../../../../database.types";
import { getCreatorsPrograms } from "@/server-actions/program";
import { FetchedProgram } from "@/server-actions/models";
import ProgramItem from "../user/ProgramItem";

const CreatorProgramList = ({
    user
}: {
    user: Tables<"users">
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [programs, setPrograms] = useState<FetchedProgram[]>([]);
    const [offset, setOffset] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [ref, inView] = useInView();

    useEffect(() => {
        const getMorePrograms = async () => {
            if (isFinished) {
                return
            }

            const newPrograms = await getCreatorsPrograms(user.id, offset);

            setPrograms([...programs, ...newPrograms]);

            if (newPrograms.length < 10) {
                setIsFinished(true);
            }

            setOffset(offset + 10);

            setIsLoading(false);
        }

        getMorePrograms();
    }, [inView]);

    if (isLoading) {
        return (
            <div className="relative w-full gap-5 border-t-[1px]">
                {Array.from(Array(10), (e, i) => {
                    return (
                        <div className="flex flex-row gap-5 py-5 border-b-[1px]" key={i}>
                            <Skeleton className="w-[120px] h-[120px] shrink-0 rounded-xl" />
                            <div className="flex flex-col gap-2 w-full">
                                <Skeleton className="h-7 w-32"/>
                                <Skeleton className="h-6 w-full"/>
                                <Skeleton className="h-6 w-full"/>
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    } else {
        return (
            <div className="relative w-full gap-5 border-t-[1px]">
                {programs?.map((program) => {
                    return (
                        <ProgramItem
                            program={program}
                            key={program.id}
                        />
                    )
                })}
                <div className="relative w-full gap-5 border-t-[1px]">
                    {!isFinished && (
                        <div ref={ref}>
                            {Array.from(Array(5), (e, i) => {
                                return (
                                    <div className="flex flex-row gap-5 p-5 border-b-[1px]" key={i}>
                                        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                                        <div className="flex flex-col gap-2 w-full">
                                            <Skeleton className="h-7 w-32"/>
                                            <Skeleton className="h-6 w-full"/>
                                            <Skeleton className="h-6 w-full"/>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
 
export default CreatorProgramList;