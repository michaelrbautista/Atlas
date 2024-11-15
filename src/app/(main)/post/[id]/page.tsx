import { ChevronRight, Users } from "lucide-react"
import { Tables } from "../../../../../database.types"
import Image from "next/image"
import Link from "next/link"
import ProgramItem from "@/components/program/ProgramItem"
import { getPost } from "@/server-actions/post"
import { getUser } from "@/server-actions/user"
import { getProgram } from "@/server-actions/program"
import { getWorkout } from "@/server-actions/workout"

const Post = async ({
    params
}: {
    params: { id: string }
}) => {
    // Get post
    const post = await getPost(params.id);

    // Get user
    const user = await getUser(post.created_by);

    // Get program
    let program: Tables<"programs"> | null = null

    if (post.program_id) {
        const fetchedProgram = await getProgram(post.program_id);
        program = fetchedProgram;
    }

    // Get workout
    let workout: Tables<"workouts"> | null = null

    if (post.workout_id) {
        const fetchedWorkout = await getWorkout(post.workout_id);
        workout = fetchedWorkout;
    }

    return (
        <div className="h-full w-full max-w-xl px-5 sm:py-10">
            <div className="flex flex-row gap-5 p-5">
                {(!user?.profile_picture_url) ? (
                    // Replace with placeholder image
                    <div className="bg-systemGray5 shrink-0 h-[40px] w-[40px] rounded-full flex items-center justify-center">
                        <Users className="text-secondaryText h-4" />
                    </div>
                ) : (
                    <Image
                        className="h-[40px] w-[40px] rounded-full"
                        height={40}
                        width={40}
                        src={user.profile_picture_url}
                        alt="programImage"
                        style={{objectFit: "cover"}}
                        priority
                    />
                )}
                <div className="flex flex-col gap-2">
                    <p className="text-primaryText font-bold text-lg">{user?.full_name}</p>
                    <p className="text-primaryText font-normal text-base">{post?.text}</p>
                    {/* Workout or program reference */}
                    {workout && (
                        <Link href={`/workout/${workout.id}`} key={workout.id} className="bg-systemGray5 flex flex-row w-full justify-between items-center p-3 rounded-lg">
                            <div className="">
                                <p className="text-primaryText font-bold">{workout.title}</p>
                                <p className="text-secondaryText line-clamp-2">{workout.description}</p>
                            </div>
                            <ChevronRight />
                        </Link>
                    )}
                    {program && (
                        <ProgramItem
                            id={program.id}
                            title={program.title}
                            imageUrl={program.image_url ?? undefined}
                            price={program.price}
                            description={program.description ?? undefined}
                            userFullName={user.full_name}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
export default Post