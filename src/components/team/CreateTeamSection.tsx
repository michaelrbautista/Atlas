"use client";

import { Button, buttonVariants } from "../ui/button";
import CreateTeamButton from "./Buttons/CreateTeamButton";

interface CreateTeamButtonProps {
    paymentsEnabled: boolean
}

const CreateTeamSection = ({
    paymentsEnabled
}: CreateTeamButtonProps) => {
    if (paymentsEnabled) {
        return (
            <div className="flex flex-col gap-2 w-full">
                <p className="text-primaryText text-base font-medium">
                    3. Create a team
                </p>
                <CreateTeamButton></CreateTeamButton>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col gap-2 w-full">
                <p className="text-systemGray1 text-base font-medium">
                    3. Create a team
                </p>
                <Button className={buttonVariants({ variant: "disabled", size: "full"})} disabled>
                    Create a team
                </Button>
            </div>
        );
    }
}
 
export default CreateTeamSection;