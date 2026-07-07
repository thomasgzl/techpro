import { ref, watch } from 'vue'

const STORAGE_KEY = 'techpro-theme'

// Module-level singleton so every component sees the same theme state
// without needing a provider — same lightweight-store pattern as useBooking.
const theme = ref('light')
let initialized = false

function applyTheme(value) {
  document.documentElement.setAttribute('data-theme', value)
}

export function useTheme() {
  if (!initialized) {
    initialized = true
    const stored = localStorage.getItem(STORAGE_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light'
    applyTheme(theme.value)

    watch(theme, (value) => {
      applyTheme(value)
      localStorage.setItem(STORAGE_KEY, value)
    })
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}
