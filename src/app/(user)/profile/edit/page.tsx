import EditProfileForm from "@/components/profile/EditProfileForm"
import { getCurrentUser } from "@/server-actions/user"

const page = async () => {

    const { user, none } = await getCurrentUser();

    if (none || !user) {
        throw new Error("Couldn't get current user.");
    } else {
        return (
            <div className="h-full w-full max-w-xl px-5 sm:py-10">
                <div className="flex justify-between items-center pb-5">
                    <p className="text-foreground text-3xl font-bold">Edit Profile</p>
                </div>
                <EditProfileForm user={user} />
            </div>
        )
    }
}
export default page