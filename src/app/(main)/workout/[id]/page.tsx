import { Loader2 } from "lucide-react";
import ExerciseList from "@/components/user/exercise/ExerciseList";
import { getProgramWorkout } from "@/server-actions/workout";

const Workout = async ({ 
    params
}: {
    params: { id: string }
}) => {
    
    // Get workout
    const workout = await getProgramWorkout(params.id);

    return (
        <div className="flex flex-col w-full sm:max-w-lg px-5 py-20 sm:py-10 gap-3 sm:gap-10">
            <div>
                <p className="text-primaryText text-3xl font-bold">{workout?.data?.title}</p>
                <p className="text-primaryText py-2">{workout?.data?.description}</p>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                    <p className="text-foreground text-xl sm:text-2xl font-bold">Exercises</p>
                </div>
                <ExerciseList exercises={workout.data?.workout_exercises!} />
            </div>
        </div>
    )
}
export default Workout