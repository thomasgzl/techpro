import { gsap, ScrollTrigger } from './gsap.js'

// v-reveal                              fade + rise the element itself
// v-reveal="{ y: 60, delay: 0.1 }"       tweak distance / delay
// v-reveal="{ children: '.card', stagger: 0.08 }"   stagger the matching children instead
export const vReveal = {
  mounted(el, binding) {
    const opts = binding.value || {}
    const targets = opts.children ? el.querySelectorAll(opts.children) : el
    const hasTargets = opts.children ? targets.length > 0 : true
    if (!hasTargets) return

    gsap.set(targets, { opacity: 0, y: opts.y ?? 36 })

    el._revealTrigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: opts.duration ?? 0.9,
          delay: opts.delay ?? 0,
          ease: 'power3.out',
          stagger: opts.stagger ?? 0,
        })
      },
    })
  },
  unmounted(el) {
    el._revealTrigger?.kill()
  },
}
