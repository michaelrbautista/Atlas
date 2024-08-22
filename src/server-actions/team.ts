"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getTeamPrograms(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('programs')
        .select()
        .eq("created_by", userId)

    if (error && !data) {
        return {
            error: error.message
        }
    } else {
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

    // Get image file from form data
    const image = formData.get("image") as File;

    if (!image) {
        console.log("Couldn't get team image from form data.");
        return
    }

    const imageExt = image.name.split(".").pop();
    let date = new Date()
    const imageName = `/${user.id}/${date.toISOString()}.${imageExt}`

    // Save image to storage
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
        .getPublicUrl(storageData.fullPath);

    if (!storageUrl) {
        return {
            error: "Couldn't get public image url from storage."
        }
    }

    const name = formData.get("name");
    const description = formData.get("description");

    if (!name || !description) {
        console.log("Couldn't get form data.");
        return
    }

    // Save team to database
    const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({
            name: name.toString(),
            description: description.toString(),
            image_path: storageData.fullPath,
            image_url: storageUrl.publicUrl
        })
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
