"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useState } from "react";

const PlayExerciseVideoButton = ({
    videoUrl
}: {
    videoUrl: string
}) => {
    const [viewVideoIsOpen, setViewVideoIsOpen] = useState(false);

    return (
        <Dialog open={viewVideoIsOpen} onOpenChange={setViewVideoIsOpen}>
            <Button onClick={() => {setViewVideoIsOpen(true)}} variant="secondary">
                Play Video
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle hidden></DialogTitle>
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                <div className="object-fill h-full flex items-center justify-center">
                    <video controls className="rounded-lg">
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default PlayExerciseVideoButton