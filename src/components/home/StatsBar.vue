<template>
  <div class="stats-bar" ref="barEl">
    <div class="stat glass" v-for="(stat, index) in stats" :key="index">
      <span class="stat-num">{{ displayed[index] }}{{ stat.suffix }}</span>
      <div class="stat-label">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap, ScrollTrigger } from '../../animation/gsap.js'

const { tm } = useI18n()
const stats = computed(() => tm('stats'))

const displayed = reactive([0, 0, 0, 0])
const barEl = ref(null)
let trigger = null

onMounted(() => {
  trigger = ScrollTrigger.create({
    trigger: barEl.value,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      stats.value.forEach((stat, index) => {
        const proxy = { value: 0 }
        gsap.to(proxy, {
          value: stat.num,
          duration: 1.4,
          delay: index * 0.08,
          ease: 'power2.out',
          onUpdate: () => {
            displayed[index] = Math.round(proxy.value)
          },
        })
      })
    },
  })
})

onBeforeUnmount(() => trigger?.kill())
</script>

<style scoped>
.stats-bar {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: -56px auto 0;
  padding: 0 48px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat {
  text-align: center;
  padding: 24px 16px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}

.stat:hover { transform: translateY(-4px); }

.stat-num {
  font-family: 'Syne', sans-serif;
  font-size: 32px;
  font-weight: 800;
  display: block;
  color: var(--text);
}

.stat-label {
  font-size: 12px;
  color: var(--text2);
  margin-top: 6px;
}

@media (max-width: 768px) {
  .stats-bar { grid-template-columns: 1fr 1fr; margin-top: -32px; padding: 0 20px; gap: 12px; }
}
</style>
