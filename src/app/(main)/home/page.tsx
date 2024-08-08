import ProgramItem from "@/components/(programs)/programItem";
import { getAllPrograms } from "@/utils/supabase/queries/programQueries";
import ProgramList from "@/components/(programs)/programList";

const Home = async () => {
    const programs = await getAllPrograms();

    

    if (!programs) {
        return (
            <div className="text-white">
                Couldn't load programs.
            </div>
        )
    }

    return (
        <div className="h-full w-full sm:max-w-5xl px-5 py-20 md:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-3xl font-bold">Home</p>
            </div>
            <ProgramList programs={programs}></ProgramList>
        </div>
    );
}

export default Home;