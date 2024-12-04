import Image from "next/image";
import { Dumbbell } from "lucide-react";
import PurchaseProgramButton from "@/components/user/program/PurchaseProgramButton";
import MobileCalendar from "@/components/user/program/calendar/MobileCalendar";
import { checkIfProgramIsPurchased, getProgram } from "@/server-actions/program";
import { getUser } from "@/server-actions/user";
import LoggedOutPurchaseButton from "@/components/user/program/LoggedOutPurchaseButton";
import { BadgeList } from "@/components/user/program/BadgeList";

const Program = async ({ 
    params
}: {
    params: { id: string }
}) => {
    // Get program
    const program = await getProgram(params.id);

    // Get creator
    const creator = await getUser(program.created_by);

    // Check if program is purchased
    const isPurchased = await checkIfProgramIsPurchased(params.id);

    return (
        <div className="flex flex-col w-full max-w-lg px-5 pt-10 pb-20 gap-10 sm:gap-10">
            <div className="flex flex-col gap-5">
                <div className="flex flex-row items-start gap-5 w-full">
                    {(!program.image_url) ? (
                        // Replace with placeholder image
                        <div className="bg-systemGray5 shrink-0 h-[120px] w-[120px] rounded-xl flex items-center justify-center">
                            <Dumbbell className="text-secondaryText" />
                        </div>
                    ) : (
                        <Image
                            className="h-[120px] w-[120px] rounded-xl"
                            height={120}
                            width={120}
                            src={program.image_url}
                            alt="programImage"
                            style={{objectFit: "cover"}}
                            priority
                        />
                    )}
                    <div className="flex flex-col w-full">
                        <p className="text-primaryText text-xl font-bold">{program?.title}</p>
                        <div className="flex flex-col gap-2">
                            <p className="text-secondaryText font-semibold">@{creator?.username}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-primaryText text-sm">{program?.description}</p>
                    <BadgeList badges={[`${program.weeks.toString()} weeks`, program.private ? "Private" : "Public"]} />
                </div>
            </div>
            {!isPurchased ? (
                <PurchaseProgramButton program={program} creator={creator}/>
            ) : (
                <MobileCalendar
                    programId={program.id}
                    weeks={program.weeks}
                    pages={Math.floor(program.weeks / 4) + 1}
                />
            )}
        </div>
    )
}

export default Program;
