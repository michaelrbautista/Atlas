import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '../../../database.types'

export function createClient() {
  const cookieStore = cookies()

  // let supabaseUrl: string;
  // let supabaseAnonKey: string;

  // if (process.env.NODE_ENV === "production") {
  //   supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_LIVE_URL as string
  //   supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_LIVE_ANON_KEY as string
  // } else {
  //   supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_TEST_URL as string
  //   supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_TEST_ANON_KEY as string
  // }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_LIVE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_LIVE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}