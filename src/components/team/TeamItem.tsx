import Image from "next/image";
import Link from "next/link";
import { Tables } from "../../../database.types";
import { Users } from "lucide-react";
import { Separator } from "../ui/separator";
import { getTeam } from "@/server-actions/team";

const TeamItem = async ({
    team,
    teamId
}: {
    team?: Tables<"teams">,
    teamId?: string
}) => {

    let fetchedTeam: Tables<"teams">

    if (!team && teamId) {
        fetchedTeam = await getTeam(teamId)
    } else {
        fetchedTeam = team!
    }
    
    return (
        <div className="flex flex-col gap-5 pb-5">
            <Separator />
            <Link href={`team/${fetchedTeam.id}`}>
                <div className="flex flex-row h-full gap-5">
                    {fetchedTeam.image_url ? (
                        <Image
                            className="h-[80px] w-[80px] rounded-full"
                            height={80}
                            width={80}
                            src={fetchedTeam.image_url}
                            alt="teamImage"
                            style={{objectFit: "cover"}}
                            priority
                        />
                    ) : (
                        <div className="h-[80px] w-[80px] rounded-full bg-systemGray5 flex items-center justify-center">
                            <Users className="text-secondaryText" />
                        </div>
                    )}
                    <div className="flex flex-col items-start h-full">
                        <h1 className="text-primaryText font-bold text-xl">{fetchedTeam.name}</h1>
                        <h1 className="text-secondaryText font-medium text-sm line-clamp-2">{fetchedTeam.description}</h1>
                    </div>
                </div>
            </Link>
        </div>
    )
};

export default TeamItem;