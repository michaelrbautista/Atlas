import { Loader2 } from "lucide-react";
import ExerciseList from "@/components/exercise/ExerciseList";
import { getWorkout, getWorkoutExercises } from "@/server-actions/workout";

const Workout = async ({ 
    params
}: {
    params: { id: string }
}) => {
    
    // Get workout
    const workout = await getWorkout(params.id);

    // Get workout exercises
    const exercises = await getWorkoutExercises(params.id);

    return (
        <div className="flex flex-col w-full sm:max-w-lg px-5 py-20 sm:py-10 gap-3 sm:gap-10">
            <div>
                <p className="text-primaryText text-3xl font-bold">{workout?.title}</p>
                <p className="text-primaryText py-2">{workout?.description}</p>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                    <p className="text-foreground text-xl sm:text-2xl font-bold">Exercises</p>
                </div>
                <ExerciseList exercises={exercises} />
            </div>
        </div>
    )
}
export default Workout