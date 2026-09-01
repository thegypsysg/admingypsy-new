/**
 * apiClient.js
 *
 * Satu-satunya Axios instance yang digunakan di seluruh aplikasi.
 * Menggantikan: axiosAbsensi (main.js) dan axios (util/axios.js).
 *
 * Cara penggunaan di komponen:
 *   import apiClient from '@/util/apiClient';
 *   const response = await apiClient.get('/endpoint');
 *
 * Atau via global property (sudah di-setup di main.js):
 *   this.$api.get('/endpoint')
 */

import axios from 'axios';
import router from '@/router';
import { tokenStorage } from '@/util/tokenStorage';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 180000, // 3 menit — sama dengan konfigurasi sebelumnya
  headers: {
    post: { Accept: 'application/json' },
  },
});

/**
 * Request Interceptor
 * Mengambil token terbaru dari sessionStorage SETIAP kali ada request.
 * Ini memperbaiki bug di mana token hanya diset sekali saat app load.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    const loginTime = tokenStorage.getLoginTime();

    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    if (loginTime) {
      config.headers.LoginTime = loginTime;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 * Handle error 401 (Unauthorized) secara terpusat.
 * Jika token expired atau invalid, clear semua data dan redirect ke login.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear semua data auth
      tokenStorage.clearAll();

      // Redirect ke halaman login
      // Cek apakah sudah di halaman login untuk menghindari infinite redirect
      if (router.currentRoute.value.name !== 'login') {
        router.push({ name: 'login' });
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
