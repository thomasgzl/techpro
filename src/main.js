import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/base.css'
import { vReveal } from './animation/vReveal.js'
import { vParallax } from './animation/vParallax.js'
import { vTilt } from './animation/vTilt.js'
import { vMagnetic } from './animation/vMagnetic.js'
import { useTheme } from './composables/useTheme.js'

// Applied before mount so the correct theme is set before first paint (no flash).
useTheme()

const app = createApp(App)

app.directive('reveal', vReveal)
app.directive('parallax', vParallax)
app.directive('tilt', vTilt)
app.directive('magnetic', vMagnetic)

app.use(router).mount('#app')
