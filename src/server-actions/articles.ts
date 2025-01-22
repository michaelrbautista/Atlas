"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "../../database.types";
import { redirect } from "next/navigation";

export const saveArticleImage = async (formData: FormData) => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "Couldn't get user from auth."
        }
    }

    const image = formData.get("image") as File;
    const imageType = formData.get("fileType") as string;

    const imageWithType = new File([image], image.name, { type: imageType });

    const imageExt = image.name.split(".").pop();
    let date = new Date()
    const imageName = `/${user.id}/${date.toISOString()}.${imageExt}`

    // Update image
    const { data: storageData, error: storageError } = await supabase
        .storage
        .from("article_images")
        .upload(imageName, imageWithType, {
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
        .from("article_images")
        .getPublicUrl(storageData.path);

    if (!storageUrl) {
        return {
            error: "Couldn't get public image url from storage."
        }
    }

    return {
        data: storageUrl.publicUrl
    }
}

export const redirectToNewArticle = async (collectionId: string) => {
    redirect(`/creator/article/new?collection=${collectionId}`);
}

export const getCollectionsArticles = async (collectionId: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("articles")
        .select()
        .eq("collection_id", collectionId)
        .single()
    
    if (error && !data) {
        return {
            error: error.message
        }
    }

    return {
        data: data
    }
}

export const getArticle = async (articleId: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("articles")
        .select(`
            id,
            collection_id,
            title,
            content,
            image_url,
            image_path,
            created_by:users!articles_created_by_fkey(
                id,
                full_name
            )
        `)
        .eq("id", articleId)
        .single()
    
    if (error && !data) {
        return {
            error: error.message
        }
    }

    return {
        data: data
    }
}

export const redirectToArticle = async (id: string) => {
    redirect(`/article/${id}`);
}

export async function publishArticle(formData: FormData) {
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

    let newArticle: any;

    const image = formData.get("image") as File;

    if (image) {
        const imageExt = image.name.split(".").pop();
        let date = new Date()
        const imageName = `/${user.id}/${date.toISOString()}.${imageExt}`

        // Update image
        const { data: storageData, error: storageError } = await supabase
            .storage
            .from("article_images")
            .upload(imageName, image, {
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
            .from("article_images")
            .getPublicUrl(storageData.path);

        if (!storageUrl) {
            return {
                error: "Couldn't get public image url from storage."
            }
        }

        newArticle = {
            collection_id: formData.get("collectionId") as string,
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            free: formData.get("free") as string,
            image_url: storageUrl.publicUrl,
            image_path: storageData.path
        }
    } else {
        newArticle = {
            collection_id: formData.get("collectionId") as string,
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            free: formData.get("free") as string
        }
    }

    // Add to programs
    const { data: articleData, error: articleError } = await supabase
    .from("articles")
    .insert(newArticle)
    .select()
    .single()

    if (articleError && !articleData) {
        return {
            error: articleError.message
        }
    }

    return {
        data: articleData
    }
}