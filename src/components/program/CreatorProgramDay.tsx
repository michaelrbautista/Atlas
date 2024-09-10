"use client";

import { Tables } from "../../../database.types";
import WorkoutList from "../workout/WorkoutList";
import AddWorkoutButton from "../workout/AddWorkoutButton";

const CreatorProgramDay = ({
    programId,
    week,
    day,
    workouts
}: {
    programId: string,
    week: number
    day: string,
    workouts: Tables<"workouts">[]
}) => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
                <p className="text-primaryText font-bold text-xl">{day.charAt(0).toUpperCase() + day.slice(1)}</p>
                <AddWorkoutButton programId={programId} week={week} day={day} />
            </div>
            <WorkoutList workouts={workouts}/>
        </div>
    )
}

export default CreatorProgramDay