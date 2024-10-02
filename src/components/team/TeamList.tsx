"use client";

import { Tables } from "../../../database.types";
import TeamItem from "./TeamItem";

const TeamList = ({
    teams
}: {
    teams: Tables<"teams">[]
}) => {
    return (
        <div className="flex flex-col w-full gap-5 pb-10">
            {teams?.map((team) => {
                return <TeamItem team={team} key={team.id} />
            })}
        </div>
    );
}
 
export default TeamList;