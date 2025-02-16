"use client";

import { Button } from "../ui/button";
import { redirectToEditProfile } from "@/server-actions/user";

const EditProfileButton = () => {
    return (
        <Button onClick={() => {redirectToEditProfile()}} variant="secondary" size="sm">
            Edit profile
        </Button>
    );
}
 
export default EditProfileButton;