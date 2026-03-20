/**
 * Mobile Menu Module
 * Handles mobile navigation toggle
 *
 * HOW TO CUSTOMIZE:
 * - Toggle button: Element with id="mobile-menu-toggle"
 * - Menu container: Element with id="mobile-menu"
 */

/**
 * Initialize mobile menu toggle functionality
 */
export function initMobileMenu(): void {
  const toggleButton = document.getElementById('mobile-menu-toggle')
  const mobileMenu = document.getElementById('mobile-menu')

  if (!toggleButton || !mobileMenu) {
    console.warn('Mobile menu elements not found')
    return
  }

  // Toggle menu on button click
  toggleButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden')
  })

  // Close menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden')
    })
  })

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden')
    }
  })
}