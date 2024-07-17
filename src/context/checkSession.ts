"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const checkSession = async () => {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // 1. check session
    const { data: { user } } = await supabase.auth.getUser()

    // 2. return 
    if (user) {
        return user.id
    } else {
        return null
    }
}

export default checkSession;