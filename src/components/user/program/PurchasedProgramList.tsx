import { FetchedPurchasedProgram } from "@/server-actions/models";
import PurchasedProgramItem from "./PurchasedProgramItem";


const PurchasedProgramList = ({
    programs
}: {
    programs: FetchedPurchasedProgram[]
}) => {
    return (
        <div className="relative w-full gap-5 pb-10 border-t-[1px]">
            {programs?.map((program) => {
                return (
                    <PurchasedProgramItem
                        program={program}
                        key={program.programs?.id}
                    />
                )
            })}
        </div>
    );
}
 
export default PurchasedProgramList;