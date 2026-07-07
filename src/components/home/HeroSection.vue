<template>
  <div class="hero">
    <GradientOrbs />

    <div class="hero-grid">
      <div class="hero-copy">
        <div class="hero-tag" v-reveal="{ y: 16 }">Disponible 7j/7 · Annecy & environs</div>
        <h1 ref="headline">
          <span class="word"><span>L'expert</span></span>
          <span class="word"><span>qui</span></span>
          <span class="word"><span>remet</span></span>
          <span class="word"><span>votre</span></span>
          <span class="word"><span class="accent-word">tech</span></span>
          <span class="word"><span>en</span></span>
          <span class="word"><span>marche</span></span>
        </h1>
        <p class="hero-sub" v-reveal="{ delay: 0.15 }">Conseil, installation, dépannage et réparation pour tous vos appareils numériques. Rapide, fiable, et à prix transparent.</p>
        <div class="hero-actions" v-reveal="{ delay: 0.25 }">
          <button class="btn-primary" v-magnetic @click="router.push('/rdv')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Réserver un créneau
          </button>
          <button class="btn-secondary" v-magnetic @click="router.push('/contact')">Nous contacter</button>
        </div>
      </div>

      <div class="hero-visual" v-reveal="{ delay: 0.2, y: 50 }">
        <div class="visual-orb" v-parallax="{ speed: 0.2 }"></div>
        <div class="chip chip-1 glass" v-parallax="{ speed: -0.15 }">
          <span class="chip-icon">✅</span>
          <div><strong>Devis gratuit</strong><span>Sans engagement</span></div>
        </div>
        <div class="chip chip-2 glass" v-parallax="{ speed: 0.25 }">
          <span class="chip-icon">⚡</span>
          <div><strong>Intervention &lt;24h</strong><span>Délai moyen</span></div>
        </div>
        <div class="chip chip-3 glass" v-parallax="{ speed: -0.1 }">
          <span class="chip-icon">🔒</span>
          <div><strong>Garantie 3 mois</strong><span>Chaque réparation</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import GradientOrbs from '../common/GradientOrbs.vue'
import { gsap } from '../../animation/gsap.js'

const router = useRouter()
const headline = ref(null)

onMounted(() => {
  const spans = headline.value?.querySelectorAll('.word > span')
  if (!spans?.length) return
  gsap.fromTo(
    spans,
    { yPercent: 110 },
    { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.05, delay: 0.15 },
  )
})
</script>

<style scoped>
.hero {
  position: relative;
  padding: 20px 48px 80px;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 13px;
  font-weight: 500;
  padding: 6px 16px;
  border-radius: 50px;
  margin-bottom: 32px;
}

.hero-tag::before {
  content: '';
  width: 7px; height: 7px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,100% { opacity:1; } 50% { opacity:0.4; }
}

.hero-sub {
  font-size: 18px;
  font-weight: 300;
  color: var(--text2);
  max-width: 480px;
  margin-bottom: 48px;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-actions button { will-change: transform; }

/* ---- Visual side ---- */
.hero-visual {
  position: relative;
  height: 420px;
}

.visual-orb {
  position: absolute;
  inset: 10%;
  border-radius: 40% 60% 55% 45% / 50% 45% 55% 50%;
  background: var(--gradient-brand);
  opacity: 0.18;
  filter: blur(6px);
  animation: morph 12s ease-in-out infinite;
}

@keyframes morph {
  0%, 100% { border-radius: 40% 60% 55% 45% / 50% 45% 55% 50%; }
  50% { border-radius: 55% 45% 40% 60% / 45% 55% 50% 50%; }
}

.chip {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  animation: float 6s ease-in-out infinite;
}

.chip-icon { font-size: 22px; }

.chip strong { display: block; font-size: 13px; font-weight: 600; color: var(--text); }
.chip span { display: block; font-size: 11px; color: var(--text2); margin-top: 2px; }

.chip-1 { top: 6%; left: 4%; animation-delay: 0s; }
.chip-2 { top: 42%; right: 0%; animation-delay: 1.2s; }
.chip-3 { bottom: 6%; left: 14%; animation-delay: 2.4s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}

@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; }
  .hero-visual { height: 320px; margin-top: 24px; }
}

@media (max-width: 768px) {
  .hero { padding: 0 20px 56px; }
}
</style>
