import Link from "next/link"
import { Tables } from "../../../../database.types"
import { ChevronRight } from "lucide-react"

const WorkoutList = ({
    workouts
}: {
    workouts: Tables<"workouts">[]
}) => {
    return (
        <div className="flex flex-col py-2 gap-3">
            {workouts.length == 0 ? (
                <div className="bg-systemGray6 flex flex-row w-full justify-between items-center p-3 rounded-lg">
                    <div className="">
                        <p className="text-secondaryText">No workouts</p>
                    </div>
                </div>
            ) : 
                workouts?.map((workout) => {
                    return (
                        <Link href={`/creator/workout/${workout.id}`} key={workout.id} className="bg-systemGray5 flex flex-row w-full justify-between items-center p-3 rounded-lg">
                            <div className="">
                                <p className="text-primaryText font-bold">{workout.title}</p>
                                <p className="text-secondaryText">{workout.description}</p>
                            </div>
                            <ChevronRight />
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default WorkoutList