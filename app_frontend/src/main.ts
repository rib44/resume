/**
 * Main Entry Point
 *
 * This is the main entry point for the portfolio website.
 * It imports CSS and initializes all modules.
 *
 * MODULES:
 * - theme.ts: Dark/light mode toggle
 * - visitor-counter.ts: Azure Functions visitor tracking
 * - scroll-reveal.ts: Scroll-based animations
 * - mobile-menu.ts: Mobile navigation toggle
 */

import './style.css'
import { initTheme } from './modules/theme'
import { initVisitorCounter } from './modules/visitor-counter'
import { initScrollReveal } from './modules/scroll-reveal'
import { initMobileMenu } from './modules/mobile-menu'


// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearElement = document.getElementById('year')
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString()
  }

  // Initialize theme first (affects page styling)
  initTheme()

  // Initialize other modules
  initScrollReveal()
  initMobileMenu()

  // Visitor counter with delay to prevent bot triggers
  setTimeout(() => {
    initVisitorCounter()
  }, 2000)
})
