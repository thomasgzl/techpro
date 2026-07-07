<template>
  <div class="orb-field" aria-hidden="true">
    <div class="orb orb-a" v-parallax="{ speed: 0.35 }"></div>
    <div class="orb orb-b" v-parallax="{ speed: -0.25 }"></div>
    <div class="orb orb-c" v-parallax="{ speed: 0.2 }" v-if="triple"></div>
  </div>
</template>

<script setup>
import { vParallax } from '../../animation/vParallax.js'

defineProps({
  triple: { type: Boolean, default: true },
})
</script>

<style scoped>
.orb-field {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  contain: paint;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(44px);
  opacity: 0.5;
  will-change: transform;
  transform: translateZ(0);
}

.orb-a {
  width: 420px;
  height: 420px;
  top: -120px;
  right: -80px;
  background: radial-gradient(circle at 30% 30%, var(--accent), transparent 70%);
}

.orb-b {
  width: 380px;
  height: 380px;
  bottom: -140px;
  left: -100px;
  background: radial-gradient(circle at 40% 40%, #ec4899, transparent 70%);
  opacity: 0.35;
}

.orb-c {
  width: 300px;
  height: 300px;
  top: 40%;
  left: 50%;
  background: radial-gradient(circle at 50% 50%, #16a34a, transparent 70%);
  opacity: 0.25;
}

@media (max-width: 768px) {
  .orb { filter: blur(40px); }
  .orb-a, .orb-b, .orb-c { width: 240px; height: 240px; }
}
</style>
