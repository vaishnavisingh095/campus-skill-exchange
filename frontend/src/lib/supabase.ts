import { createClient, type Session as AuthSession, type User } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && anonKey ? createClient(url, anonKey) : null

export function isCampusEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.edu(\.[a-z]{2,})?$/i.test(email.trim())
}

export async function getAuthSession(): Promise<AuthSession | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function signInWithCampusEmail(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  if (!supabase) return { user: null, error: 'Supabase is not configured.' }
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
  return { user: data.user ?? null, error: error?.message ?? null }
}

export async function signUpWithCampusEmail(
  email: string,
  password: string,
  fullName: string,
): Promise<{ user: User | null; error: string | null }> {
  if (!supabase) return { user: null, error: 'Supabase is not configured.' }
  if (!isCampusEmail(email)) {
    return { user: null, error: 'Please use a valid campus .edu email address.' }
  }
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { full_name: fullName.trim() } },
  })
  return { user: data.user ?? null, error: error?.message ?? null }
}

export async function signOutCampus(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}
