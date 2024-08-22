"use server";

import { cache } from "react";
import { createClient } from "@/utils/supabase/server";

export const getUser = cache(async (userId: string) => {
    const supabase = createClient();

    const { data } = await supabase
        .from("users")
        .select()
        .eq("id", userId)
        .single()

    return data
})
