import { gsap } from './gsap.js'

// v-tilt   → 3D tilt + lift + subtle drift that follows the cursor, used on cards.
export const vTilt = {
  mounted(el, binding) {
    // Passing `false` opts an element out — used when a CSS transform (e.g. a
    // featured card's scale) must not be clobbered by GSAP taking over `transform`.
    if (binding.value === false) return

    const strength = binding.value?.strength ?? 12
    const drift = binding.value?.drift ?? 14

    // Without a perspective, 3D rotation renders almost flat — this is what
    // gives the tilt its visible depth instead of a barely-there wobble.
    gsap.set(el, { transformPerspective: 700 })

    const setRotateX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' })
    const setRotateY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' })
    const setX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const setY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
    const setScale = gsap.quickTo(el, 'scale', { duration: 0.4, ease: 'power3.out' })

    // Cache the bounding rect once per hover instead of forcing a synchronous
    // layout read on every mousemove — that reflow was the main source of jank.
    let rect = null
    let queuedEvent = null
    let frameQueued = false

    function applyFromQueuedEvent() {
      frameQueued = false
      if (!rect || !queuedEvent) return
      const px = (queuedEvent.clientX - rect.left) / rect.width - 0.5
      const py = (queuedEvent.clientY - rect.top) / rect.height - 0.5
      setRotateY(px * strength)
      setRotateX(-py * strength)
      setX(px * drift)
      setY(py * drift - 6)
    }

    function onEnter() {
      rect = el.getBoundingClientRect()
      el.style.willChange = 'transform'
      setScale(1.03)
    }

    function onMove(e) {
      queuedEvent = e
      if (!frameQueued) {
        frameQueued = true
        requestAnimationFrame(applyFromQueuedEvent)
      }
    }

    function onLeave() {
      setRotateX(0)
      setRotateY(0)
      setX(0)
      setY(0)
      setScale(1)
      el.style.willChange = 'auto'
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    el._tiltCleanup = () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  },
  unmounted(el) {
    el._tiltCleanup?.()
  },
}
