<template>
  <div class="section">
    <div class="section-number">04</div>
    <div class="section-label" v-reveal>{{ t('pricing.label') }}</div>
    <h2 v-reveal="{ delay: 0.05 }">{{ t('pricing.title') }}</h2>
    <p class="section-intro" v-reveal="{ delay: 0.1 }">{{ t('pricing.intro') }}</p>

    <div class="pricing-grid" v-reveal="{ children: '.pricing-card', stagger: 0.1 }">
      <div
        class="pricing-card"
        :class="[{ featured: plan.featured }, plan.featured ? '' : 'glass']"
        v-tilt="plan.featured ? false : { strength: 5 }"
        v-for="(plan, index) in pricingPlans"
        :key="index"
      >
        <div class="pricing-badge" v-if="plan.badge">{{ plan.badge }}</div>
        <h3>{{ plan.title }}</h3>
        <div class="pricing-price">
          <template v-if="plan.priceLabel"><sup>{{ plan.priceLabel }}</sup> {{ plan.price }}<sup>{{ plan.priceSuffix }}</sup></template>
          <template v-else>{{ plan.price }}<span> {{ plan.priceExtra }}</span></template>
        </div>
        <ul class="pricing-features">
          <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
        </ul>
        <button class="btn-full" :class="plan.buttonStyle" @click="router.push(plan.buttonRoute)">{{ plan.buttonLabel }}</button>
      </div>
    </div>

    <div class="digital-pricing-banner glass" v-reveal>
      <div class="dpb-left">
        <div class="dpb-tag">{{ t('pricing.digitalBanner.tag') }}</div>
        <h3>{{ t('pricing.digitalBanner.title') }}</h3>
        <p>{{ t('pricing.digitalBanner.text') }}</p>
        <button class="btn-primary" v-magnetic style="margin-top: 8px;" @click="router.push('/contact')">{{ t('pricing.digitalBanner.cta') }}</button>
      </div>
      <div class="dpb-services">
        <div class="dpb-item" v-for="(item, index) in digitalServices" :key="index">
          <IconBadge :icon="item.icon" :size="36" :radius="8" />
          <div><strong>{{ item.title }}</strong><span>{{ item.price }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import IconBadge from '../common/IconBadge.vue'

const router = useRouter()
const { t, tm } = useI18n()
const pricingPlans = computed(() => tm('pricing.plans'))
const digitalServices = computed(() => tm('digital.items'))
</script>

<style scoped>
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
}

.pricing-card {
  border-radius: var(--radius);
  padding: 36px 28px;
  transition: box-shadow 0.3s ease;
}

.pricing-card.featured {
  background: var(--ink);
  border: 1px solid var(--ink);
  color: white;
  transform: scale(1.03);
  position: relative;
  animation: glow-pulse 3.5s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 0 rgba(124,58,237,0); }
  50% { box-shadow: 0 0 40px rgba(124,58,237,0.35); }
}

.pricing-card:not(.featured):hover { box-shadow: var(--shadow-lg); }

.pricing-badge {
  display: inline-block;
  background: var(--accent);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 50px;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pricing-card h3 {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 8px;
}

.pricing-price {
  font-family: 'Syne', sans-serif;
  font-size: 44px;
  font-weight: 800;
  line-height: 1;
  margin: 20px 0;
}

.pricing-price sup { font-size: 20px; vertical-align: super; }
.pricing-price span { font-size: 14px; font-weight: 400; opacity: 0.6; }

.pricing-features {
  list-style: none;
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pricing-features li {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
}

.pricing-features li::before {
  content: '✓';
  width: 20px; height: 20px;
  background: var(--green-soft);
  color: var(--green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
}

.pricing-card.featured .pricing-features li { color: rgba(255,255,255,0.85); }
.pricing-card.featured .pricing-features li::before {
  background: rgba(255,255,255,0.15);
  color: white;
}

.digital-pricing-banner {
  margin-top: 24px;
  border-radius: var(--radius);
  padding: 40px 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.digital-pricing-banner::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 4px; height: 100%;
  background: linear-gradient(to bottom, #4f46e5, #be185d, #16a34a, #ea580c);
  border-radius: 4px 0 0 4px;
}

.dpb-tag {
  display: inline-block;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 14px;
}

.dpb-left h3 {
  font-family: 'Syne', sans-serif;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.2;
}

.dpb-left p {
  color: var(--text2);
  font-size: 15px;
  font-weight: 300;
  line-height: 1.7;
}

.dpb-services {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.dpb-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border2);
}

.dpb-item div { display: flex; flex-direction: column; gap: 2px; }

.dpb-item strong {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
}

.dpb-item span {
  font-size: 11px;
  color: var(--text2);
  font-style: italic;
}

@media (max-width: 768px) {
  .pricing-grid { grid-template-columns: 1fr; }
  .pricing-card.featured { transform: none; }
  .digital-pricing-banner { grid-template-columns: 1fr; padding: 28px 24px; gap: 28px; }
  .dpb-services { grid-template-columns: 1fr; }
}
</style>
