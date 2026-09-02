/**
 * useTypedApi.ts
 *
 * TypeScript-typed version of useApi composable.
 * Gunakan untuk komponen dan composable BARU.
 * Kompatibel dengan <script setup lang="ts"> atau standard script.
 */

import { ref } from 'vue';
import type { Ref } from 'vue';
import type { ApiError } from '@/types/api';

export interface UseTypedApiReturn<T> {
  data: Ref<T | null>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  execute: (
    requestFn: () => Promise<{ data: T }>,
    transform?: (data: T) => T,
  ) => Promise<T | null>;
  reset: () => void;
}

/**
 * TypeScript generic composable wrapper for API requests.
 *
 * @example
 * const { data, isLoading, error, execute } = useTypedApi<ApiResponse<AppItem[]>>();
 * onMounted(() => execute(() => axios.get('/app/active')));
 */
export function useTypedApi<T = unknown>(): UseTypedApiReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>;
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function execute(
    requestFn: () => Promise<{ data: T }>,
    transform?: (data: T) => T,
  ): Promise<T | null> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await requestFn();
      data.value = transform ? transform(response.data) : response.data;
      return data.value;
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: ApiError } } & Error;
      const message =
        apiErr.response?.data?.message ||
        apiErr.message ||
        'An unexpected error occurred.';
      error.value = message;
      console.error('[useTypedApi Error]', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  function reset(): void {
    data.value = null;
    isLoading.value = false;
    error.value = null;
  }

  return { data, isLoading, error, execute, reset };
}
