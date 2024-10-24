"use server";

import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Tables } from "../../database.types";

export async function getWorkoutExercises(workoutId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Couldn't get current user.")
    }

    const { data, error } = await supabase
        .from("workout_exercises")
        .select()
        .eq("workout_id", workoutId)

    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export async function getWorkout(workoutId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Couldn't get current user.")
    }

    const { data, error } = await supabase
        .from("workouts")
        .select()
        .eq("id", workoutId)
        .single()

    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export async function editWorkout(workout: Tables <"workouts">, formData: FormData) {
    const supabase = createClient();

    let newWorkout = {
        title: formData.get("title") as string,
        description: formData.get("description") as string
    }

    // Add to programs
    const { data: workoutData, error: workoutError } = await supabase
        .from("workouts")
        .update(newWorkout)
        .eq("id", workout.id)
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

export async function deleteWorkout(workoutId: string) {
    const supabase = createClient();

    const response = await supabase
        .from("workouts")
        .delete()
        .eq("id", workoutId)

    if (response.error) {
        return {
            error: "Couldn't delete workout."
        }
    }
}

export async function createWorkout(formData: FormData) {
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

    let newWorkout = {
        program_id: formData.get("programId") as string,
        week: parseInt(formData.get("week") as string),
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        day: formData.get("day") as string
    }

    // Add to workouts
    const { data: workoutData, error: workoutError } = await supabase
        .from("workouts")
        .insert(newWorkout)
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

    // revalidatePath("/creator/programs");
    // return redirect(`/creator/workout/${workoutData.id}`);
}