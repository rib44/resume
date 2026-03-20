/**
 * Configuration Module
 * Centralized config for API endpoints and settings
 *
 * HOW TO CUSTOMIZE:
 * - Production API: Change PRODUCTION_API_URL
 * - Local API port: Change LOCAL_API_PORT if needed
 */

const LOCAL_API_PORT = '7071'

// ============================================
// UPDATE THIS with your Azure Functions URL
// Example: 'https://my-function-app.azurewebsites.net'
// ============================================
const PRODUCTION_API_URL = 'https://func-counter-46241.azurewebsites.net/api/'
/**
 * Get API base URL based on current environment
 */
function getApiBaseUrl(): string {
  const hostname = window.location.hostname

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://localhost:${LOCAL_API_PORT}`
  }

  // Override for testing local frontend with production backend
  // Set in browser console: localStorage.setItem('AZURE_FUNCTION_URL', 'https://...')
  const overrideUrl = localStorage.getItem('AZURE_FUNCTION_URL')
  if (overrideUrl) {
    return overrideUrl
  }

  // Production
  return PRODUCTION_API_URL
}

export const config = {
  apiBaseUrl: getApiBaseUrl(),
}