import { cn } from "@/lib/utils"
import Day from "./Day"
import { Tables } from "../../../../database.types"

const Week = ({
    programId,
    workouts,
    week,
    disabled,
    isCreator
}: {
    programId: string,
    workouts: Tables<"workouts">[]
    week: number,
    disabled: boolean,
    isCreator: boolean
}) => {

    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ]

    return (
        <div className="flex flex-row min-h-48 border-t-[1px] resize-none">
            <div className="flex h-full min-w-10 items-center justify-center border-r-[1px]">
                <p className={cn("text-sm font-semibold", disabled ? "text-systemGray4" : "text-secondaryText")}>{week}</p>
            </div>
            {days.map((day) => {
                return (
                    <Day
                        programId={programId}
                        week={week}
                        day={day}
                        workouts={workouts.filter((workout) => workout.day == day)}
                        disabled={disabled}
                        isCreator={isCreator}
                        key={day}
                    />
                )
            })}
        </div>
    )
}
export default Week