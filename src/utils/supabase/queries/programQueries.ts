"use server";

import { cache } from "react";
import { createClient } from "../server";

export const getAllPrograms = cache(async () => {
    const supabase = createClient();

    const { data } = await supabase
        .from('programs')
        .select()

    if (data) {
        return data
    }
})

export const getProgram = cache(async (programId: string) => {
    const supabase = createClient();

    const { data } = await supabase
        .from("programs")
        .select()
        .eq("id", programId)
        .single()
    
        if (data) {
            return data
        }
})
