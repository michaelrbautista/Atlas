'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(email: string, password: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({ email: email, password: password })

    if (error) {
        return {
            errorMessage: error.message
        }
    }

    revalidatePath('/', 'layout')
    redirect('/home')
}
