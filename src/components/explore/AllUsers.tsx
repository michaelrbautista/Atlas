import { getAllUsers } from "@/server-actions/user";
import UserItem from "../subscriptions/UserItem";

const AllUsers = async () => {
    const allUsers = await getAllUsers();

    return (
        <div className="relative w-full gap-5 pb-10 border-t-[1px]">
            {allUsers?.map((user) => {
                return (
                    <UserItem
                        fullName={user.full_name}
                        username={user.username}
                        bio={user.bio ?? undefined}
                        profilePictureUrl={user.profile_picture_url ?? undefined}
                        key={user.username}
                    />
                )
            })}
        </div>
    )
}

export default AllUsers