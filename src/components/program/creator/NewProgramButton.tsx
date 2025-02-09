"use client";

import { Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { memo, useState } from "react";
import NewProgramForm from "./NewProgramForm";
import { Tables } from "../../../../database.types";

const NewProgramButton = ({
    addProgram
}: {
    addProgram: (program: Tables<"programs">) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="hidden sm:flex" asChild>
                <Button variant="systemBlue">New program</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Program</DialogTitle>
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                <NewProgramForm setIsOpen={setIsOpen} addProgram={addProgram}/>
            </DialogContent>
        </Dialog>
    );
}
 
export default memo(NewProgramButton);