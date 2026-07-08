<template>
  <div>
    <NavBar v-if="!route.meta.admin" />
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in" @enter="onEnter">
        <div class="page-view" :class="{ 'admin-view': route.meta.admin }" :key="route.name">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted, nextTick, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import NavBar from './components/layout/NavBar.vue'
import { useSmoothScroll, scrollToTop } from './animation/useSmoothScroll.js'
import { ScrollTrigger } from './animation/gsap.js'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

watchEffect(() => {
  document.title = t('meta.title')
})

onMounted(() => {
  useSmoothScroll()
})

router.afterEach(() => {
  scrollToTop()
})

function onEnter() {
  nextTick(() => ScrollTrigger.refresh())
}
</script>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

.page-view.admin-view {
  padding-top: 0;
}
</style>
