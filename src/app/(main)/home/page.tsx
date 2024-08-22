import { getAllPrograms } from "@/server-actions/program";
import ProgramList from "@/components/(program)/ProgramList";

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
        <div className="h-full w-full sm:max-w-4xl px-5 py-20 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-3xl font-bold">Home</p>
            </div>
            <ProgramList programs={programs}></ProgramList>
        </div>
    );
}

export default Home;