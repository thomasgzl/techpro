<template>
  <div class="faq-section" v-reveal="{ children: '.faq-item', stagger: 0.06 }">
    <div class="section-label faq-label">Questions fréquentes</div>
    <div
      class="faq-item"
      :class="{ open: openIndex === index }"
      v-for="(item, index) in faqItems"
      :key="item.question"
      @click="toggle(index)"
    >
      <div class="faq-question">
        {{ item.question }}
        <div class="faq-chevron">▼</div>
      </div>
      <Transition @enter="onEnter" @leave="onLeave" :css="false">
        <div class="faq-answer" v-if="openIndex === index">{{ item.answer }}</div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { faqItems } from '../../data/faq.js'
import { gsap } from '../../animation/gsap.js'

const openIndex = ref(null)

function toggle(index) {
  openIndex.value = openIndex.value === index ? null : index
}

function onEnter(el, done) {
  gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out', onComplete: done })
}

function onLeave(el, done) {
  gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: done })
}
</script>

<style scoped>
.faq-section {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 48px 80px;
}

.faq-label { text-align: center; margin-bottom: 32px; }

.faq-item {
  border-bottom: 1px solid var(--border);
  padding: 20px 0;
  cursor: pointer;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  gap: 16px;
}

.faq-chevron {
  flex-shrink: 0;
  width: 28px; height: 28px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: transform 0.3s;
}

.faq-item.open .faq-chevron { transform: rotate(180deg); background: var(--ink); color: white; }

.faq-answer {
  font-size: 14px;
  color: var(--text2);
  overflow: hidden;
  line-height: 1.7;
  padding-top: 16px;
}

@media (max-width: 768px) {
  .faq-section { padding: 0 20px 48px; }
}
</style>
