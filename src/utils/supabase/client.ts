import { createBrowserClient } from '@supabase/ssr'
import { Database } from '../../../database.types'

export function createClient() {
  let supabaseUrl: string;
  let supabaseAnonKey: string;

  if (process.env.NODE_ENV === "production") {
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_LIVE_URL as string
    supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_LIVE_ANON_KEY as string
  } else {
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_TEST_URL as string
    supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_TEST_ANON_KEY as string
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}