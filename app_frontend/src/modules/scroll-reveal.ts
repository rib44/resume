/**
 * Scroll Reveal Module
 * Animates elements when they enter the viewport
 *
 * HOW TO USE:
 * Add class="reveal" to any element you want to animate
 *
 * HOW TO CUSTOMIZE:
 * - Edit OBSERVER_OPTIONS for timing/threshold
 * - Add stagger delays with .reveal-delay-1, .reveal-delay-2 classes
 */

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
}

/**
 * Initialize scroll reveal animations
 */
export function initScrollReveal(): void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
        // Optional: stop observing after animation
        // observer.unobserve(entry.target)
      }
    })
  }, OBSERVER_OPTIONS)

  // Observe all elements with .reveal class
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el)
  })
}
