/**
 * Centralized API Client Configuration
 * 
 * In development, VITE_API_BASE_URL is empty, allowing the Vite dev server
 * proxy to forward '/api' requests to http://localhost:5000.
 * 
 * In production, if the frontend (SPA) is hosted on Apache (/public_html/) and
 * the API server runs on a separate domain (e.g. https://api.himroots.in),
 * VITE_API_BASE_URL will prepend the proper API origin to all network requests.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export function apiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

/**
 * Global fetch wrapper that automatically prepends VITE_API_BASE_URL to all request paths.
 */
export async function apiFetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
  let url: string;
  if (typeof input === 'string') {
    url = apiUrl(input);
  } else if (input instanceof URL) {
    url = input.toString();
  } else if (input instanceof Request) {
    url = apiUrl(input.url);
  } else {
    url = apiUrl(String(input));
  }
  return fetch(url, init);
}

export default apiFetch;
