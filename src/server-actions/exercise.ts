"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Add exercise to workout_exercises table
export async function addExercise(formData: FormData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "Couldn't get user from auth."
        }
    }

    let newWorkoutExercise = {
        workout_id: formData.get("workoutId") as string,
        exercise_id: formData.get("exerciseId") as string,
        exercise_number: parseInt(formData.get("exerciseNumber") as string),
        title: formData.get("title") as string,
        sets: parseInt(formData.get("sets") as string),
        reps: parseInt(formData.get("reps") as string)
    }

    const { data: workoutExerciseData, error: workoutExerciseError } = await supabase
        .from("workout_exercises")
        .insert(newWorkoutExercise)
        .select()
        .single()

    if (workoutExerciseError && !workoutExerciseData) {
        return {
            error: workoutExerciseError.message
        }
    }

    return {
        data: workoutExerciseData
    }
}

// Add exercise to exercises table
export async function createExercise(formData: FormData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "Couldn't get user from auth."
        }
    }

    // Add to exercises table
    let newExercise: any;

    const video = formData.get("video") as File;

    if (video) {
        const videoExt = video.name.split(".").pop();
        let date = new Date()
        const videoName = `/${user.id}/${date.toISOString()}.${videoExt}`

        // Add image to storage
        const { data: storageData, error: storageError } = await supabase
            .storage
            .from("exercise_videos")
            .upload(videoName, video, {
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
            .from("exercise_videos")
            .getPublicUrl(storageData.path);

        if (!storageUrl) {
            return {
                error: "Couldn't get public image url from storage."
            }
        }

        newExercise = {
            title: formData.get("title") as string,
            instructions: formData.get("instructions") as string,
            video_url: storageUrl.publicUrl,
            video_path: storageData.path
        }
    } else {
        newExercise = {
            title: formData.get("title") as string,
            instructions: formData.get("instructions") as string
        }
    }

    // Add to programs
    const { data: exerciseData, error: exerciseError } = await supabase
        .from("exercises")
        .insert(newExercise)
        .select()
        .single()

    if (exerciseError && !exerciseData) {
        return {
            error: exerciseError.message
        }
    }

    return {
        data: exerciseData
    }
}