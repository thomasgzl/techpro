import { gsap, ScrollTrigger } from './gsap.js'

// v-parallax="{ speed: 0.4 }"  → moves the element vertically as its
// container scrolls through the viewport. Positive speed lags behind
// (background feel), negative speed overtakes (foreground feel).
export const vParallax = {
  mounted(el, binding) {
    const speed = binding.value?.speed ?? 0.3
    const scroller = el.closest('[data-scroll-section]') || el.parentElement

    el._parallaxTween = gsap.fromTo(
      el,
      { y: () => -window.innerHeight * speed * 0.5 },
      {
        y: () => window.innerHeight * speed * 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: scroller,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  },
  unmounted(el) {
    el._parallaxTween?.scrollTrigger?.kill()
    el._parallaxTween?.kill()
  },
}
