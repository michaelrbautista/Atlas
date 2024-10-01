"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function checkAuth() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return true
    }

    const { data: userData, error: userError } = await supabase
        .from("users")
        .select()
        .eq("id", user?.id)
        .single()

    if (userError && !userData) {
        console.log(userError);
        return true
    }

    if (userData.team_id) {
        return redirect("/creator/team");
    } else {
        return redirect("/home");
    }
}

export async function signIn(email: string, password: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({ email: email, password: password })

    if (error) {
        return {
            error: error.message
        }
    }

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
            error: userError.message
        }
    }

    return {
        data: userData
    }
}

export async function redirectAfterLogin(createdTeam: boolean) {
    if (createdTeam) {
        return redirect("/creator/team");
    } else {
        return redirect("/home");
    }
}

export async function createAccount(fullName: string, email: string, username: string, password: string, fromLandingPage: boolean) {
    const supabase = createClient();

    // Check username
    const { data: usernameData, error: usernameError } = await supabase
        .from("users")
        .select()
        .eq("username", username)

    if (usernameError) {
        return {
            error: usernameError.message
        }
    }

    if (usernameData.length > 0) {
        return {
            error: "Username is already taken."
        }
    }

    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
    })

    if (authError && !authData) {
        return {
            error: authError.message
        }
    }

    if (!authData.user) {
        return {
            error: "Couldn't get user from auth."
        }
    }

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

    if (userError && !userData) {
        return {
            error: userError.message
        }
    }

    return {
        data: userData
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