/**
 * AuraPredict AI - Enterprise API Client Configuration
 * Supports decoupled Vercel Frontend -> Render Backend cross-origin communication
 */

// Resolves backend API URL in production (e.g. https://aurapredict-backend.onrender.com)
// In local development or unified builds, falls back to relative root or window.location.origin
export const API_BASE_URL: string = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, ''); // Remove trailing slashes
  }
  return '';
})();

/**
 * Builds a full API endpoint URL
 * @param path Relative path, e.g. '/api/predict/forecast' or 'api/auth/login'
 */
export function apiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) {
    return cleanPath;
  }
  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Enterprise fetch wrapper with automatic CORS credentials and error handling
 */
export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const url = apiUrl(input);
  const options: RequestInit = {
    ...init,
    credentials: init?.credentials || (API_BASE_URL ? 'include' : 'same-origin'),
    headers: {
      'Accept': 'application/json',
      ...init?.headers,
    },
  };
  return fetch(url, options);
}
