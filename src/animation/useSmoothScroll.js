import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap.js'

let lenis = null

// Wires Lenis' inertia scrolling into GSAP's ticker so ScrollTrigger stays in
// sync with the smoothed scroll position instead of the raw native one.
export function useSmoothScroll() {
  if (lenis) return lenis

  lenis = new Lenis({
    duration: 0.7,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lazySmoothing = false

  return lenis
}

export function scrollToTop() {
  lenis?.scrollTo(0, { immediate: true })
}
