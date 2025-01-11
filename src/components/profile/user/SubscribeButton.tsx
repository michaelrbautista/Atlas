"use client";

import { redirectToSubscribe } from "@/server-actions/user";
import { Button } from "../../ui/button";

const SubscribeButton = ({
    username,
    isSubscribed
}: {
    username: string,
    isSubscribed: boolean
}) => {
    if (isSubscribed) {
        return (
            <Button variant="secondary" size="full" className="text-secondaryText">
                Subscribed
            </Button>
        )
    } else {
        return (
            <Button
                variant="systemBlue"
                size="full"
                onClick={() => {
                    redirectToSubscribe(username);
                }}
            >
                Subscribe
            </Button>
        )
    }
}
export default SubscribeButton