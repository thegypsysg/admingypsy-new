import { ref } from 'vue';
import axios from '@/util/axios';

// Module-level cache — shared across all composable instances
const _cache = new Map();

export function useApiWithCache(url, options = {}) {
  const {
    ttlMs = 5 * 60 * 1000, // default: 5 menit
    transformData = (data) => data,
    params = {},
  } = options;

  const data = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const _getCacheKey = () => {
    const paramKeys = Object.keys(params);
    const paramStr = paramKeys.length
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return url + paramStr;
  };

  const fetch = async (forceRefresh = false) => {
    const cacheKey = _getCacheKey();
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
    _cache.delete(_getCacheKey());
  };

  const clearAllCache = () => {
    _cache.clear();
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

// Export cache management utilities
export const apiCache = {
  clear: () => _cache.clear(),
  size: () => _cache.size,
  keys: () => Array.from(_cache.keys()),
};
