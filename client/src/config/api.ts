/**
 * API and WebSocket Configuration
 * 
 * Configured via Vite environment variables:
 * - VITE_API_BASE_URL: Backend API base URL (e.g. http://127.0.0.1:8000 or https://your-backend.onrender.com)
 * - VITE_WS_BASE_URL: Backend WebSocket base URL (e.g. ws://127.0.0.1:8000 or wss://your-backend.onrender.com)
 */

const rawApiBase =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://127.0.0.1:8000";

// Ensure no trailing slash
export const API_BASE_URL = rawApiBase.replace(/\/+$/, "");

// Derive WebSocket base URL automatically if not explicitly provided
const deriveWsBase = (httpUrl: string): string => {
  if (httpUrl.startsWith("https://")) {
    return httpUrl.replace(/^https:\/\//, "wss://");
  }
  return httpUrl.replace(/^http:\/\//, "ws://");
};

export const WS_BASE_URL = (
  import.meta.env.VITE_WS_BASE_URL || deriveWsBase(API_BASE_URL)
).replace(/\/+$/, "");

/**
 * Resolves a path against API_BASE_URL.
 * Handles both relative paths ("/api/patient") and relative paths without leading slash.
 */
export const getApiUrl = (path: string): string => {
  if (!path) return API_BASE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Resolves a path against WS_BASE_URL.
 */
export const getWsUrl = (path: string): string => {
  if (!path) return WS_BASE_URL;
  if (path.startsWith("ws://") || path.startsWith("wss://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${WS_BASE_URL}${cleanPath}`;
};
