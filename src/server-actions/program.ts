"use server";

import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Tables } from "../../database.types";

export async function redirectToCheckoutUrl(url: string) {
    return redirect(url);
}

export async function getPurchasedPrograms(userId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "Couldn't get user from auth."
        }
    }

    const { data: purchaseData, error: purchaseError } = await supabase
        .from("purchased_programs")
        .select("id")
        .eq("purchased_by", user.id)

    if (purchaseError && !purchaseData) {
        return {
            error: "Couldn't get user from database."
        }
    }

    return purchaseData
}

export async function deleteProgram(programId: string) {
    const supabase = createClient();

    const response = await supabase
        .from("programs")
        .delete()
        .eq("id", programId)

    if (response.error) {
        return {
            error: "Couldn't delete program."
        }
    }
}

export async function editProgram(program: Tables<"programs">, formData: FormData) {
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

    let newProgram: any;

    const image = formData.get("image") as File;

    if (image) {
        let imagePath;
        let imageUrl;

        if (program.image_path) {
            const { data: storageData, error: storageError } = await supabase
                .storage
                .from("program_images")
                .update(program.image_path, image, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (storageError && !storageData) {
                return {
                    error: storageError.message
                }
            }

            imagePath = program.image_path;

            // Get public url for image
            const { data: storageUrl } = supabase
                .storage
                .from("program_images")
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
            const imageName = `/${userData.team_id}/${date.toISOString()}.${imageExt}`

            // Add image to storage
            const { data: storageData, error: storageError } = await supabase
                .storage
                .from("program_images")
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
                .from("program_images")
                .getPublicUrl(storageData.path);

            if (!storageUrl) {
                return {
                    error: "Couldn't get public image url from storage."
                }
            }

            imageUrl = storageUrl;
        }

        newProgram = {
            title: formData.get("title") as string,
            weeks: parseInt(formData.get("weeks") as string),
            price: parseFloat(formData.get("price") as string),
            description: formData.get("description") as string,
            image_url: imageUrl,
            image_path: imagePath
        }
    } else {
        newProgram = {
            title: formData.get("title") as string,
            weeks: parseInt(formData.get("weeks") as string),
            price: parseFloat(formData.get("price") as string),
            description: formData.get("description") as string
        }
    }

    // Edit program
    const { data: programData, error: programError } = await supabase
        .from("programs")
        .update(newProgram)
        .eq("id", program.id)
        .select()
        .single()

    if (programError && !programData) {
        return {
            error: programError.message
        }
    }

    return {
        data: programData
    }
}

export async function createProgram(formData: FormData) {
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

    let newProgram: any;

    const image = formData.get("image") as File;

    if (image) {
        const imageExt = image.name.split(".").pop();
        let date = new Date()
        const imageName = `/${userData.team_id}/${date.toISOString()}.${imageExt}`

        // Update image
        const { data: storageData, error: storageError } = await supabase
            .storage
            .from("program_images")
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
            .from("program_images")
            .getPublicUrl(storageData.path);

        if (!storageUrl) {
            return {
                error: "Couldn't get public image url from storage."
            }
        }

        newProgram = {
            title: formData.get("title") as string,
            weeks: parseInt(formData.get("weeks") as string),
            price: parseFloat(formData.get("price") as string),
            description: formData.get("description") as string,
            team_id: userData.team_id,
            image_url: storageUrl.publicUrl,
            image_path: storageData.path
        }
    } else {
        newProgram = {
            title: formData.get("title") as string,
            weeks: parseInt(formData.get("weeks") as string),
            price: parseFloat(formData.get("price") as string),
            description: formData.get("description") as string,
            team_id: userData.team_id
        }
    }

    // Add to programs
    const { data: programData, error: programError } = await supabase
    .from("programs")
    .insert(newProgram)
    .select()
    .single()

    if (programError && !programData) {
        return {
            error: programError.message
        }
    }

    return {
        data: programData
    }
}

export const getAllPrograms = cache(async () => {
    const supabase = createClient();

    const { data } = await supabase
        .from('programs')
        .select()

    if (data) {
        return data
    }
})

export const getProgram = cache(async (programId: string) => {
    const supabase = createClient();

    const { data } = await supabase
        .from("programs")
        .select()
        .eq("id", programId)
        .single()
    
    if (data) {
        return data
    }
})