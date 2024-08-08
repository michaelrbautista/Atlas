"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signIn(email: string, password: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({ email: email, password: password })

    if (error) {
        return {
            errorMessage: error.message
        }
    }

    revalidatePath("/", "layout");
    return redirect("/home");
}

export async function createAccount(fullName: string, email: string, username: string, password: string) {
    const supabase = createClient();

    // Check username
    const { data: usernameData, error: usernameError } = await supabase
        .from("users")
        .select()
        .eq("username", username)

    if (usernameError) {
        return {
            errorMessage: usernameError.message
        }
    }

    if (usernameData.length > 0) {
        return {
            errorMessage: "Username is already taken."
        }
    }

    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
    })

    if (authError) {
        return {
            errorMessage: authError.message
        }
    }

    if (authData.user !== null) {
        // Create user in db
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email: email,
                full_name: fullName,
                username: username
            })
            .select()

        if (userError) {
            return {
                errorMessage: userError.message
            }
        }

        revalidatePath("/", "layout");
        return redirect("/home");
    }
}

export async function logout() {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut()

    if (error) {
        return error
    }

    revalidatePath("/", "layout");
    return redirect("/");
}