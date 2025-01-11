import EditProfileForm from "@/components/profile/creator/EditProfileForm"
import { getCurrentUser } from "@/server-actions/user"

const page = async () => {

    const user = await getCurrentUser();

    return (
        <div className="h-full w-full max-w-xl px-5 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-3xl font-bold">Edit Profile</p>
            </div>
            <EditProfileForm user={user} />
        </div>
    )
}
export default page