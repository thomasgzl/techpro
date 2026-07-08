<template>
  <div class="section">
    <div class="section-number">01</div>
    <div class="section-label" v-reveal>{{ t('services.label') }}</div>
    <h2 v-reveal="{ delay: 0.05 }">{{ t('services.title') }}</h2>
    <p class="section-intro" v-reveal="{ delay: 0.1 }">{{ t('services.intro') }}</p>

    <div class="services-grid" v-reveal="{ children: '.service-card', stagger: 0.1 }">
      <div class="service-card glass" v-tilt v-for="(service, index) in services" :key="index">
        <div class="service-icon">{{ service.icon }}</div>
        <h3>{{ service.title }}</h3>
        <p>{{ service.description }}</p>
        <div class="service-tags">
          <span class="tag" v-for="tag in service.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()
const services = computed(() => tm('services.items'))
</script>

<style scoped>
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  position: relative;
  z-index: 1;
}

.service-card {
  border-radius: var(--radius);
  padding: 36px 32px;
  transition: box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--gradient-brand);
  transform: scaleX(0);
  transition: transform 0.3s;
  transform-origin: left;
}

.service-card:hover { box-shadow: var(--shadow-lg); }
.service-card:hover::before { transform: scaleX(1); }

.service-icon {
  width: 52px; height: 52px;
  background: var(--accent-soft);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 22px;
}

.service-card h3 {
  font-family: 'Syne', sans-serif;
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 12px;
}

.service-card p {
  color: var(--text2);
  font-size: 14px;
  line-height: 1.7;
}
</style>
