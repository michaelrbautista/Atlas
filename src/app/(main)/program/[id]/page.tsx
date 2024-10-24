import Image from "next/image";
import { Dumbbell } from "lucide-react";
import PurchaseProgramButton from "@/components/program/Buttons/PurchaseProgramButton";
import MobileCalendar from "@/components/program/MobileCalendar/MobileCalendar";
import { checkIfProgramIsPurchased, getProgram } from "@/server-actions/program";
import { getUser } from "@/server-actions/user";
import LoggedOutPurchaseButton from "@/components/program/Buttons/LoggedOutPurchaseButton";

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
            <div className="flex flex-col items-center gap-5 w-full">
                {(!program.image_url) ? (
                    // Replace with placeholder image
                    <div className="bg-systemGray5 shrink-0 h-[250px] w-[400px] rounded-xl flex items-center justify-center">
                        <Dumbbell className="text-secondaryText" />
                    </div>
                ) : (
                    <Image
                        className="h-[250px] w-[400px] rounded-xl"
                        height={250}
                        width={400}
                        src={program.image_url}
                        alt="programImage"
                        style={{objectFit: "cover"}}
                        priority
                    />
                )}
                <div className="flex flex-col w-full">
                    <p className="text-primaryText text-2xl font-bold">{program?.title}</p>
                    <div className="flex flex-col gap-2">
                        <p className="text-secondaryText text-lg font-semibold">@{creator?.username}</p>
                        <p className="text-primaryText text-sm">{program?.description}</p>
                    </div>
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
