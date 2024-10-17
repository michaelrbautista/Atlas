"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Tables } from "../../database.types";

export async function leaveTeam(teamId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "Couldn't get current user."
        }
    }

    // Leave team
    const response = await supabase
        .from("joined_teams")
        .delete()
        .eq("user_id", user.id)
        .eq("team_id", teamId)

    if (response.error) {
        return {
            error: response.error
        }
    }
}

export async function joinTeam(teamId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "Couldn't get current user."
        }
    }

    // Join team
    const { data: teamData, error: teamError } = await supabase
        .from("joined_teams")
        .insert({
            user_id: user.id,
            team_id: teamId,
            tier: "free"
        })
        .select()
        .single()

    if (teamError && !teamData) {
        return {
            error: teamError.message
        }
    }

    return {
        data: teamData
    }
}

export async function editTeam(team: Tables<"teams">, formData: FormData) {
    const supabase = createClient();

    const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select()
        .eq("id", team.id)
        .single()

    if (teamError && !teamData) {
        return {
            error: teamError.message
        }
    }

    let newTeam: any;

    const image = formData.get("image") as File;

    if (image) {
        let imagePath;
        let imageUrl;

        if (team.image_path) {
            const { data: storageData, error: storageError } = await supabase
                .storage
                .from("team_images")
                .update(team.image_path, image, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (storageError && !storageData) {
                return {
                    error: storageError.message
                }
            }

            imagePath = team.image_path;

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

            imageUrl = storageUrl.publicUrl;
        } else {
            const imageExt = image.name.split(".").pop();
            let date = new Date()
            const imageName = `/${team.id}/${date.toISOString()}.${imageExt}`

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

            imagePath = storageData.path;

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

            imageUrl = storageUrl;
        }

        newTeam = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            image_url: imageUrl,
            image_path: imagePath
        }
    } else {
        newTeam = {
            name: formData.get("name") as string,
            description: formData.get("description") as string
        }
    }

    // Edit program
    const { data: updatedTeamData, error: updatedTeamError } = await supabase
        .from("teams")
        .update(newTeam)
        .eq("id", team.id)
        .select()
        .single()

    if (updatedTeamError && !updatedTeamData) {
        return {
            error: updatedTeamError.message
        }
    }

    return {
        data: updatedTeamData
    }
}

export async function copyTeamUrl(teamId: string) {
    if (process.env.NODE_ENV === "production") {
        return `${process.env.LIVE_URL}/team/${teamId}`
    } else {
        return `${process.env.TEST_URL}/team/${teamId}`
    }
}

export async function getAllTeams() {
    const supabase = createClient();

    if (process.env.NODE_ENV === "production") {
        const { data, error } = await supabase
            .from("teams")
            .select()
            .neq("id", "cd44e7f8-c584-4af3-abd2-870aa3fbc1be")

        if (error && !data) {
            return {
                error: error.message
            }
        }

        return {
            data: data
        }
    } else {
        const { data, error } = await supabase
            .from("teams")
            .select()

        if (error && !data) {
            return {
                error: error.message
            }
        }

        return {
            data: data
        }
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
