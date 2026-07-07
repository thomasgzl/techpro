import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants — copiez .env.example vers .env et renseignez votre projet Supabase.',
  )
}

// Falls back to a placeholder so createClient doesn't throw before the .env
// file is filled in; isSupabaseConfigured is what call sites should check.
export const supabase = createClient(url || 'https://placeholder.supabase.co', anonKey || 'placeholder')
