import { cn } from "@/lib/utils"
import { Dispatch, SetStateAction, memo } from "react";

const MobileDay = ({
    week,
    day,
    disabled,
    isSelected,
    setSelectedDay
}: {
    week: number,
    day: string,
    disabled: boolean,
    isSelected: boolean,
    setSelectedDay: Dispatch<SetStateAction<{
        week: number;
        day: string;
    }>>
}) => {
    return (
        <div 
            className={cn("flex items-center justify-center rounded-full h-10 w-10 p-2 cursor-pointer",
                isSelected ? "bg-systemGray3" : "bg-systemBackground")}
            onClick={() => {setSelectedDay({ week: week, day: day})}}
        >
            <p
                className={cn("text-base font-semibold p-2 text-center",
                disabled ? "text-systemGray4" : "text-secondaryText",
                isSelected && "text-primaryText")}
            >
                {day.charAt(0).toUpperCase()}
            </p>
        </div>
    )
}
export default memo(MobileDay)