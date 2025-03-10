"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "../../database.types";
import { FetchedExercise } from "./models";

export async function udpateOrderOfExercises(exercises: FetchedExercise[]) {
    const supabase = createClient();

    exercises.map(async (exercise) => {
        const { data, error } = await supabase
            .from("workout_exercises")
            .update({
                exercise_number: exercise.exercise_number
            })
            .eq("id", exercise.id)

        if (error && !data) {
            console.log(error);
            return
        }
    })
}

export async function getCreatorsExercises() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Couldn't get current user.")
    }

    const { data, error } = await supabase
        .from("exercises")
        .select()
        .eq("created_by", user.id)
        .order("created_at", { ascending: false })

    if (error && !data) {
        return {
            error: error.message
        }
    }

    return {
        data: data
    }
}

export async function getWorkoutExercise(workoutExerciseId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Couldn't get current user.")
    }

    const { data, error } = await supabase
        .from("workout_exercises")
        .select()
        .eq("id", workoutExerciseId)
        .single()

    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export async function getProgramExercise(exerciseId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("workout_exercises")
        .select(`
            *,
            exercises(*)
        `)
        .eq("id", exerciseId)
        .single()

    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export async function getExercise(exerciseId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Couldn't get current user.")
    }

    const { data, error } = await supabase
        .from("exercises")
        .select()
        .eq("id", exerciseId)
        .single()

    if (error && !data) {
        throw new Error(error.message)
    }

    return data
}

export async function editExercise(exercise: Tables<"exercises">, formData: FormData) {
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
        let videoPath;
        let videoUrl;

        if (exercise.video_path) {
            const { data: storageData, error: storageError } = await supabase
                .storage
                .from("program_images")
                .update(exercise.video_path, video, {
                    upsert: true
                });

            if (storageError && !storageData) {
                return {
                    error: storageError.message
                }
            }

            videoPath = storageData.path

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

            videoUrl = storageUrl.publicUrl
        } else {
            const videoExt = video.name.split(".").pop();
            let date = new Date()
            const videoName = `/${user.id}/${date.toISOString()}.${videoExt}`

            // Add image to storage
            const { data: storageData, error: storageError } = await supabase
                .storage
                .from("exercise_videos")
                .upload(videoName, video, {
                    upsert: false
                });

            if (storageError && !storageData) {
                return {
                    error: storageError.message
                }
            }

            videoPath = storageData.path

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

            videoUrl = storageUrl.publicUrl
        }

        newExercise = {
            title: formData.get("title") as string,
            instructions: formData.get("instructions") as string,
            video_url: videoUrl,
            video_path: videoPath
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
        .update(newExercise)
        .eq("id", exercise.id)
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

export async function editProgramExercise(programExercise: FetchedExercise, formData: FormData) {
    const supabase = createClient();

    let newExercise = {
        sets: parseInt(formData.get("sets") as string),
        reps: parseInt(formData.get("reps") as string),
        time: formData.get("time") as string,
        other: formData.get("other") as string
    }

    // Update
    const { data: exerciseData, error: exerciseError } = await supabase
        .from("workout_exercises")
        .update(newExercise)
        .eq("id", programExercise.id)
        .select(`
            id,
            workout_id,
            program_workout_id,
            exercise_number,
            sets,
            reps,
            time,
            other,
            exercises(
                title,
                instructions,
                video_url
            )
        `)
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

export async function deleteProgramExercise(programExerciseId: string) {
    const supabase = createClient();

    // Delete exercise from database
    const response = await supabase
        .from("workout_exercises")
        .delete()
        .eq("id", programExerciseId)

    if (response.error) {
        return {
            error: "Couldn't delete exercise."
        }
    }
}

export async function deleteLibraryExercise(exercise: Tables<"exercises">) {
    const supabase = createClient();

    const response = await supabase
        .from("exercises")
        .delete()
        .eq("id", exercise.id)

    if (response.error) {
        return {
            error: "Couldn't delete exercise."
        }
    }

    if (exercise.video_path) {
        const { data, error } = await supabase
            .storage
            .from("exercise_videos")
            .remove([exercise.video_path])

        if (error && !data) {
            return {
                error: "Couldn't delete program."
            }
        }
    }
}

export async function decrementProgramExercises(deletedExerciseNumber: number, workoutId?: string, programWorkoutId?: string) {
    const supabase = createClient();
    
    if (workoutId) {
        const { data, error } = await supabase
            .rpc("decrement_library_workout_exercises", {
                workout_id_input: workoutId,
                deleted_exercise_number: deletedExerciseNumber
            })

        if (error && !data) {
            return {
                error: "Couldn't decrement exercises."
            }
        }
    } else if (programWorkoutId) {
        const { data, error } = await supabase
            .rpc("decrement_program_workout_exercises", {
                program_workout_id_input: programWorkoutId,
                deleted_exercise_number: deletedExerciseNumber
            })

        if (error && !data) {
            return {
                error: "Couldn't decrement exercises."
            }
        }
    }
}

// Add exercise to workout in program
export async function addExerciseToWorkout(exercise: Tables<"exercises">, formData: FormData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "Couldn't get user from auth."
        }
    }

    let newWorkoutExercise = {
        workout_id: formData.get("workoutId") as string,
        program_workout_id: formData.get("programWorkoutId") as string,
        exercise_id: formData.get("exerciseId") as string,
        exercise_number: parseInt(formData.get("exerciseNumber") as string),
        sets: parseInt(formData.get("sets") as string),
        reps: parseInt(formData.get("reps") as string),
        time: formData.get("time") as string,
        other: formData.get("other") as string
    }

    const { data: programExerciseData, error: programExerciseError } = await supabase
        .from("workout_exercises")
        .insert(newWorkoutExercise)
        .select(`
            id,
            workout_id,
            program_workout_id,
            exercise_number,
            sets,
            reps,
            time,
            other,
            exercises(
                title,
                instructions,
                video_url
            )
        `)
        .single()

    if (programExerciseError && !programExerciseData) {
        return {
            error: programExerciseError.message
        }
    }

    return {
        data: programExerciseData
    }
}

// Add exercise to workouts in creator's library
export async function addExerciseToLibraryWorkout(formData: FormData) {
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
        reps: parseInt(formData.get("reps") as string),
        time: formData.get("time") as string,
        other: formData.get("other") as string
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

// Add exercise to exercises table (library)
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