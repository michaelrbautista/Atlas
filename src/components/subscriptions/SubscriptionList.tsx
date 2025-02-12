import { getAllSubscriptions } from "@/server-actions/subscription";
import UserItem from "./UserItem";

const SubscriptionList = async () => {
    const subscriptions = await getAllSubscriptions();

    return (
        <div className="relative w-full gap-5 pb-10 border-t-[1px]">
            {subscriptions?.map((subscription) => {
                if (subscription.subscribed_to) {
                    return (
                        <UserItem
                            fullName={subscription.subscribed_to?.full_name}
                            username={subscription.subscribed_to?.username}
                            bio={subscription.subscribed_to?.bio ?? undefined}
                            profilePictureUrl={subscription.subscribed_to?.profile_picture_url ?? undefined}
                            key={subscription.subscribed_to?.username}
                        />
                    )
                }
            })}
        </div>
  )
}
export default SubscriptionList