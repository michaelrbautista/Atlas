import { Button } from "@/components/ui/button"
import { Check } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const SubscriptionItem = ({
    subscriptionPrice,
    setPlan
}: {
    subscriptionPrice: number,
    setPlan: Dispatch<SetStateAction<string>>
}) => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    return (
        <div className="flex flex-col gap-5 p-5 justify-between w-full sm:max-w-[250px] min-h-[300px] sm:h-full shrink-0 border-[1px] bg-systemBackground border-systemGray5 rounded-lg">
            <div className="flex flex-col gap-5">
                <div className="px-5 py-[10px] w-fit rounded-full bg-systemGray6 border-[1px] border-systemGray3">
                    <h4 className="text-sm text-secondaryText">Monthly</h4>
                </div>
                <h3 className="font-bold">{formatter.format(subscriptionPrice)}</h3>
                <div className="flex flex-col gap-2 bg-slate">
                    <div className="flex flex-row gap-2">
                        <Check color="gray" size={20} className="shrink-0" />
                        <h4 className="text-sm text-secondaryText">Access to all content</h4>
                    </div>
                    <div className="flex flex-col pt-5 gap-2">
                        <h4 className="text-xs text-secondaryText">Coming soon...</h4>
                        <div className="flex flex-row gap-2">
                            <Check color="gray" size={20} className="shrink-0" />
                            <h4 className="text-sm text-secondaryText">Access to community and chat</h4>
                        </div>
                    </div>
                </div>
            </div>
            <Button
                variant="systemBlue"
                size="full"
                onClick={() => {
                    setPlan("monthly")
                }}
            >
                Select
            </Button>
        </div>
    )
}
export default SubscriptionItem