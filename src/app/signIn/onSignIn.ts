"use server";

import { createClient } from "@supabase/supabase-js";

const onSignIn = async (email: string, password: string) => {
    "use server";

    // 1. Create supabase client
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    // 2. Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        return error
    } else {
        console.log("success");
    }

    // if (error) {
    //     console.log(error);
    // } else {
    //     console.log("success");
    // }
}

export default onSignIn;