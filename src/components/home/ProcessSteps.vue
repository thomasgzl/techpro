<template>
  <div class="section">
    <div class="section-number">02</div>
    <div class="section-label" v-reveal>{{ t('process.label') }}</div>
    <h2 v-reveal="{ delay: 0.05 }">{{ t('process.title') }}</h2>

    <div class="process-steps" ref="wrapEl">
      <svg class="process-line" viewBox="0 0 100 2" preserveAspectRatio="none">
        <line x1="12.5" y1="1" x2="87.5" y2="1" ref="pathEl" />
      </svg>
      <div class="process-step glass" v-reveal="{ delay: 0.1 + index * 0.1, y: 24 }" v-for="(step, index) in steps" :key="index">
        <div class="step-num">{{ index + 1 }}</div>
        <h4>{{ step.title }}</h4>
        <p>{{ step.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from '../../animation/gsap.js'

const { t, tm } = useI18n()
const steps = computed(() => tm('process.steps'))

const wrapEl = ref(null)
const pathEl = ref(null)

onMounted(() => {
  const line = pathEl.value
  if (!line) return
  const length = line.getTotalLength()
  gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
  gsap.to(line, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: wrapEl.value,
      start: 'top 75%',
      end: 'bottom 65%',
      scrub: true,
    },
  })
})
</script>

<style scoped>
.process-steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 48px;
}

.process-line {
  position: absolute;
  top: 24px;
  left: 0;
  width: 100%;
  height: 2px;
  overflow: visible;
  z-index: 0;
}

.process-line line {
  stroke: var(--accent);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.process-step {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 32px 20px;
  border-radius: var(--radius);
}

.step-num {
  width: 48px; height: 48px;
  background: var(--gradient-brand);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 18px;
  margin: 0 auto 16px;
  box-shadow: 0 8px 20px rgba(124,58,237,0.35);
}

.process-step h4 {
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  margin-bottom: 8px;
}

.process-step p { font-size: 13px; color: var(--text2); }

@media (max-width: 768px) {
  .process-steps { grid-template-columns: 1fr 1fr; }
  .process-line { display: none; }
}
</style>
