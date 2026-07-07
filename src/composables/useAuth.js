import { ref } from 'vue'
import { supabase } from '../lib/supabase.js'

// Module-level singleton — same lightweight-store pattern as useBooking/useTheme.
const session = ref(null)
const ready = ref(false)
let initPromise = null

function init() {
  if (!initPromise) {
    initPromise = supabase.auth.getSession().then(({ data }) => {
      session.value = data.session
      ready.value = true
      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession
      })
    })
  }
  return initPromise
}

// Awaited by the router guard so it never checks `session` before the
// initial getSession() call has actually resolved.
export function authReady() {
  return init()
}

export function useAuth() {
  init()

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return { session, ready, signIn, signOut }
}
