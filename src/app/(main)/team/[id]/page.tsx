import { Users } from "lucide-react";
import Image from "next/image";
import ProgramList from "@/components/program/ProgramList";
import { checkIfTeamIsJoined, getTeam, getTeamPrograms } from "@/server-actions/team";
import JoinTeamButton from "@/components/team/Buttons/JoinTeamButton";

const Team = async ({ 
    params
}: {
    params: { id: string }
}) => {
    // Get team
    const team = await getTeam(params.id);

    // Check if user joined team
    const isJoined = await checkIfTeamIsJoined(params.id);

    // Get team programs
    const programs = await getTeamPrograms(params.id);

    return (
        <div className="flex flex-col w-full max-w-2xl px-5 py-10 gap-10 sm:gap-10">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 w-full">
                {(!team.image_url) ? (
                    // Replace with placeholder image
                    <div className="bg-systemGray5 shrink-0 h-[150px] w-[150px] rounded-full flex items-center justify-center">
                        <Users className="text-secondaryText" />
                    </div>
                ) : (
                    <Image
                        className="h-[150px] w-[150px] rounded-full"
                        height={150}
                        width={150}
                        src={team.image_url}
                        alt="programImage"
                        style={{objectFit: "cover"}}
                        priority
                    />
                )}
                <div className="flex flex-col w-full">
                    <p className="text-primaryText text-2xl font-bold">{team.name}</p>
                    <p className="text-secondaryText text-base">{team.description}</p>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3">
                <JoinTeamButton isJoined={isJoined} teamId={team.id} />
            </div>
            <div className="flex flex-col gap-2 sm:gap-5">
                <p className="w-full text-foreground text-2xl font-bold">Programs</p>
                <ProgramList isCreator={false} programs={programs} />
            </div>
        </div>
    )
}
 
export default Team;