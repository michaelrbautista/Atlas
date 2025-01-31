import { cn } from "@/lib/utils"
import MobileDay from "./MobileDay"
import { Dispatch, SetStateAction } from "react"

const MobileWeek = ({
    week,
    disabled,
    selectedDay,
    setSelectedDay
}: {
    week: number,
    disabled: boolean,
    selectedDay: { week: number, day: string },
    setSelectedDay: Dispatch<SetStateAction<{
        week: number;
        day: string;
    }>>
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
        <div className="flex flex-row items-center resize-none">
            <div className="flex h-full min-w-5 items-center justify-center">
                <p className={cn("text-xs font-semibold", disabled ? "text-systemGray4" : "text-systemGray2")}>{week}</p>
            </div>
            <div className="flex flex-row gap-2">
                {days.map((day) => {
                    return (
                        <MobileDay
                            week={week}
                            day={day}
                            disabled={disabled}
                            isSelected={week == selectedDay.week && day == selectedDay.day}
                            setSelectedDay={setSelectedDay}
                            key={day}
                        />
                    )
                })}
            </div>
        </div>
    )
}
export default MobileWeek