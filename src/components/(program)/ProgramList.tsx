"use client";

import { Tables } from "../../../database.types";
import ProgramItem from "./ProgramItem";

interface ProgramListProps {
    programs: Tables<"programs">[],
}

const ProgramList = ({
    programs
}: ProgramListProps) => {
    return (
        <div className="relative grid grid-cols-1 lg:grid-cols-[repeat(2,minmax(240px,1fr))] place-self-center gap-5 pb-20">
            {programs?.map((program) => {
                return <ProgramItem program={program} key={program.id} ></ProgramItem>
            })}
        </div>
    );
}
 
export default ProgramList;