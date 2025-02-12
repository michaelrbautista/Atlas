import { Button } from "@/components/ui/button"
import { subscribeForFree } from "@/server-actions/subscription";
import { Check } from "lucide-react";

const FreeSubscriptionItem = ({
    isSubscribed,
    subscriber,
    subscribed_to,
    subscribed_to_username
}: {
    isSubscribed: boolean,
    subscriber: string,
    subscribed_to: string,
    subscribed_to_username: string
}) => {
    return (
        <div className="flex flex-col gap-5 p-5 justify-between w-full sm:max-w-[250px] min-h-[300px] sm:h-full shrink-0 border-[1px] bg-systemBackground border-systemGray5 rounded-lg">
            <div className="flex flex-col gap-5">
                <div className="px-5 py-[10px] w-fit rounded-full bg-systemGray6 border-[1px] border-systemGray3">
                    <h4 className="text-sm text-secondaryText">Free</h4>
                </div>
                <h3 className="font-bold">Free</h3>
                <div className="flex flex-row gap-2">
                    <Check color="gray" size={20} className="shrink-0" />
                    <h4 className="text-sm text-secondaryText">Access to free content</h4>
                </div>
            </div>
            {isSubscribed ? (
                <Button
                    variant="disabled"
                    size="full"
                >
                    Subscribed
                </Button>
            ) : (
                <Button
                    variant="systemBlue"
                    size="full"
                    onClick={() => {
                        subscribeForFree(subscriber, subscribed_to, subscribed_to_username);
                    }}
                >
                    Select
                </Button>
            )}
        </div>
    )
}

export default FreeSubscriptionItem