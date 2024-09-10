"use client";

import { Button, buttonVariants } from "../ui/button";
import { redirectToCreateTeam } from "@/server-actions/team";

const createTeamClient = () => {
    redirectToCreateTeam();
}

const CreateTeamSidebarButton = () => {
    return ( 
        <Button onClick={createTeamClient} className={buttonVariants({ variant:"secondary", size:"full"})}>Create a team</Button>
     );
}
 
export default CreateTeamSidebarButton;
