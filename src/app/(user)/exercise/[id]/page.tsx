import { getProgramExercise } from "@/server-actions/exercise";

const Exercise = async ({ 
    params
}: {
    params: { id: string }
}) => {

    const exercise = await getProgramExercise(params.id);

    return (
        <div className="flex flex-col w-full sm:max-w-lg px-5 py-20 sm:py-10 gap-3 sm:gap-10">
            <div className="flex flex-col gap-5">
                {exercise.exercises?.video_url &&
                <div className="relative w-full aspect-video flex justify-center">
                    <div className="object-fill h-full w-52">
                        <video controls className="rounded-lg">
                            <source src={exercise.exercises?.video_url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
                }
                <div>
                    <p className="text-primaryText text-3xl font-bold">{exercise.exercises?.title}</p>
                    <p className="text-secondaryText">{exercise.sets} {exercise.sets == 1 ? "set" : "sets"}</p>
                    <p className="text-secondaryText">{exercise.reps} {exercise.reps == 1 ? "rep" : "reps"}</p>
                </div>
                <p className="text-primaryText py-2">{exercise.exercises?.instructions}</p>
            </div>
        </div>
    )
}

export default Exercise