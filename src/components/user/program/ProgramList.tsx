import { FetchedProgram } from "@/server-actions/fetch-types";
import ProgramItem from "./ProgramItem";

const ProgramList = ({
    programs
}: {
    programs: FetchedProgram[]
}) => {
    return (
        <div className="relative w-full gap-5 pb-10 border-t-[1px]">
            {programs?.map((program) => {
                return (
                    <ProgramItem
                        program={program}
                        key={program.id}
                    />
                )
            })}
        </div>
    );
}
 
export default ProgramList;