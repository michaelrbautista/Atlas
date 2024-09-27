import Link from "next/link"
import { Tables } from "../../../database.types"
import { ChevronRight } from "lucide-react"

const ExerciseList = ({
    exercises
}: {
    exercises: Tables<"workout_exercises">[]
}) => {
    return (
        <div className="flex flex-col py-2 gap-3">
            {exercises.length == 0 ? (
                <div className="bg-systemGray6 flex flex-row w-full justify-between items-center p-3 rounded-lg">
                    <div className="">
                        <p className="text-secondaryText">No exercises</p>
                    </div>
                </div>
            ) : 
                exercises?.map((exercise) => {
                    return (
                        // <ExerciseItem workoutExercise={exercise}/>
                        <Link href={`/creator/exercise/${exercise.id}`} key={exercise.id} className="bg-systemGray5 flex flex-row w-full justify-between items-center p-3 rounded-lg">
                            <div className="">
                                <p className="text-primaryText font-bold">{exercise.title}</p>
                                <p className="text-secondaryText">{exercise.sets} {exercise.sets == 1 ? "set" : "sets"}</p>
                                <p className="text-secondaryText">{exercise.reps} {exercise.reps == 1 ? "rep" : "reps"}</p>
                            </div>
                            <ChevronRight />
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default ExerciseList