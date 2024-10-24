import TeamList from "@/components/team/TeamList";
import { getAllTeams } from "@/server-actions/team";

const Teams = async () => {
    
    const teams = await getAllTeams();

    return (
        <div className="h-full w-full max-w-2xl px-5 sm:py-10">
            <div className="flex justify-between items-center pb-2">
                <p className="text-foreground text-3xl font-bold">Home</p>
            </div>
            <TeamList teams={teams}/>
        </div>
    );
}

export default Teams