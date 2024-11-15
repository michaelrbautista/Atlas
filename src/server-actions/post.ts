"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function redirectToPost(postId: string) {
    redirect(`/post/${postId}`);
}

export async function getCreatorsPosts(userId: string, offset: number) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("posts")
        .select(`
            *,
            workouts(
                id,
                title,
                description
            ),
            programs(
                id,
                title,
                price,
                description,
                image_url
            )
        `)
        .eq("created_by", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + 9)
    
    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export async function getAllPosts(offset: number) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("posts")
        .select(`
            *,
            users(
                full_name,
                profile_picture_url
            ),
            workouts(
                id,
                title,
                description
            ),
            programs(
                id,
                title,
                price,
                description,
                image_url
            )
        `)
        .order("created_at", { ascending: false })
        .range(offset, offset + 9)
    
    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export async function getPost(postId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", postId)
        .single()
    
    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export async function createPost(formData: FormData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "Couldn't get current user."
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

    let newPost;

    let postWorkout = formData.get("workoutId") as string
    let postProgram = formData.get("programId") as string

    if (postWorkout) {
        newPost = {
            text: formData.get("text") as string,
            workout_id: postWorkout
        }
    } else {
        newPost = {
            text: formData.get("text") as string,
            program_id: postProgram
        }
    }

    // Add to posts
    const { data: postData, error: postError } = await supabase
        .from("posts")
        .insert(newPost)
        .select()
        .single()

    if (postError && !postData) {
        return {
            error: postError.message
        }
    }

    redirect("/home");
}

export async function redirectToNewPost() {
    redirect("/creator/post");
}
