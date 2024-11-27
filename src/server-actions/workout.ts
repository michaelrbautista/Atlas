"use server";

import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Tables } from "../../database.types";

export async function getUsersWorkouts() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Couldn't get current user.")
    }

    const { data, error } = await supabase
        .from("workouts")
        .select()
        .eq("created_by", user.id)

    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

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

export async function getProgramWorkout(workoutId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("program_workouts")
        .select(`
            id,
            title,
            description,
            program_exercises(
                id,
                exercise_number,
                sets,
                reps,
                time,
                exercises(
                    title,
                    instructions,
                    video_url
                )
            )
        `)
        .eq("id", workoutId)
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

export async function getLibraryWorkout(workoutId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("workouts")
        .select(`
            id,
            title,
            description,
            program_exercises(
                id,
                exercise_number,
                sets,
                reps,
                time,
                exercises(
                    title,
                    instructions,
                    video_url
                )
            )
        `)
        .eq("id", workoutId)
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

export async function editLibraryWorkout(workoutId: string, formData: FormData) {
    const supabase = createClient();

    let newWorkout = {
        title: formData.get("title") as string,
        description: formData.get("description") as string
    }

    // Add to programs
    const { data: workoutData, error: workoutError } = await supabase
        .from("workouts")
        .update(newWorkout)
        .eq("id", workoutId)
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

export async function editProgramWorkout(workoutId: string, formData: FormData) {
    const supabase = createClient();

    let newWorkout = {
        title: formData.get("title") as string,
        description: formData.get("description") as string
    }

    // Add to programs
    const { data: workoutData, error: workoutError } = await supabase
        .from("program_workouts")
        .update(newWorkout)
        .eq("id", workoutId)
        .select(`
            id,
            title,
            description,
            program_exercises(
                id,
                exercise_number,
                sets,
                reps,
                time,
                exercises(
                    title,
                    instructions,
                    video_url
                )
            )
        `)
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

export async function deleteProgramWorkout(workoutId: string) {
    const supabase = createClient();

    const response = await supabase
        .from("program_workouts")
        .delete()
        .eq("id", workoutId)

    if (response.error) {
        return {
            error: "Couldn't delete workout."
        }
    }
}

export async function deleteLibraryWorkout(workoutId: string) {
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

export async function addNewWorkoutToProgram(
    title: string,
    programId: string,
    week: number,
    day: string,
    description: string | null) {
    // Create program_workout
    const programWorkout = {
        title: title,
        description: description,
        program_id: programId,
        week: week,
        day: day
    }
    
    // Add to program_workouts table
    const supabase = createClient();

    const { data: workoutData, error: workoutError } = await supabase
        .from("program_workouts")
        .insert(programWorkout)
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

export async function addLibraryWorkoutToProgram(
    libraryWorkoutId: string,
    title: string,
    programId: string,
    week: number,
    day: string,
    description: string | null) {
    // Create program_workout
    const programWorkout = {
        title: title,
        description: description,
        program_id: programId,
        week: week,
        day: day
    }
    
    // Add to program_workouts table
    const supabase = createClient();

    const { data: workoutData, error: workoutError } = await supabase
        .from("program_workouts")
        .insert(programWorkout)
        .select()
        .single()

    if (workoutError && !workoutData) {
        return {
            error: workoutError.message
        }
    }

    // Get exercises from library workout
    const { data: exercisesData, error: exercisesError } = await supabase
        .from("program_exercises")
        .select()
        .eq("workout_id", libraryWorkoutId)

    if (exercisesError && !exercisesData) {
        return {
            error: exercisesError.message
        }
    }

    // Make workout_id column null and add program_workout_id
    var newExercises: {
        program_workout_id: string,
        exercise_id: string,
        exercise_number: number,
        sets: number | null,
        reps: number | null,
        time: string | null
    }[] = []

    exercisesData.map((exercise) => {
        const newExercise = {
            program_workout_id: workoutData.id,
            exercise_id: exercise.exercise_id,
            exercise_number: exercise.exercise_number,
            sets: exercise.sets,
            reps: exercise.reps,
            time: exercise.time
        }

        exercise.workout_id = null
        exercise.program_workout_id = workoutData.id
        newExercises.push(newExercise)
    })

    // Copy exercises to program workout
    const { error: copyExercisesError } = await supabase
        .from("program_exercises")
        .insert(newExercises)

    if (copyExercisesError) {
        return {
            error: copyExercisesError.message
        }
    }

    return {
        data: workoutData
    }
}

export async function createLibraryWorkout(formData: FormData) {
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
        title: formData.get("title") as string,
        description: formData.get("description") as string
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
}