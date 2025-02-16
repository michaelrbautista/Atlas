import Image from "next/image";
import { Dumbbell } from "lucide-react";
import MobileCalendar from "@/components/program/user/calendar/MobileCalendar";
import { checkIfProgramIsPurchased, getProgram } from "@/server-actions/program";
import { checkIfSubscribed, getCurrentUser, getUser } from "@/server-actions/user";
import { InfoList } from "@/components/program/user/InfoList";
import { Separator } from "@/components/ui/separator";
import PurchaseProgramButton from "@/components/program/user/PurchaseProgramButton";

const Program = async ({ 
    params
}: {
    params: { id: string }
}) => {
    // Get program
    const program = await getProgram(params.id);

    // Get creator
    const creator = await getUser(program.created_by);

    // Get current user
    const { user, none } = await getCurrentUser();

    // Check if subscribed
    let isSubscribed = false;
    let isPurchased = false;

    if (user && !none) {
        if (program.created_by == user.id) {
            isSubscribed = true;
        } else if (program.created_by) {
            const checkSubscribed  = await checkIfSubscribed(program.created_by);
            if (checkSubscribed) {
                isSubscribed = checkSubscribed
            }


        } else {
            isSubscribed = false;
        }

        if (!isSubscribed) {
            const checkPurchase = await checkIfProgramIsPurchased(program.id);
            isPurchased = checkPurchase;
        }
    }

    const returnContentOrButton = () => {
        if (program.free || isSubscribed || isPurchased) {
            return (
                <div>
                    <Separator />
                    <MobileCalendar
                        programId={program.id}
                        weeks={program.weeks}
                        pages={program.weeks % 4 == 0 ? Math.floor(program.weeks / 4) : Math.floor(program.weeks / 4) + 1}
                    />
                </div>
            )
        } else if (!isSubscribed && program.price) {
            return (
                <PurchaseProgramButton
                    program={program}
                    creator={creator}
                />
            )
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
                        <div className="relative flex items-center w-[120px] h-[120px] shrink-0">
                            <Image
                                className="rounded-xl"
                                fill
                                src={program.image_url}
                                alt="programImage"
                                style={{objectFit: "cover"}}
                                priority
                            />
                        </div>
                    )}
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
                                info: `${program.weeks} ${program.weeks == 1 ? "week" : "weeks"}`
                            }
                        ] : [
                            {
                                header: "Duration",
                                info: `${program.weeks} ${program.weeks == 1 ? "week" : "weeks"}`
                            }
                        ]}
                    />
                </div>
                {returnContentOrButton()}
            </div>
        </div>
    )
}

export default Program;
