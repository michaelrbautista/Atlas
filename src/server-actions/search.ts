"use server";

import { createClient } from "@/utils/supabase/server";

export async function searchUsers(query: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("users")
        .select()
        .textSearch("full_name", query)

    if (error && !data) {
        throw new Error(error.message);
    }

    return data
}