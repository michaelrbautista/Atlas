import SubscriptionList from "@/components/subscriptions/SubscriptionList"


const Page = async () => {
    return (
        <div className="h-full w-full max-w-xl px-5 py-20 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-2xl sm:text-3xl font-bold">Subscriptions</p>
            </div>
            <SubscriptionList />
        </div>
    )
}

export default Page