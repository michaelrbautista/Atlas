import Image from "next/image";
import { Dumbbell } from "lucide-react";
import PurchaseProgramButton from "@/components/program/user/PurchaseProgramButton";
import MobileCalendar from "@/components/program/user/calendar/MobileCalendar";
import { checkIfProgramIsPurchased, getProgram } from "@/server-actions/program";
import { getUser } from "@/server-actions/user";
import LoggedOutPurchaseButton from "@/components/program/user/LoggedOutPurchaseButton";
import { BadgeList } from "@/components/program/user/BadgeList";
import { Button } from "@/components/ui/button";
import { InfoList } from "@/components/program/user/InfoList";
import { Separator } from "@/components/ui/separator";

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
    console.log(isPurchased)

    const programContentsComponent = () => {
        if (!isPurchased && program.free) {
            return (<Button className="" variant="systemBlue" size="sm">Save program</Button>)
        } else if (!isPurchased && !program.free) {
            return (<PurchaseProgramButton program={program} creator={creator}/>)
        }
    }

    return (
        <div className="flex flex-col w-full max-w-lg px-5 pt-10 pb-20 gap-10 sm:gap-10">
            <div className="flex flex-col gap-5">
                <div className="flex flex-row items-start justify-between gap-5 w-full">
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
                    {programContentsComponent()}
                </div>
                <div className="flex flex-col w-full h-full items-start justify-between">
                    <p className="text-primaryText text-lg font-bold">{program?.title}</p>
                    <p className="text-secondaryText font-semibold">@{creator?.username}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <InfoList
                        infoItems={program.description ? [
                            {
                                header: "Description",
                                info: program.description
                            },
                            {
                                header: "Duration",
                                info: `${program.weeks} weeks`
                            }
                        ] : [
                            {
                                header: "Duration",
                                info: `${program.weeks} weeks`
                            }
                        ]}
                    />
                </div>
                {(isPurchased || program?.free) && (
                    <div>
                        <Separator />
                        <MobileCalendar
                            programId={program.id}
                            weeks={program.weeks}
                            pages={Math.floor(program.weeks / 4) + 1}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Program;
