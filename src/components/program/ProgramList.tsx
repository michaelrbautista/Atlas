"use client";

import ProgramItem from "./ProgramItem";

const ProgramList = ({
    isCreator,
    programIds
}: {
    isCreator: boolean,
    programIds: string[]
}) => {
    return (
        <div className="relative w-full gap-5 pb-10">
            {programIds?.map((programId) => {
                return <ProgramItem isCreator={isCreator} programId={programId} key={programId} />
            })}
        </div>
    );
}
 
export default ProgramList;