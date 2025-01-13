"use client";

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Tables } from "../../../../database.types";

const UnsubscribeButton = ({
    connectedAccountId,
    subscriptionId,
    setSubscription
}: {
    connectedAccountId: string,
    subscriptionId: string,
    setSubscription: () => void
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const unsubscribe = useCallback((connectedAccountId: string, subscriptionId: string) => {
        return fetch("/api/cancel-subscription", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                connectedAccountId: connectedAccountId,
                subscriptionId: subscriptionId
            })
        })
        .then((res) => res.json())
        .then((data) => data.subscriptionId);
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="disabled">Unsubscribe</Button>
            </DialogTrigger>
            <DialogContent className="bg-background max-w-96 sm:max-w-md">
                <DialogTitle hidden />
                <DialogDescription className="text-primaryText font-medium">Are you sure you want to unsubscribe?</DialogDescription>
                <div className="flex flex-col gap-3 pt-5">
                    <Button
                        variant="secondary"
                        disabled={isLoading}
                        onClick={async () => {
                            setIsLoading(true);
                            await unsubscribe(connectedAccountId, subscriptionId);
                            setSubscription();
                            setIsOpen(false);
                        }}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {!isLoading && "Yes"}
                    </Button>
                    <Button
                        variant="systemBlue"
                        onClick={() => {
                            setIsOpen(false);
                        }}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default UnsubscribeButton