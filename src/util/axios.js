import apiClient from './apiClient';

/**
 * Deprecated wrapper for backward compatibility.
 * Redirects all legacy imports to the centralized apiClient.
 */
export function setAuthHeader() {
  // Token header is automatically handled per-request by apiClient interceptor.
}

export default apiClient;
