<template>
  <nav :class="{ scrolled }">
    <router-link to="/" class="logo">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="M8 21h8M12 17v4"/>
        </svg>
      </div>
      TechPro
    </router-link>
    <ul class="nav-links" ref="linksEl">
      <div class="nav-pill" ref="pillEl"></div>
      <li><router-link to="/" exact-active-class="active">{{ t('nav.services') }}</router-link></li>
      <li><router-link to="/contact" active-class="active">{{ t('nav.contact') }}</router-link></li>
      <li><router-link to="/rdv" class="nav-cta" active-class="active">{{ t('nav.rdv') }}</router-link></li>
    </ul>
    <button class="lang-toggle" type="button" @click="toggleLocale" :aria-label="t('nav.langToggleLabel')">
      {{ locale === 'fr' ? 'EN' : 'FR' }}
    </button>
    <button
      class="theme-toggle"
      type="button"
      @click="toggleTheme"
      :aria-label="theme === 'dark' ? t('nav.themeToLight') : t('nav.themeToDark')"
    >
      <Transition name="icon-swap" mode="out-in">
        <svg v-if="theme === 'dark'" key="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
        <svg v-else key="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
        </svg>
      </Transition>
    </button>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from '../../animation/gsap.js'
import { useTheme } from '../../composables/useTheme.js'
import { useLocale } from '../../composables/useLocale.js'

const route = useRoute()
const linksEl = ref(null)
const pillEl = ref(null)
const scrolled = ref(false)
const { theme, toggleTheme } = useTheme()
const { locale, toggleLocale } = useLocale()
const { t } = useI18n()

function movePill() {
  const container = linksEl.value
  const pill = pillEl.value
  if (!container || !pill) return
  const active = container.querySelector('a.active')
  if (!active) {
    gsap.to(pill, { opacity: 0, duration: 0.2 })
    return
  }
  const containerRect = container.getBoundingClientRect()
  const rect = active.getBoundingClientRect()
  gsap.to(pill, {
    x: rect.left - containerRect.left,
    width: rect.width,
    height: rect.height,
    opacity: active.classList.contains('nav-cta') ? 0 : 1,
    duration: 0.45,
    ease: 'power3.out',
  })
}

function onScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  nextTick(movePill)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', movePill)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', movePill)
})

watch(() => route.name, () => nextTick(movePill))
</script>

<style scoped>
nav {
  position: fixed;
  top: 18px;
  left: 24px;
  right: 24px;
  height: var(--nav-h);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 28px;
  z-index: 100;
  max-width: 1100px;
  margin: 0 auto;
  transition: height 0.35s ease, box-shadow 0.35s ease, top 0.35s ease, background 0.4s ease, border-color 0.4s ease;
}

nav.scrolled {
  height: 60px;
  top: 12px;
  box-shadow: var(--shadow-lg);
}

.logo {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  text-decoration: none;
}

.logo-icon {
  width: 36px; height: 36px;
  background: var(--accent);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.3s ease;
}

.logo:hover .logo-icon { transform: rotate(-8deg) scale(1.05); }

.logo-icon svg { width: 20px; height: 20px; }

.nav-links {
  position: relative;
  display: flex;
  gap: 4px;
  list-style: none;
}

.nav-pill {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--ink);
  border-radius: 50px;
  z-index: 0;
  opacity: 0;
  pointer-events: none;
}

.nav-links a {
  position: relative;
  z-index: 1;
  display: block;
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 400;
  color: var(--text2);
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
}

.nav-links a:hover:not(.active) { color: var(--text); }
.nav-links a.active { color: white; }

.nav-cta {
  background: var(--accent) !important;
  color: white !important;
  font-weight: 500 !important;
}

.nav-cta:hover { background: var(--accent2) !important; }

.lang-toggle {
  height: 40px;
  padding: 0 14px;
  flex-shrink: 0;
  margin-left: 10px;
  border-radius: 50px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.lang-toggle:hover {
  background: var(--text);
  color: var(--bg);
  border-color: var(--text);
}

.theme-toggle {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  margin-left: 10px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.3s ease;
}

.theme-toggle:hover {
  background: var(--text);
  color: var(--bg);
  border-color: var(--text);
  transform: rotate(20deg);
}

.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.icon-swap-enter-from { opacity: 0; transform: rotate(-90deg) scale(0.6); }
.icon-swap-leave-to { opacity: 0; transform: rotate(90deg) scale(0.6); }

@media (max-width: 768px) {
  nav { left: 12px; right: 12px; padding: 0 10px 0 18px; }
  .theme-toggle { width: 36px; height: 36px; margin-left: 6px; }
  .lang-toggle { height: 36px; padding: 0 10px; margin-left: 6px; }
}
</style>
