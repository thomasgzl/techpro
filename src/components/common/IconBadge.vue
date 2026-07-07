<template>
  <div class="icon-badge" :class="'tone-' + tone" :style="{ width: size + 'px', height: size + 'px', borderRadius: radius + 'px' }">
    <svg :width="size * 0.46" :height="size * 0.46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <template v-if="icon === 'web'">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </template>
      <template v-else-if="icon === 'design'">
        <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
      </template>
      <template v-else-if="icon === 'seo'">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </template>
      <template v-else-if="icon === 'accessibility'">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
      </template>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: String, required: true },
  size: { type: Number, default: 48 },
  radius: { type: Number, default: 10 },
})

// 'accessibility' maps to the shorter 'a11y' token name used in base.css.
const tone = computed(() => (props.icon === 'accessibility' ? 'a11y' : props.icon))
</script>

<style scoped>
.icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.3s ease, color 0.3s ease;
}

.tone-web { background: var(--tone-web-bg); color: var(--tone-web-fg); }
.tone-design { background: var(--tone-design-bg); color: var(--tone-design-fg); }
.tone-seo { background: var(--tone-seo-bg); color: var(--tone-seo-fg); }
.tone-a11y { background: var(--tone-a11y-bg); color: var(--tone-a11y-fg); }
</style>
