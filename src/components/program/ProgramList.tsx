import ProgramItem, { FetchedProgram } from "./ProgramItem";

const ProgramList = ({
    programs
}: {
    programs: FetchedProgram[]
}) => {
    return (
        <div className="relative w-full gap-5 pb-10">
            {programs?.map((program) => {
                return (
                    <ProgramItem
                        id={program.programs?.id ?? ""}
                        title={program.programs?.title ?? "Error getting program."}
                        imageUrl={program.programs?.image_url ?? undefined}
                        price={program.programs?.price ?? 0}
                        description={program.programs?.description ?? undefined}
                        userFullName={program.created_by?.full_name ?? ""}
                        key={program.programs?.id ?? ""}
                    />
                )
            })}
        </div>
    );
}
 
export default ProgramList;