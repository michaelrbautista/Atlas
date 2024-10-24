import { Tables } from "../../../database.types";
import ProgramItem from "./ProgramItem";

const ProgramList = ({
    isCreator,
    programs,
    programIds
}: {
    isCreator: boolean,
    programs?: Tables<"programs">[],
    programIds?: string[]
}) => {
    return (
        <div className="relative w-full gap-5 pb-10">
            {(programs && !programIds) ? 
                programs?.map((program) => {
                    return <ProgramItem isCreator={isCreator} programId={program.id} key={program.id} />
                }) : 
                programIds?.map((programId) => {
                    return <ProgramItem isCreator={isCreator} programId={programId} key={programId} />
                })
            }
        </div>
    );
}
 
export default ProgramList;