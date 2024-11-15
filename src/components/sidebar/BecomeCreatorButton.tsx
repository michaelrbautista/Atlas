"use client";

import { redirectToBecomeCreator } from "@/server-actions/user";
import { Button, buttonVariants } from "../ui/button";


const createTeamClient = () => {
    redirectToBecomeCreator();
}

const BecomeCreatorButton = () => {
    return ( 
        <Button onClick={createTeamClient} className={buttonVariants({ variant:"secondary", size:"full"})}>Become a creator</Button>
     );
}
 
export default BecomeCreatorButton;
