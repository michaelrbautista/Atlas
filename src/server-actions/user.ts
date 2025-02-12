"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Tables } from "../../database.types";

export const getUserFromUsername = async (username: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("users")
        .select()
        .eq("username", username)
        .single()

    if (error && !data) {
        console.log(error)
        return {
            error: error
        }
    }

    return {
        data: data
    }
}

export const checkIfSubscribed = async (creatorId: string) => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log("Couldn't get current user.");
        return
    }

    const { data, error } = await supabase
        .from("subscriptions")
        .select()
        .eq("subscriber", user.id)
        .eq("subscribed_to", creatorId)
        .eq("is_active", true)

    if (error && !data) {
        console.log(error)
        throw new Error(error.message)
    }

    if (data.length > 0) {
        if (data[0].is_active) {
            return true
        }
    } else {
        return false
    }
}

export const getCurrentUser = async () => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Couldn't get current user.");
    }

    const { data: userData, error: userError } = await supabase
        .from("users")
        .select()
        .eq("id", user.id)
        .single()

    if (userError && !userData) {
        throw new Error(userError.message);
    }

    return userData
}

export const redirectToBecomeCreator = () => {
    return redirect("/creator/onboard");
}

export const redirectToProfile = (username: string) => {
    return redirect(`/${username}`)
}

export const redirectToEditProfile = () => {
    return redirect("/profile/edit");
}

export const editUser = async (oldUser: Tables<"users">, formData: FormData) => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "Couldn't get user from auth."
        }
    }

    const { data: userData, error: userError } = await supabase
        .from("users")
        .select()
        .eq("id", user.id)
        .single()

    if (userError && !userData) {
        return {
            error: "Couldn't get user from database."
        }
    }

    let newUser: any;

    const image = formData.get("profilePicture") as File;

    if (image) {
        let profilePicturePath;
        let profilePictureUrl;

        if (oldUser.profile_picture_path) {
            const { data: storageData, error: storageError } = await supabase
                .storage
                .from("profile_pictures")
                .update(oldUser.profile_picture_path, image, {
                    upsert: true
                });

            if (storageError && !storageData) {
                return {
                    error: storageError.message
                }
            }

            profilePictureUrl = oldUser.profile_picture_path;

            // Get public url for image
            const { data: storageUrl } = supabase
                .storage
                .from("profile_pictures")
                .getPublicUrl(storageData.path);

            if (!storageUrl) {
                return {
                    error: "Couldn't get public image url from storage."
                }
            }

            profilePictureUrl = storageUrl.publicUrl;
        } else {
            const imageExt = image.name.split(".").pop();
            let date = new Date()
            const imageName = `/${user.id}/${date.toISOString()}.${imageExt}`

            // Add image to storage
            const { data: storageData, error: storageError } = await supabase
                .storage
                .from("profile_pictures")
                .upload(imageName, image, {
                    upsert: false
                });

            if (storageError && !storageData) {
                return {
                    error: storageError.message
                }
            }

            profilePicturePath = storageData.path;

            // Get public url for image
            const { data: storageUrl } = supabase
                .storage
                .from("profile_pictures")
                .getPublicUrl(storageData.path);

            if (!storageUrl) {
                return {
                    error: "Couldn't get public image url from storage."
                }
            }

            profilePictureUrl = storageUrl.publicUrl;
        }

        newUser = {
            full_name: formData.get("fullName") as string,
            username: formData.get("username") as string,
            bio: formData.get("bio") as string,
            profile_picture_url: profilePictureUrl,
            profile_picture_path: profilePicturePath
        }
    } else {
        newUser = {
            full_name: formData.get("fullName") as string,
            username: formData.get("username") as string,
            bio: formData.get("bio") as string,
        }
    }

    // Edit program
    const { data: updatedUserData, error: updatedUserError } = await supabase
        .from("users")
        .update(newUser)
        .eq("id", user.id)
        .select()
        .single()

    if (updatedUserError && !updatedUserData) {
        if (updatedUserError.code === "23505") {
            return {
                error: "Username is already taken."
            }
        } else {
            return {
                error: updatedUserError.message
            }
        }
    }

    return {
        data: updatedUserData
    }
}

export const getAllUsers = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("users")
        .select()
        .neq("stripe_price_id", null)
        // .neq("id", "e4d6f88c-d8c3-4a01-98d6-b5d56a366491")

    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export const getUser = async (userId: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", userId)
        .single()

    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}
