import EditProgramForm from "@/components/program/creator/EditProgramForm"
import { getProgram } from "@/server-actions/program"

const page = async ({ 
    params
}: {
    params: { id: string }
}) => {
    const program = await getProgram(params.id);

    return (
        <div className="h-full w-full max-w-xl px-5 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-3xl font-bold">Edit Program</p>
            </div>
            <EditProgramForm program={program} />
        </div>
    )
}
export default page