"use client";

import { Dispatch, SetStateAction } from "react"
import { Tables } from "../../../database.types"

const PostWorkout = ({
    workout
}: {
    workout: Tables<"workouts">
}) => {
    return (
        <div className="bg-systemGray5 flex flex-row w-full justify-between items-center p-3 rounded-lg">
            <div className="">
                <p className="text-primaryText font-bold">{workout.title}</p>
                <p className="text-secondaryText">{workout.description}</p>
            </div>
        </div>
    )
}
export default PostWorkout