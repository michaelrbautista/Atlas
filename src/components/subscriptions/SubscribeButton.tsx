"use client";

import { redirectToSubscribe } from "@/server-actions/subscription";
import { Button } from "../ui/button";

const SubscribeButton = ({
    username
}: {
    username: string
}) => {
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
export default SubscribeButton