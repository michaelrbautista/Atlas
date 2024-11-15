"use client";

import { Button } from "../ui/button";
import { redirectToEditProfile } from "@/server-actions/user";

const EditProfileButton = () => {
    return (
        <Button onClick={() => {redirectToEditProfile()}} variant="secondary" size="full">
            Edit Profile
        </Button>
    );
}
 
export default EditProfileButton;