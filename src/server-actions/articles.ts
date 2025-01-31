"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "../../database.types";
import { redirect } from "next/navigation";
import { FetchedArticle, TipTapNode } from "./models";

export async function editArticle(article: FetchedArticle, formData: FormData) {
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
        let imagePath;
        let imageUrl;

        if (article.image_path) {
            const { data: storageData, error: storageError } = await supabase
                .storage
                .from("program_images")
                .update(article.image_path, image, {
                    upsert: true
                });

            if (storageError && !storageData) {
                return {
                    error: storageError.message
                }
            }

            imagePath = article.image_path;

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

            imageUrl = storageUrl.publicUrl;
        } else {
            const imageExt = image.name.split(".").pop();
            let date = new Date()
            const imageName = `/${user.id}/${date.toISOString()}.${imageExt}`

            // Add image to storage
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

            imagePath = storageData.path;

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

            imageUrl = storageUrl.publicUrl;
        }

        newArticle = {
            collection_id: formData.get("collectionId") as string,
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            free: formData.get("free") as string,
            image_url: imageUrl,
            image_path: imagePath
        }
    } else {
        newArticle = {
            collection_id: formData.get("collectionId") as string,
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            free: formData.get("free") as string
        }
    }

    // Edit program
    const { data: programData, error: programError } = await supabase
        .from("articles")
        .update(newArticle)
        .eq("id", article.id)
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

export async function deleteArticle(articleId: string, content: string) {
    const supabase = createClient();

    // Loop through and delete images from article
    const jsonContent = JSON.parse(content);

    const formattedNodes = jsonContent.content as TipTapNode[];

    let imagePaths: string[] = [];
    for (let node of formattedNodes) {
        if (node.type == "image" && node.attrs?.src) {
            // Create path based on user
            const splitSrc = node.attrs.src.split("/");
            const imagePath = `${splitSrc[splitSrc.length - 2]}/${splitSrc[splitSrc.length - 1]}`;

            imagePaths.push(imagePath);
        }
    }

    if (imagePaths.length > 0) {
        const { error } = await supabase
        .storage
        .from("article_images")
        .remove(imagePaths)

        if (error) {
            return {
                error: "Couldn't delete article images."
            }
        }
    }

    const response = await supabase
        .from("articles")
        .delete()
        .eq("id", articleId)

    if (response.error) {
        return {
            error: "Couldn't delete article."
        }
    }
}

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

export async function getCollectionsArticles(collectionId: string, offset: number) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("articles")
        .select(`
            id,
            collection_id,
            title,
            content,
            free,
            image_url,
            image_path,
            created_by:users!articles_created_by_fkey(
                id,
                full_name
            )
        `)
        .eq("collection_id", collectionId)
        .order("created_at", { ascending: false })
        .range(offset, offset + 9)
    
        if (error && !data) {
            return {
                error: error.message
            }
        }
    
        return {
            data: data
        }
}

export const getArticleClient = async (articleId: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("articles")
        .select(`
            id,
            collection_id,
            title,
            content,
            free,
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

export const getArticle = async (articleId: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("articles")
        .select(`
            id,
            collection_id,
            title,
            content,
            free,
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
        throw new Error(error.message);
    }

    return data
}

export const redirectToEditArticle = async (id: string) => {
    redirect(`/creator/article/edit/${id}`);
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

    // Add to articles
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