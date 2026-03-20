/**
 * Theme Module
 * Handles dark/light mode toggle with localStorage persistence
 *
 * HOW TO CUSTOMIZE:
 * - Change default theme: Edit DEFAULT_THEME constant
 * - Toggle button: Element with id="theme-toggle"
 */

const STORAGE_KEY = 'theme'
const DEFAULT_THEME: 'dark' | 'light' = 'dark'

/**
 * Initialize theme toggle functionality
 */
export function initTheme(): void {
  const html = document.documentElement
  const themeToggle = document.getElementById('theme-toggle')

  // Get saved theme or use default
  const savedTheme = localStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null
  const theme = savedTheme || DEFAULT_THEME

  // Apply initial theme
  applyTheme(theme)

  // Listen for toggle clicks
  themeToggle?.addEventListener('click', () => {
    const currentTheme = html.classList.contains('dark') ? 'dark' : 'light'
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

    localStorage.setItem(STORAGE_KEY, newTheme)
    applyTheme(newTheme)
  })
}

/**
 * Apply theme to document
 */
function applyTheme(theme: 'dark' | 'light'): void {
  const html = document.documentElement
  const body = document.body

  if (theme === 'dark') {
    html.classList.add('dark')
    body.classList.add('bg-gray-950', 'text-gray-100')
    body.classList.remove('bg-gray-50', 'text-gray-900')
  } else {
    html.classList.remove('dark')
    body.classList.remove('bg-gray-950', 'text-gray-100')
    body.classList.add('bg-gray-50', 'text-gray-900')
  }
}
