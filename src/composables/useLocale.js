import { i18n, persistLocale } from '../i18n/index.js'

// Thin wrapper around the global i18n locale ref — same lightweight-store
// pattern as useTheme/useAuth, kept separate so components don't need to
// import the i18n instance directly.
export function useLocale() {
  const locale = i18n.global.locale

  function setLocale(value) {
    locale.value = value
    persistLocale(value)
  }

  function toggleLocale() {
    setLocale(locale.value === 'fr' ? 'en' : 'fr')
  }

  return { locale, setLocale, toggleLocale }
}
