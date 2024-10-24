import Image from "next/image";
import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { Separator } from "../ui/separator";
import { getProgram } from "@/server-actions/program";
import { getTeam } from "@/server-actions/team";

const ProgramItem = async ({
    isCreator,
    programId
}: {
    isCreator: boolean,
    programId: string
}) => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    // Get program
    const program = await getProgram(programId);

    // Get team
    const team = await getTeam(program?.team_id);

    return (
        <div className="flex flex-col gap-5 pb-5">
            <Separator />
            <Link href={`/program/${programId}`} className="flex flex-col md:flex-row gap-5">
                {program.image_url ? (
                    <Image
                        className="h-[120px] w-[200px] rounded-xl my-auto shrink-0"
                        height={120}
                        width={200}
                        src={program.image_url}
                        alt="programImage"
                        style={{objectFit: "cover"}}
                        priority
                    />
                ) : (
                    <div className="bg-systemGray5 shrink-0 h-[120px] w-[200px] rounded-xl flex items-center justify-center">
                        <Dumbbell className="text-secondaryText" />
                    </div>
                )}
                <div className="flex flex-col w-full justify-start">
                    <h1 className="text-primaryText font-bold text-md">{program.title}</h1>
                    <h1 className="text-secondaryText font-bold text-sm">{team?.name}</h1>
                    <h1 className="text-secondaryText font-bold text-sm">{formatter.format(program.price)}</h1>
                    <h1 className="text-secondaryText font-medium text-sm line-clamp-3">{program.description}</h1>
                </div>
            </Link>
        </div>
    )
};

export default ProgramItem;