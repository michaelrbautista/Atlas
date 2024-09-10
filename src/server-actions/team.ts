"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getAllTeams() {
    const supabase = createClient();

    const { data } = await supabase
        .from("teams")
        .select()

    if (data) {
        return data
    }
}

export async function redirectToCreateTeam() {
    return redirect("/creator/team/create");
}

// Need to add file as parameter
export async function createTeam(formData: FormData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "Couldn't get user."
        }
    }

    let newTeam: any;

    const image = formData.get("image") as File;

    if (image) {
        const imageExt = image.name.split(".").pop();
        let date = new Date()
        const imageName = `/${user.id}/${date.toISOString()}.${imageExt}`

        // Add image to storage
        const { data: storageData, error: storageError } = await supabase
            .storage
            .from("team_images")
            .upload(imageName, image, {
                cacheControl: '3600',
                upsert: false
            });

        if (storageError && !storageData) {
            return {
                error: storageError.message
            }
        }

        // Get public url for image
        const { data: storageUrl } = supabase
            .storage
            .from("team_images")
            .getPublicUrl(storageData.path);

        if (!storageUrl) {
            return {
                error: "Couldn't get public image url from storage."
            }
        }

        newTeam = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            image_url: storageUrl.publicUrl,
            image_path: storageData.path
        }
    } else {
        newTeam = {
            name: formData.get("name") as string,
            description: formData.get("description") as string
        }
    }

    // Save team to database
    const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert(newTeam)
        .select()
        .single()

    
    if (teamError && !teamData) {
        return {
            error: teamError.message
        }
    }

    // Update user team_id
    const { error: userError } = await supabase
        .from("users")
        .update({
            team_id: teamData.id
        })
        .eq("id", user.id)

    if (userError) {
        return {
            error: userError.message
        }
    }

    return redirect("/creator/team");
}
