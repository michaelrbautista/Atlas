"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Tables } from "../../database.types";

export async function decrementCollectionNumbers(deletedCollectionNumber: number, userId: string) {
    const supabase = createClient();
    
    const { data, error } = await supabase
        .rpc("decrement_collection", {
            user_id: userId,
            deleted_collection_number: deletedCollectionNumber
        })

    if (error && !data) {
        return {
            error: "Couldn't decrement exercises."
        }
    }
}

export async function udpateOrderOfCollections(collections: Tables<"collections">[]) {
    const supabase = createClient();

    collections.map(async (collection) => {
        const { data, error } = await supabase
            .from("collections")
            .update({
                collection_number: collection.collection_number
            })
            .eq("id", collection.id)

        if (error && !data) {
            console.log(error);
            return
        }
    })
}

export async function deleteCollection(collectionId: string) {
    const supabase = createClient();

    const response = await supabase
        .from("collections")
        .delete()
        .eq("id", collectionId)

    if (response.error) {
        return {
            error: "Couldn't delete collection."
        }
    }
}

export async function getCreatorsCollections(userId: string, offset: number) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("collections")
        .select(`
            id,
            created_at,
            title,
            description,
            collection_number,
            articles(
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
            )
        `)
        .eq("created_by", userId)
        .order("collection_number", { ascending: true })
        .range(offset, offset + 9)
    
    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export async function editCollection(collectionId: string, formData: FormData) {
    const supabase = createClient();

    let newCollection = {
        title: formData.get("title") as string,
        description: formData.get("description") as string
    }

    // Add to programs
    const { data: collectionData, error: collectionError } = await supabase
        .from("collections")
        .update(newCollection)
        .eq("id", collectionId)
        .select()
        .single()

    if (collectionError && !collectionData) {
        return {
            error: collectionError.message
        }
    }

    return {
        data: collectionData
    }
}

export async function getCollectionServer(collectionId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("collections")
        .select(`
            id,
            created_at,
            created_by,
            title,
            description,
            collection_number,
            articles(
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
            )
        `)
        .eq("id", collectionId)
        .order("created_at", { referencedTable: "articles", ascending: true })
        .single()

    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export async function getCollection(collectionId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("collections")
        .select(`
            id,
            created_at,
            created_by,
            title,
            description,
            collection_number,
            articles(
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
            )
        `)
        .eq("id", collectionId)
        .order("created_at", { referencedTable: "articles", ascending: true })
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

export const redirectToCreatorsCollection = async (id: string) => {
    redirect(`/creator/collection/${id}`);
}

export async function createCollection(formData: FormData) {
    const supabase = createClient();

    let newCollection = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        collection_number: parseInt(formData.get("collectionNumber") as string)
    }

    // Add to workouts
    const { data: workoutData, error: workoutError } = await supabase
        .from("collections")
        .insert(newCollection)
        .select()
        .single()

    if (workoutError && !workoutData) {
        return {
            error: workoutError.message
        }
    }

    return {
        data: workoutData
    }
}