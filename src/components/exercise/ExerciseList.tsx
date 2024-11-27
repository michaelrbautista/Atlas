import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { FetchedExercise } from "@/server-actions/fetch-types"

const ExerciseList = ({
    exercises
}: {
    exercises: FetchedExercise[]
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
                        <Link href={`/exercise/${exercise.id}`} key={exercise.id} className="bg-systemGray5 flex flex-row w-full justify-between items-center p-3 rounded-lg">
                            <div className="">
                                <p className="text-primaryText font-bold">{exercise.exercises?.title}</p>
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