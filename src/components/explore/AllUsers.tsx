import { getAllUsers } from "@/server-actions/user";
import UserItem from "./UserItem";

const AllUsers = async () => {
    const allUsers = await getAllUsers();

    return (
        <div className="relative w-full gap-5 pb-10 border-t-[1px]">
            {allUsers?.map((user) => {
                return (
                    <UserItem user={user} key={user.id} />
                )
            })}
        </div>
    )
}

export default AllUsers