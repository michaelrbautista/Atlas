"use server";

import { createClient } from "@/utils/supabase/server";

export async function onJoin(email: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from('sign_ups')
        .insert({
            email: email
        })

    if (error) {
        return error
    }
}