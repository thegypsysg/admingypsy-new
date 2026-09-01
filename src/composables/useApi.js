/**
 * useApi.js
 *
 * Composable wrapper untuk Axios request.
 * Menyediakan loading state, error state, dan data secara reaktif.
 *
 * Cara pakai di <script setup>:
 *
 *   import { ref } from 'vue';
 *   import { useApi } from '@/composables/useApi';
 *   import axios from '@/util/axios';
 *
 *   const { data, isLoading, error, execute } = useApi();
 *
 *   // Panggil saat mounted atau saat butuh fetch:
 *   onMounted(async () => {
 *     await execute(() => axios.get('/endpoint'));
 *   });
 *
 *   // Di template: v-if="isLoading", v-if="error", :items="data"
 */

import { ref } from 'vue';

/**
 * @returns {{ data: import('vue').Ref<any>, isLoading: import('vue').Ref<boolean>, error: import('vue').Ref<string|null>, execute: (requestFn: () => Promise<any>, transform?: (data: any) => any) => Promise<any>, reset: () => void }}
 */
export function useApi() {
  const data = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Eksekusi request API.
   * @param {() => Promise<any>} requestFn - Fungsi yang mengembalikan Promise (misal: () => axios.get('/url'))
   * @param {((data: any) => any)|null} [transform] - Opsional: transformasi data sebelum disimpan
   * @returns {Promise<any>}
   */
  async function execute(requestFn, transform = null) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await requestFn();
      data.value = transform ? transform(response.data) : response.data;
      return data.value;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'An unexpected error occurred.';
      error.value = message;
      console.error('[useApi Error]', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  function reset() {
    data.value = null;
    isLoading.value = false;
    error.value = null;
  }

  return { data, isLoading, error, execute, reset };
}
