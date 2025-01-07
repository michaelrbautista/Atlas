"use server";

import { createClient } from "@/utils/supabase/server";

export async function signUpForWaitlist(formData: FormData) {
    const supabase = createClient();

    let newWaitlistUser = {
        email: formData.get("email") as string
    }

    const { data: signUpData, error: signUpError } = await supabase
        .from("waitlist")
        .insert(newWaitlistUser)
        .select()
        .single()

    if (signUpError && !signUpData) {
        console.log(signUpError)
        return {
            error: signUpError
        }
    }

    return {
        data: signUpData
    }
}