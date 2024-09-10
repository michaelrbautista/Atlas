"use client";

import { Tables } from "../../../database.types";
import TeamItem from "./TeamItem";

const TeamList = ({
    teams
}: {
    teams: Tables<"teams">[]
}) => {
    return (
        <div className="relative grid grid-cols-1 sm:grid-cols-[repeat(2,minmax(240px,1fr))] place-self-center gap-5 pt-5 pb-20">
            {teams?.map((team) => {
                return <TeamItem team={team} key={team.id} />
            })}
        </div>
    );
}
 
export default TeamList;