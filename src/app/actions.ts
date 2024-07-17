"use server";

import { createClient } from '@/utils/supabase/server'

export async function getAllPrograms() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('programs')
        .select()

    if (error) {

    }

    if (data) {
        return data
    }
}
