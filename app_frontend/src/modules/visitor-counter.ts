/**
 * Visitor Counter Module
 * Connects to Azure Functions backend for visitor tracking
 *
 * HOW TO CUSTOMIZE:
 * - API URL: Edit config.ts file
 * - Counter element: Element with id="visitor-count"
 * - Session keys: Change VISITED_KEY and COUNT_KEY
 */

import { config } from './config'

const VISITED_KEY = 'portfolio_visited'
const COUNT_KEY = 'portfolio_count'

/**
 * API response from Azure Functions
 */
interface VisitorResponse {
  visitors: number
}

/**
 * Initialize visitor counter
 */
export function initVisitorCounter(): void {
  const countElement = document.getElementById('visitor-count')

  if (!countElement) {
    console.warn('Visitor counter element not found')
    return
  }

  // Check if already visited in this session
  if (sessionStorage.getItem(VISITED_KEY)) {
    const cachedCount = sessionStorage.getItem(COUNT_KEY)
    if (cachedCount) {
      updateDisplay(countElement, parseInt(cachedCount, 10))
    }
    console.log('Returning visitor, using cached count')
    return
  }

  // Fetch from API
  fetchVisitorCount()
    .then(count => {
      updateDisplay(countElement, count)
      sessionStorage.setItem(VISITED_KEY, 'true')
      sessionStorage.setItem(COUNT_KEY, count.toString())
    })
    .catch(error => {
      console.error('Visitor counter error:', error)
      countElement.textContent = '—'
    })
}

/**
 * Fetch visitor count from API
 */
async function fetchVisitorCount(): Promise<number> {
  const response = await fetch(`${config.apiBaseUrl}/visitor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`)
  }

  const data: VisitorResponse = await response.json()
  return data.visitors
}

/**
 * Update counter display
 */
function updateDisplay(element: HTMLElement, count: number): void {
  element.textContent = count.toLocaleString()
}
