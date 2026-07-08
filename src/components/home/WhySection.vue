<template>
  <div class="why-wrapper">
    <div class="why-panel glass">
      <GradientOrbs :triple="false" />
      <div class="why-grid">
        <div>
          <div class="section-label" v-reveal>{{ t('why.label') }}</div>
          <h2 v-reveal="{ delay: 0.05 }">{{ t('why.title') }}</h2>
          <ul class="why-list" v-reveal="{ children: '.why-item', stagger: 0.1, delay: 0.1 }">
            <li class="why-item" v-for="(item, index) in whyItems" :key="index">
              <div class="why-item-icon">{{ item.icon }}</div>
              <div>
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="why-visual" v-reveal="{ delay: 0.2, y: 40 }">
          <span class="why-visual-num" v-html="t('why.visual.badge')"></span>
          <p>{{ t('why.visual.text') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import GradientOrbs from '../common/GradientOrbs.vue'

const { t, tm } = useI18n()
const whyItems = computed(() => tm('why.items'))
</script>

<style scoped>
.why-wrapper {
  padding: 0 48px;
  max-width: 1196px;
  margin: 0 auto;
  box-sizing: border-box;
}

.why-panel {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
  padding: 80px 64px;
}

.why-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.why-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 36px;
}

.why-item {
  display: flex;
  gap: 16px;
}

.why-item-icon {
  width: 40px;
  height: 40px;
  background: var(--green-soft);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
}

.why-item h4 {
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  margin-bottom: 4px;
}

.why-item p { font-size: 14px; color: var(--text2); }

.why-visual {
  background: var(--ink);
  border-radius: var(--radius);
  padding: 48px;
  color: white;
  position: relative;
  overflow: hidden;
}

.why-visual::after {
  content: '';
  position: absolute;
  bottom: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 40px solid rgba(124,58,237,0.3);
}

.why-visual-num {
  font-family: 'Syne', sans-serif;
  font-size: 48px;
  font-weight: 800;
  color: var(--accent);
  line-height: 1.2;
  display: block;
  margin-bottom: 16px;
}

.why-visual p {
  font-size: 20px;
  font-weight: 300;
  opacity: 0.8;
  position: relative;
  z-index: 1;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .why-grid { grid-template-columns: 1fr; }
  .why-panel { padding: 32px 24px; }
}
</style>
