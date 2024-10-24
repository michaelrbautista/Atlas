"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tables } from "../../../../database.types";
import EditTeamForm from "../Forms/EditTeamForm";

const EditTeamButton = ({
    team,
    updateTeam
}: {
    team: Tables<"teams">,
    updateTeam: (program: Tables<"teams">) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button variant="secondary" size="full">
                    Edit Team
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
                <SheetHeader>
                    <SheetTitle>Edit Team</SheetTitle>
                    <SheetDescription hidden></SheetDescription>
                </SheetHeader>
                <EditTeamForm team={team} updateTeam={updateTeam} setIsOpen={setIsOpen} />
            </SheetContent>
        </Sheet>
    );
}
 
export default EditTeamButton;