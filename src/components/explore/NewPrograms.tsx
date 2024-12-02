import { getNewPrograms } from "@/server-actions/program"
import ProgramList from "../program/ProgramList"
import ProgramItem from "../program/ProgramItem";

const NewPrograms = async () => {
    const newPrograms = await getNewPrograms();

    return (
        <div className="relative w-full gap-5 pb-10 border-t-[1px]">
            {newPrograms?.map((program) => {
                return (
                    <ProgramItem
                        id={program.id ?? ""}
                        title={program.title ?? "Error getting program."}
                        imageUrl={program.image_url ?? undefined}
                        price={program.price ?? 0}
                        description={program.description ?? undefined}
                        userFullName={program.created_by.full_name ?? ""}
                        key={program.id ?? ""}
                    />
                )
            })}
        </div>
    )
}
export default NewPrograms