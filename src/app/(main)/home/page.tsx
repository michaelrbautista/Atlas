import ProgramList from "@/components/program/ProgramList";
import TeamList from "@/components/team/TeamList";
import { getAllTeams } from "@/server-actions/team";

const Home = async () => {
    const teams = await getAllTeams();

    if (!teams) {
        return (
            <div className="text-white">
                Couldn't load teams.
            </div>
        )
    }

    return (
        <div className="h-full w-full sm:max-w-4xl px-5 py-20 sm:py-10">
            <div className="flex justify-between items-center pb-2">
                <p className="text-foreground text-3xl font-bold">Home</p>
            </div>
            <TeamList teams={teams}/>
        </div>
    );
}

export default Home;