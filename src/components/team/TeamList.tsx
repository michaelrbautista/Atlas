"use client";

import { Tables } from "../../../database.types";
import { Separator } from "../ui/separator";
import TeamItem from "./TeamItem";

const TeamList = ({
    teams,
    teamRefs
}: {
    teams?: Tables<"teams">[],
    teamRefs?: string[]
}) => {
    return (
        <div className="relative w-full gap-5 pb-10">
            {(teams && !teamRefs) ? 
                teams?.map((team) => {
                    return <TeamItem team={team} key={team.id} />
                }) : 
                teamRefs?.map((team) => {
                    return <TeamItem teamId={team} key={team} />
                })
            }
            <Separator />
        </div>
    );
}
 
export default TeamList;