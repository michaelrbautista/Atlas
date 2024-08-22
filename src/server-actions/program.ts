"use server";

import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createProgram(formData: FormData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "Couldn't get user."
        }
    }

    const image = formData.get("image") as File;

    if (!image) {
        return {
            error: "Couldn't get program image from form data."
        }
    }

    const imageExt = image.name.split(".").pop();
    let date = new Date()
    const imageName = `/${user.id}/${date.toISOString()}.${imageExt}`

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

    // Get public url for image
    const { data: storageUrl } = supabase
        .storage
        .from("program_images")
        .getPublicUrl(storageData.fullPath);

    if (!storageUrl) {
        return {
            error: "Couldn't get public image url from storage."
        }
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const weeks = formData.get("weeks") as string;

    if (!title || !description || !price || !weeks) {
        return {
            error: "Couldn't get form data."
        }
    }

    // Add to programs
    const { data: programData, error: programError } = await supabase
        .from("programs")
        .insert({
            title: title,
            description: description,
            price: price,
            currency: "usd",
            weeks: Number(weeks),
            image_path: storageData.fullPath,
            image_url: storageUrl.publicUrl
        })
        .select()
        .single()

    if (programError && !programData) {
        return {
            error: programError.message
        }
    }

    return redirect(`program/${programData.id}`);
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
