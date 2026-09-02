import { ref } from 'vue';
import axios from '@/util/axios';

// Module-level cache — shared across all composable instances
const _cache = new Map();

function buildCacheKey(url, params = {}) {
  const paramKeys = Object.keys(params);
  const paramStr = paramKeys.length
    ? '?' + new URLSearchParams(params).toString()
    : '';
  return url + paramStr;
}

/**
 * Global In-Memory API Cache Helper
 */
export const apiCache = {
  /**
   * Get cached data if still valid
   */
  get: (url, params = {}, ttlMs = 5 * 60 * 1000) => {
    const key = buildCacheKey(url, params);
    const cached = _cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttlMs) {
      return cached.data;
    }
    return null;
  },

  /**
   * Set cached data
   */
  set: (url, data, params = {}) => {
    const key = buildCacheKey(url, params);
    _cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  },

  /**
   * Invalidate specific URL cache (exact match or prefix match if params omitted)
   */
  invalidate: (url, params = null) => {
    if (params) {
      _cache.delete(buildCacheKey(url, params));
    } else {
      // Invalidate all cache keys matching url prefix
      for (const key of _cache.keys()) {
        if (key === url || key.startsWith(url + '?')) {
          _cache.delete(key);
        }
      }
    }
  },

  /**
   * Clear entire cache
   */
  clear: () => _cache.clear(),

  /**
   * Get current cache size
   */
  size: () => _cache.size,

  /**
   * Get all active cache keys
   */
  keys: () => Array.from(_cache.keys()),

  /**
   * Standalone async fetch with cache.
   * Returns standard Axios response object ({ data, status, ... }).
   */
  fetch: async (url, options = {}) => {
    const {
      ttlMs = 5 * 60 * 1000,
      params = {},
      forceRefresh = false,
    } = options;

    const key = buildCacheKey(url, params);
    const cached = _cache.get(key);

    if (!forceRefresh && cached && Date.now() - cached.timestamp < ttlMs) {
      return cached.data;
    }

    const response = await axios.get(url, { params });
    _cache.set(key, {
      data: response,
      timestamp: Date.now(),
    });
    return response;
  },
};

/**
 * Vue 3 Composable wrapper for reactive cached API requests.
 * @param {string} url - API Endpoint URL
 * @param {object} options - Configuration options (ttlMs, params, transformData, immediate)
 */
export function useApiWithCache(url, options = {}) {
  const {
    ttlMs = 5 * 60 * 1000, // default: 5 menit
    transformData = (data) => data,
    params = {},
  } = options;

  const data = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const fetch = async (forceRefresh = false) => {
    const cacheKey = buildCacheKey(url, params);
    const cached = _cache.get(cacheKey);

    // Return from cache if still valid
    if (!forceRefresh && cached && Date.now() - cached.timestamp < ttlMs) {
      data.value = cached.data;
      return data.value;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const res = await axios.get(url, { params });
      const transformed = transformData(res.data);

      data.value = transformed;
      _cache.set(cacheKey, {
        data: transformed,
        timestamp: Date.now(),
      });

      return transformed;
    } catch (e) {
      error.value = e?.response?.data?.message || e?.message || 'Request failed';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const invalidate = () => {
    apiCache.invalidate(url, params);
  };

  const clearAllCache = () => {
    apiCache.clear();
  };

  return {
    data,
    isLoading,
    error,
    fetch,
    invalidate,
    clearAllCache,
  };
}
