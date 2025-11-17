// lib/api.ts
import hackLog from '@/lib/logger';

/**
 * API Base URL from environment variable
 * Must be set in .env.local file
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

const fetcher = (url: string) => {
  hackLog.apiRequest('GET', url);
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.text()
      hackLog.apiError('GET', url, { status: response.status, error });
      throw new Error(`Request failed with status ${response.status}`)
    }
    const data = await response.json()
    hackLog.apiSuccess('GET', url, data);
    return data
  }).catch((error) => {
    hackLog.apiError('GET', url, error);
    throw error
  })
}

export const api = {
  fetcher,
  // Add API methods here as needed
}

// API endpoints for SWR
export const endpoints = {
  // Add SWR endpoints here as needed
}

export { API_BASE }
