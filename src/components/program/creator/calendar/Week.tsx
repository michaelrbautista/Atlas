"use client";

import { cn } from "@/lib/utils"
import Day from "./Day"
import { Tables } from "../../../../../database.types"
import { memo } from "react";

const Week = ({
    programId,
    workouts,
    week,
    disabled,
    addWorkout,
    removeWorkout
}: {
    programId: string,
    workouts: Tables<"program_workouts">[]
    week: number,
    disabled: boolean,
    addWorkout: (workout: Tables<"program_workouts">) => void,
    removeWorkout: (workoutId: string) => void
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
                        addWorkout={addWorkout}
                        removeWorkout={removeWorkout}
                        key={day}
                    />
                )
            })}
        </div>
    )
}
export default memo(Week)