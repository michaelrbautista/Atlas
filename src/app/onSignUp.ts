"use server";

import { createClient } from "@supabase/supabase-js";

const onSignUp = async (email: string) => {
    "use server";

    // 1. Create supabase client
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    // 2. Sign in
    const { error } = await supabase
        .from('sign_ups')
        .insert({ email: email });

    if (error) {
        return error
    } else {

    }
}

export default onSignUp;