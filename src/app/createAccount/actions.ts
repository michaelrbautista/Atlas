'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function createUserAuth(email: string, password: string) {
  const supabase = createClient()

  // 1. Create user in auth
  const { error } = await supabase.auth.signUp({ email: email, password: password })

  if (error) {
    return {
      error: error.message
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function createUserDatabase(fullName: string, email: string, username: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
  .from('users')
  .insert({
    email: email,
    full_name: fullName,
    username: username,
  })
  .select()

  if (error) {
    return {
      error: error.message
    }
  } else {
    return data
  }
}

