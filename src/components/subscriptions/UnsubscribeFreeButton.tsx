"use client";

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { redirectToSubscribe, unsubscribeFree } from "@/server-actions/subscription";
import { Loader2 } from "lucide-react";
import { memo, useState } from "react";

const UnsubscribeFreeButton = ({
    username,
    subscriber,
    subscribed_to,
    setSubscription
}: {
    username: string,
    subscriber: string,
    subscribed_to: string,
    setSubscription: () => void
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="disabled">Unsubscribe</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        className="w-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            redirectToSubscribe(username);
                        }}
                    >
                        Manage subscription
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="w-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                        }}
                    >
                        Unsubscribe
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle hidden/>
                    <DialogDescription className="text-primaryText font-medium">Are you sure you want to unsubscribe?</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 pt-5">
                    <Button
                        variant="secondary"
                        disabled={isLoading}
                        onClick={async () => {
                            setIsLoading(true);
                            // Unsubscribe
                            unsubscribeFree(subscriber, subscribed_to);
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

export default memo(UnsubscribeFreeButton)