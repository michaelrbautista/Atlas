"use server";

import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

    // Add to programs
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

    // revalidatePath("/creator/programs");
    return redirect(`/creator/workout/${workoutData.id}`);
}