"use server";

import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Tables } from "../../database.types";

export async function getNewPrograms() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("programs")
        .select(`
            id,
            title,
            description,
            image_url,
            price,
            currency,
            weeks,
            free,
            private,
            created_by:users!programs_created_by_fkey(
                full_name
            )
        `)
        .eq("private", false)
        .order("created_at", { ascending: false })
    
    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export async function getCreatorsPrograms(userId: string, offset: number) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("programs")
        .select(`
            id,
            title,
            description,
            image_url,
            price,
            currency,
            weeks,
            free,
            private,
            created_by:users!programs_created_by_fkey(
                full_name
            )
        `)
        .eq("created_by", userId)
        .eq("private", false)
        .order("created_at", { ascending: false })
        .range(offset, offset + 9)
    
    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export async function checkIfProgramIsPurchased(programId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Couldn't get current user.")
    }

    const { data: programsData, error: programsError } = await supabase
        .from("purchased_programs")
        .select()
        .eq("program_id", programId)
        .eq("purchased_by", user.id)

    if (programsError && !programsData) {
        throw new Error(programsError.message)
    }

    if (programsData.length > 0) {
        return true
    } else {
        return false
    }
}

export async function getUsersPrograms() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Couldn't get current user.")
    }

    const { data: programsData, error: programsError } = await supabase
        .from("purchased_programs")
        .select(`
            created_by:users!saved_workouts_created_by_fkey(
                full_name
            ),
            programs(
                id,
                title,
                free,
                price,
                description,
                image_url
            )
        `)
        .eq("purchased_by", user.id)

    if (programsError && !programsData) {
        throw new Error(programsError.message)
    }

    return programsData
}

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
        console.log(response.error);

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

            imageUrl = storageUrl.publicUrl;
        }

        newProgram = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            weeks: parseInt(formData.get("weeks") as string),
            private: (formData.get("free") === "true"),
            free: (formData.get("free") === "true"),
            price: parseFloat(formData.get("price") as string),
            image_url: imageUrl,
            image_path: imagePath
        }
    } else {
        newProgram = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            weeks: parseInt(formData.get("weeks") as string),
            private: (formData.get("free") === "true"),
            free: (formData.get("free") === "true"),
            price: parseFloat(formData.get("price") as string),
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
        const imageName = `/${user.id}/${date.toISOString()}.${imageExt}`

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
            description: formData.get("description") as string,
            weeks: parseInt(formData.get("weeks") as string),
            private: (formData.get("free") === "true"),
            free: (formData.get("free") === "true"),
            price: parseFloat(formData.get("price") as string),
            image_url: storageUrl.publicUrl,
            image_path: storageData.path
        }
    } else {
        newProgram = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            weeks: parseInt(formData.get("weeks") as string),
            private: (formData.get("free") === "true"),
            free: (formData.get("free") === "true"),
            price: parseFloat(formData.get("price") as string),
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

    const purchasedProgram = {
        program_id: programData.id,
        created_by: user.id,
        purchased_by: user.id
    };

    const { error: purchasedProgramError } = await supabase
        .from("purchased_programs")
        .insert(purchasedProgram);

    if (purchasedProgramError) {
        return {
            error: purchasedProgramError.message
        }
    }

    return {
        data: programData
    }
}

export const redirectToCreatorsProgram = async (id: string) => {
    redirect(`/creator/program/${id}`);
}

export const getAllPrograms = cache(async () => {
    const supabase = createClient();

    const { data } = await supabase
        .from("programs")
        .select()

    if (data) {
        return data
    }
})

export const getProgram = cache(async (programId: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("programs")
        .select()
        .eq("id", programId)
        .single()
    
    if (error && !data) {
        throw new Error(error.message);
    }

    return data
})
