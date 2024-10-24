import ProgramList from "@/components/program/ProgramList";
import { getUsersPrograms } from "@/server-actions/program";

const Programs = async () => {
    const programIds = await getUsersPrograms();

    return (
        <div className="h-full w-full max-w-2xl px-5 py-20 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-2xl sm:text-3xl font-bold">Programs</p>
            </div>
            <ProgramList isCreator={false} programIds={programIds}></ProgramList>
        </div>
    );
}
 
export default Programs;