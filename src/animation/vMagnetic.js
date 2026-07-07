import { gsap } from './gsap.js'

// v-magnetic   → button gently follows the cursor within its bounds, snaps back on leave.
export const vMagnetic = {
  mounted(el, binding) {
    const strength = binding.value ?? 0.35

    const setX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const setY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

    // Cache the rect on enter instead of reading layout on every mousemove.
    let rect = null
    let queuedEvent = null
    let frameQueued = false

    function applyFromQueuedEvent() {
      frameQueued = false
      if (!rect || !queuedEvent) return
      const relX = queuedEvent.clientX - (rect.left + rect.width / 2)
      const relY = queuedEvent.clientY - (rect.top + rect.height / 2)
      setX(relX * strength)
      setY(relY * strength)
    }

    function onEnter() {
      rect = el.getBoundingClientRect()
    }

    function onMove(e) {
      queuedEvent = e
      if (!frameQueued) {
        frameQueued = true
        requestAnimationFrame(applyFromQueuedEvent)
      }
    }

    function onLeave() {
      setX(0)
      setY(0)
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    el._magneticCleanup = () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  },
  unmounted(el) {
    el._magneticCleanup?.()
  },
}
