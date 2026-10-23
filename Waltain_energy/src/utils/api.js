const configuredApiBase = import.meta.env.API_BASE_URL || 'http://localhost:8000'

export const API_BASE_URL = configuredApiBase.replace(/\/$/, '')

function getErrorMessage(payload) {
  const detail = payload?.detail
  if (Array.isArray(detail)) {
    return detail
      .map((issue) => {
        const field = Array.isArray(issue.loc) ? issue.loc.at(-1) : null
        const message = typeof issue.msg === 'string' ? issue.msg : 'Invalid value'
        return field ? `${field}: ${message}` : message
      })
      .join('. ')
  }
  if (typeof detail === 'string') return detail
  if (typeof payload?.error?.message === 'string') return payload.error.message
  return 'The request could not be completed.'
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(getErrorMessage(payload))
  }
  return payload
}

export function trackEvent(eventType, pagePath = window.location.pathname) {
  apiRequest('/api/v1/traffic/events', {
    method: 'POST',
    body: JSON.stringify({ event_type: eventType, page_path: pagePath }),
  }).catch((error) => {
    console.warn('Website analytics event could not be recorded.', error)
  })
}
