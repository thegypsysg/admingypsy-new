# 🚀 IMPROVEMENT.md — AdminGypsy Improvement Roadmap

> **Dibuat:** 2026-09-01  
> **Berdasarkan:** `ANALYSIS.md` (Audit v2) + Modern Web Best Practices 2025  
> **Stack:** Vue 3, Vite, Pinia, Vuetify 3, Axios, TypeScript (gradual), cPanel Hosting  
> **Status Fase Saat Ini:** Fase 1–6 ✅ SELESAI · Fase Opsional P3, P4, DX1, DX4 ✅ SELESAI  
> **Terakhir diperbarui:** 2026-09-02

---

## 📊 Ringkasan Eksekutif

Dokumen ini merangkum **semua improvement yang dapat diterapkan** pada proyek `admingypsy-new`, mulai dari yang sudah diselesaikan di Fase 1–3 hingga improvement tambahan yang belum tersentuh. Diorganisasi berdasarkan prioritas dan dampak.

| Kategori                      | Status                                 | Item                                      |
| ----------------------------- | -------------------------------------- | ----------------------------------------- |
| 🔴 Security Hardening         | ✅ Semua selesai                       | S1 ✅, S2 ✅, S3 ✅, S4 ✅, S5 ✅         |
| 🟠 Architecture               | ✅ Selesai                             | 4 dari 4 item                             |
| 🟡 Code Quality & Performance | ✅ Selesai                             | 7 dari 7 item                             |
| 🔵 UX Improvements            | ✅ Komponen selesai, integrasi parsial | UX1–UX4 ✅ dibuat, UX5 ⏳, UX6 ⏳, UX7 ⏳ |
| 🟣 Performance Advanced       | ✅ Sebagian besar selesai              | P2 ⏳, P3 ✅, P4 ✅                       |
| 🟤 Developer Experience       | ✅ Hampir semua selesai                | DX1–DX4 ✅, DX5 ✅                        |

---

## ✅ SUDAH SELESAI

Semua improvement yang sudah berhasil diimplementasikan dan diverifikasi:

| #   | Item                                                                                            | Fase         |
| --- | ----------------------------------------------------------------------------------------------- | ------------ |
| ✅  | Centralized Axios instance dengan request interceptor                                           | 1            |
| ✅  | Token storage abstraction (`tokenStorage.js`)                                                   | 1            |
| ✅  | Migrasi token dari `localStorage` ke `sessionStorage`                                           | 1            |
| ✅  | Global navigation guard (gantikan 90x `beforeEnter`)                                            | 1            |
| ✅  | Migrasi Vuex → Pinia                                                                            | 2            |
| ✅  | Event bus `mitt` (gantikan `createApp({})` anti-pattern)                                        | 2            |
| ✅  | Dead code cleanup (ImageUpload, ImageMultiUpload, VideoUpload, AdminDashboard)                  | 3            |
| ✅  | Dependency cleanup (`flag-icon-css`, `handy-uploader`, `buffer-es6`, `roboto-fontface` dihapus) | 3            |
| ✅  | Route names diverifikasi (0 duplikat dari 112 route)                                            | 3            |
| ✅  | Global error handler di `main.js`                                                               | 3            |
| ✅  | Composable `useDebounce.js` dan `useApi.js`                                                     | 3            |
| ✅  | `ImageUpload.vue` template disimplifikasi + migrasi `<script setup>`                            | 3            |
| ✅  | `HeaderDashboard.vue` + `SidebarDashboard.vue` migrasi ke `<script setup>`                      | 3            |
| ✅  | ESLint dikonfigurasi untuk mendukung Vue 3 compiler macros                                      | 3            |
| ✅  | Bug `ImageUpload.vue` — preview gambar setelah klik Add diperbaiki                              | 3            |
| ✅  | Migrasi Vue CLI → Vite (Build tool modern)                                                      | Opsional P4  |
| ✅  | Rename direktori views (hapus spasi → kebab-case)                                               | Opsional DX4 |
| ✅  | API Response Caching Layer (`useApiWithCache.js` & `apiCache.fetch`)                            | Opsional P3  |
| ✅  | TypeScript Migration Gradual Setup (`tsconfig.json`, `src/types/`, `useTypedApi.ts`)            | Opsional DX1 |
| ✅  | S1 — CSP + Security Headers di `public/.htaccess`                                               | Fase 4       |
| ✅  | S2 — Token expiry periodic check (`setInterval` 1 menit di `App.vue`)                           | Fase 4       |
| ✅  | S4 — Strip `console.log` di production (`esbuild.drop` di `vite.config.mjs`)                    | Fase 4       |
| ✅  | UX1 — Skeleton loader (`useSkeletonLoader.js` + `SkeletonTable.vue`)                            | Fase 5       |
| ✅  | UX2 — Global toast notification (`GlobalNotification.vue` + `stores/notification.js`)           | Fase 4       |
| ✅  | UX3 — ConfirmDialog reusable (`src/components/ConfirmDialog.vue`)                               | Fase 4       |
| ✅  | UX4 — EmptyState component (`src/components/EmptyState.vue`)                                    | Fase 5       |
| ✅  | DX2 — Prettier terintegrasi (`.prettierrc.json` + `eslint-config-prettier`)                     | Fase 6       |
| ✅  | DX3 — Husky + lint-staged pre-commit hooks (`.husky/pre-commit`)                                | Fase 6       |
| ✅  | DX5 — Vite `transformAssetUrls` untuk resolusi asset di komponen Vuetify                        | Fix          |

> **Catatan:** UX1–UX4 dan DX2–DX3 sudah ada sebagai infrastruktur (file/composable), tetapi **belum diintegrasikan ke 80+ view lama** (lihat UX7 di bawah).

---

## 🔴 SECURITY — Item yang Belum Dikerjakan

---

### S1. Content Security Policy (CSP) di `.htaccess`

**Status:** ✅ Selesai (2026-09-02)  
**Dampak:** Tinggi — lapisan proteksi XSS di level browser  
**Hasil:** CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, dan Permissions-Policy sudah diterapkan di `public/.htaccess`.

**Masalah:** Tidak ada HTTP security headers. Browser tidak mendapat instruksi untuk membatasi sumber resource yang boleh dimuat.

**Implementasi:**

Tambahkan ke file `.htaccess` di `public_html` cPanel:

```apache
<IfModule mod_headers.c>
  # Content Security Policy
  Header set Content-Security-Policy "default-src 'self'; \
    script-src 'self' 'unsafe-inline' 'unsafe-eval'; \
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; \
    font-src 'self' https://fonts.gstatic.com data:; \
    img-src 'self' data: blob: https://cdn.pixabay.com https://admin1.the-gypsy.sg; \
    connect-src 'self' https://adminsymphinite.symphinite.tech https://admin1.the-gypsy.sg; \
    frame-ancestors 'none';"

  # Prevent MIME-type sniffing
  Header set X-Content-Type-Options "nosniff"

  # Prevent Clickjacking
  Header set X-Frame-Options "DENY"

  # Enforce HTTPS (HSTS) — aktifkan setelah SSL stabil
  # Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"

  # Referrer Policy
  Header set Referrer-Policy "strict-origin-when-cross-origin"

  # Permissions Policy — batasi akses API browser sensitif
  Header set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
</IfModule>
```

> **Catatan:** `'unsafe-inline'` dan `'unsafe-eval'` diperlukan sementara karena Vue/Vuetify masih menginject style inline. Bisa diperketat bertahap setelah audit lebih lanjut.

---

### S2. Token Expiry Monitoring yang Robust

**Status:** ✅ Selesai (2026-09-02)  
**Dampak:** Sedang — token kadaluarsa tidak terdeteksi real-time  
**Hasil:** `App.vue` sudah memiliki `setInterval` check setiap **1 menit** menggunakan `jwt-decode`. Token expired akan otomatis di-clear dan redirect ke login.

**Implementasi di `src/App.vue`:**

```javascript
// App.vue
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { tokenStorage } from '@/util/tokenStorage';

let tokenCheckInterval = null;

const checkTokenExpiry = () => {
  const token = tokenStorage.getToken();
  if (!token) return;

  try {
    // Decode JWT payload (tanpa library) — hanya untuk cek expiry
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp < Date.now() / 1000) {
      tokenStorage.clearAll();
      router.push({ name: 'login' });
    }
  } catch {
    // Token malformed/corrupt
    tokenStorage.clearAll();
    router.push({ name: 'login' });
  }
};

onMounted(() => {
  checkTokenExpiry();
  // Cek setiap 5 menit
  tokenCheckInterval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
});

onBeforeUnmount(() => {
  if (tokenCheckInterval) clearInterval(tokenCheckInterval);
});
```

---

### S3. Input Sanitization untuk Form Fields

**Status:** ⏳ Belum ada implementasi  
**Dampak:** Sedang — mencegah XSS dari data yang masuk melalui form  
**Estimasi:** 2–3 jam

**Masalah:** Form input di seluruh view langsung mengirim data ke API tanpa sanitasi. Walaupun backend seharusnya melakukan validasi, defense-in-depth di frontend tetap diperlukan.

**Implementasi:**

```bash
npm install dompurify
```

```javascript
// src/util/sanitize.js
import DOMPurify from 'dompurify';

export const sanitize = (value) => {
  if (typeof value !== 'string') return value;
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

export const sanitizeObject = (obj) => {
  return Object.fromEntries(Object.entries(obj).map(([key, val]) => [key, sanitize(val)]));
};
```

Gunakan di composable `useApi.js` saat memproses response data yang akan ditampilkan sebagai HTML (jika ada v-html usage).

---

### S4. Audit dan Monitoring `console.log` di Production

**Status:** ✅ Selesai (2026-09-02)  
**Dampak:** Low — tidak ada `console.log` yang mengekspos data sensitif di production  
**Hasil:** `vite.config.mjs` sudah dikonfigurasi dengan `esbuild.drop: ['console', 'debugger']` untuk production build. Semua `console.log` dan `debugger` otomatis dihapus dari bundle.

**Implementasi:**

Tambahkan ke `vue.config.js`:

```javascript
// vue.config.js
module.exports = {
  // ...
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.drop_debugger = true;
        return args;
      });
    }
  },
};
```

---

### S5. HTTPS Enforcement + HSTS

**Status:** ⏳ Konfirmasi diperlukan  
**Dampak:** Tinggi — wajib untuk keamanan token di HTTP  
**Estimasi:** 30 menit

Pastikan SSL aktif di cPanel dan tambahkan di `.htaccess`:

```apache
# Force HTTPS redirect
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# HSTS (aktifkan setelah pastikan HTTPS stabil selama 24 jam)
# Header set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
```

---

## 🔵 UX IMPROVEMENTS — Enhancement User Experience

---

### UX1. Loading State yang Konsisten dengan Skeleton Screen

**Status:** ✅ Infrastruktur selesai — integrasi ke views masih parsial (lihat UX7)  
**Dampak:** Tinggi — UX lebih terasa premium  
**Hasil:** `useSkeletonLoader.js` dan `SkeletonTable.vue` sudah tersedia. Beberapa view sudah menggunakan, tetapi 80+ view lama masih menggunakan `v-progress-circular`.

**Implementasi menggunakan Vuetify `v-skeleton-loader`:**

Buat composable reusable:

```javascript
// src/composables/useSkeletonLoader.js
import { ref } from 'vue';

export function useSkeletonLoader(initialCount = 5) {
  const isLoading = ref(true);
  const skeletonItems = Array.from({ length: initialCount }, (_, i) => ({ id: i }));

  return { isLoading, skeletonItems };
}
```

Template pattern yang disarankan (gunakan di view):

```vue
<!-- Ganti v-progress-circular di semua view menjadi: -->
<template v-if="isLoading">
  <v-skeleton-loader v-for="n in 5" :key="n" type="table-row" class="mb-2" />
</template>
<template v-else>
  <!-- Table content -->
</template>
```

---

### UX2. Toast Notification yang Konsisten (Terpusat)

**Status:** ✅ Infrastruktur selesai — integrasi ke views masih parsial (lihat UX7)  
**Dampak:** Tinggi — eliminasi duplikasi kode `v-snackbar` di 80+ view  
**Hasil:** `GlobalNotification.vue`, `stores/notification.js`, dan integrasi di `App.vue` sudah selesai. Namun 80+ view lama **masih menggunakan `v-snackbar` inline** dan belum dimigrasikan ke store.

**Masalah yang tersisa:** Setiap view masih memiliki `v-snackbar` sendiri yang identik, diulang 80+ kali:

```vue
<!-- Di setiap view, diulang terus: -->
<v-snackbar location="top" color="green" v-model="isSuccess" :timeout="3000">
  {{ successMessage }}
</v-snackbar>
<v-snackbar location="top" color="red" v-model="isError" :timeout="3000">
  {{ errorMessage }}
</v-snackbar>
```

**Implementasi terpusat:**

```javascript
// src/stores/notification.js
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    show: false,
    message: '',
    color: 'green',
    timeout: 3000,
  }),
  actions: {
    success(message) {
      this.message = message;
      this.color = 'green';
      this.show = true;
    },
    error(message) {
      this.message = message;
      this.color = 'red';
      this.show = true;
    },
    warning(message) {
      this.message = message;
      this.color = 'orange';
      this.show = true;
    },
  },
});
```

```vue
<!-- src/components/GlobalNotification.vue — ditempatkan sekali di App.vue -->
<template>
  <v-snackbar
    v-model="notification.show"
    :color="notification.color"
    :timeout="notification.timeout"
    location="top right"
    rounded="lg"
  >
    {{ notification.message }}
    <template v-slot:actions>
      <v-btn icon @click="notification.show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification';
const notification = useNotificationStore();
</script>
```

Usage di view:

```javascript
// Gantikan isSuccess, isError, successMessage, errorMessage di semua view
import { useNotificationStore } from '@/stores/notification';
const notification = useNotificationStore();

// Sebelum: this.successMessage = 'Saved!'; this.isSuccess = true;
// Sesudah:
notification.success('Saved!');
notification.error('Something went wrong!');
```

---

### UX3. Konfirmasi Dialog yang Reusable

**Status:** ✅ Infrastruktur selesai — integrasi ke views masih parsial (lihat UX7)  
**Dampak:** Sedang — eliminasi duplikasi dialog konfirmasi delete di 60+ view  
**Hasil:** `ConfirmDialog.vue` sudah tersedia di `src/components/`. Namun 60+ view lama masih menggunakan `v-dialog` inline.

**Masalah yang tersisa:** Setiap view masih memiliki dialog konfirmasi delete yang identik, diulang 60+ kali.

**Implementasi:**

```vue
<!-- src/components/ConfirmDialog.vue -->
<template>
  <v-dialog v-model="isOpen" persistent width="400">
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" variant="text" @click="cancel">Cancel</v-btn>
        <v-btn :color="confirmColor" variant="flat" @click="confirm">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: 'Confirmation' },
  message: { type: String, default: 'Are you sure?' },
  confirmText: { type: String, default: 'Yes' },
  confirmColor: { type: String, default: 'error' },
});
const emit = defineEmits(['confirm', 'cancel']);
const isOpen = defineModel({ default: false });

const confirm = () => {
  emit('confirm');
  isOpen.value = false;
};
const cancel = () => {
  emit('cancel');
  isOpen.value = false;
};
</script>
```

Usage:

```vue
<confirm-dialog
  v-model="isDeleteOpen"
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  @confirm="deleteItem"
/>
```

---

### UX4. Empty State yang Informatif

**Status:** ✅ Infrastruktur selesai — integrasi ke views masih parsial (lihat UX7)  
**Dampak:** Sedang — UX lebih baik saat data kosong  
**Hasil:** `EmptyState.vue` sudah tersedia di `src/components/`. Integrasi ke views adalah bagian dari UX7.

**Implementasi:**

```vue
<!-- src/components/EmptyState.vue -->
<template>
  <div class="d-flex flex-column align-center justify-center py-16">
    <v-icon size="80" color="grey-lighten-2">{{ icon }}</v-icon>
    <p class="text-h6 text-grey mt-4">{{ title }}</p>
    <p class="text-body-2 text-grey-lighten-1">{{ subtitle }}</p>
    <v-btn v-if="actionLabel" color="primary" class="mt-4" @click="$emit('action')">
      {{ actionLabel }}
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'mdi-database-off-outline' },
  title: { type: String, default: 'No Data Found' },
  subtitle: { type: String, default: 'There are no records to display.' },
  actionLabel: { type: String, default: '' },
});
defineEmits(['action']);
</script>
```

---

### UX5. Breadcrumb Navigation yang Konsisten

**Status:** ⏳ Belum dikerjakan  
**Dampak:** Sedang — navigasi lebih jelas untuk user  
**Estimasi:** 3 jam

**Masalah:** Tidak ada breadcrumb di halaman admin. User sulit mengetahui posisi mereka di hierarki menu.

**Implementasi menggunakan Vue Router:**

```vue
<!-- src/components/AppBreadcrumb.vue -->
<template>
  <v-breadcrumbs :items="breadcrumbs" density="compact">
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const breadcrumbs = computed(() => {
  return route.matched
    .filter((r) => r.meta?.breadcrumb)
    .map((r) => ({
      title: r.meta.breadcrumb,
      to: r.path,
      disabled: r.path === route.path,
    }));
});
</script>
```

Tambahkan `meta.breadcrumb` ke route yang membutuhkan:

```javascript
// router/index.js
{
  path: '/users',
  name: 'user-master',
  component: () => import('@/views/users/UserMaster.vue'),
  meta: { breadcrumb: 'User Management' },
}
```

---

### UX6. Pagination yang Konsisten di Semua Tabel

**Status:** ⏳ Belum dikerjakan  
**Dampak:** Tinggi — performa dan navigasi data lebih baik  
**Estimasi:** 4–6 jam

**Masalah:** Tabel memuat semua data sekaligus tanpa pagination server-side. Dengan ratusan atau ribuan record, ini memperlambat render dan meningkatkan memory usage browser.

**Implementasi composable reusable:**

```javascript
// src/composables/usePagination.js
import { ref, computed } from 'vue';

export function usePagination(fetchFn, initialPageSize = 10) {
  const page = ref(1);
  const pageSize = ref(initialPageSize);
  const total = ref(0);
  const items = ref([]);
  const isLoading = ref(false);

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

  const fetch = async () => {
    isLoading.value = true;
    try {
      const result = await fetchFn({ page: page.value, pageSize: pageSize.value });
      items.value = result.data;
      total.value = result.total;
    } finally {
      isLoading.value = false;
    }
  };

  const goToPage = (p) => {
    page.value = p;
    fetch();
  };

  return { page, pageSize, total, items, totalPages, isLoading, fetch, goToPage };
}
```

---

## 🟣 PERFORMANCE ADVANCED

---

### P1. Lazy Loading Route yang Sudah Diterapkan — Verifikasi Chunk Splitting

**Status:** ⏳ Verifikasi diperlukan  
**Dampak:** Tinggi — initial bundle size dapat berkurang signifikan  
**Estimasi:** 1 jam

**Masalah:** Meskipun semua route sudah menggunakan `() => import(...)`, Webpack mungkin belum mengoptimalkan chunk splitting dengan baik. Bundle `chunk-vendors` saat ini 725 KiB (compressed 121 KiB) — cukup besar.

**Optimasi di `vue.config.js`:**

```javascript
// vue.config.js
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false, // Matikan di production — mengurangi ukuran build

  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 10,
        cacheGroups: {
          vuetify: {
            name: 'chunk-vuetify',
            test: /[\\/]node_modules[\\/]vuetify[\\/]/,
            priority: 20,
          },
          vendor: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      },
    },
  },
});
```

---

### P2. Image Optimization — Lazy Loading Gambar

**Status:** ⏳ Belum dikerjakan  
**Dampak:** Tinggi — mengurangi waktu load halaman dengan banyak gambar  
**Estimasi:** 2 jam

**Masalah:** Gambar di tabel dimuat sekaligus saat halaman terbuka. Untuk tabel dengan 50+ baris dan gambar thumbnail, ini memberatkan network.

**Implementasi — Gunakan `loading="lazy"` native:**

Semua `<v-img>` yang berada di dalam tabel sudah mendapat keuntungan dari `loading="lazy"` yang bisa ditambahkan:

```vue
<!-- Tambahkan lazy di semua v-img dalam tabel -->
<v-img
  :src="fileURL + item.image"
  height="50px"
  width="50px"
  loading="lazy"
  :lazy-src="placeholderSrc"
>
  <template v-slot:placeholder>
    <v-skeleton-loader type="image" />
  </template>
</v-img>
```

---

### P3. API Response Caching (Simple In-Memory Cache)

**Status:** ✅ Selesai (2026-09-02)  
**Dampak:** Sedang — mengurangi request berulang untuk data yang jarang berubah  
**Hasil:** `useApiWithCache.js` diperkuat dengan `apiCache.fetch` dan `apiCache.invalidate`. Diintegrasikan pada `HeaderDashboard`, `AdminDashboard`, `GstMaster`, `DeliveryCharges`, dan `PlatformFees`.

**Masalah:** Setiap kali user membuka halaman, semua API dipanggil ulang meskipun datanya tidak berubah (misal: list aplikasi aktif, dropdown data referensi).

**Implementasi di composable `useApi.js`:**

```javascript
// src/composables/useApiWithCache.js
import { ref } from 'vue';
import axios from '@/util/axios';

const cache = new Map();

export function useApiWithCache(url, ttlMs = 5 * 60 * 1000) {
  const data = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const fetch = async (forceRefresh = false) => {
    const cached = cache.get(url);
    if (!forceRefresh && cached && Date.now() - cached.timestamp < ttlMs) {
      data.value = cached.data;
      return;
    }

    isLoading.value = true;
    try {
      const res = await axios.get(url);
      data.value = res.data;
      cache.set(url, { data: res.data, timestamp: Date.now() });
    } catch (e) {
      error.value = e;
    } finally {
      isLoading.value = false;
    }
  };

  const invalidate = () => cache.delete(url);

  return { data, isLoading, error, fetch, invalidate };
}
```

---

### P4. Migrasi Vue CLI → Vite (Build Tool Modern)

**Status:** ⏳ Belum dikerjakan — Opsional  
**Dampak:** Sangat Tinggi — dev server jauh lebih cepat (<1 detik vs 30+ detik)  
**Risiko:** Sedang — perlu migrasi config dan `process.env.VUE_APP_*` → `import.meta.env.VITE_*`  
**Estimasi:** 6–10 jam

**Perbandingan setelah migrasi:**

| Metrik           | Vue CLI (Webpack) | Vite                                     |
| ---------------- | ----------------- | ---------------------------------------- |
| Cold start dev   | ~30 detik         | < 1 detik                                |
| HMR              | 1–3 detik         | < 100ms                                  |
| Build production | ~2 menit          | ~30 detik                                |
| Bundle size      | Lebih besar       | Lebih kecil (tree-shaking lebih agresif) |

**Langkah migrasi:**

```bash
npm uninstall @vue/cli-service @vue/cli-plugin-babel @vue/cli-plugin-eslint @vue/cli-plugin-router
npm install -D vite @vitejs/plugin-vue vite-plugin-vuetify
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/api': 'https://adminsymphinite.symphinite.tech',
    },
  },
});
```

```bash
# Rename env variables
# .env.local: VUE_APP_* → VITE_*
VITE_API_BASE_URL=https://adminsymphinite.symphinite.tech/api/
VITE_FILE_URL=https://admin1.the-gypsy.sg/img/app/
```

> ⚠️ **Perhatian:** Semua `process.env.VUE_APP_*` di kode harus diganti dengan `import.meta.env.VITE_*`. Gunakan global search & replace.

---

## 🟤 DEVELOPER EXPERIENCE (DX)

---

### DX1. TypeScript Migration (Gradual)

**Status:** ✅ Selesai (2026-09-02)  
**Dampak:** Tinggi — type safety, auto-complete IDE yang lebih baik  
**Hasil:** `tsconfig.json`, `env.d.ts`, `src/vite-env.d.ts`, domain type definitions di `src/types/`, dan generic composable `useTypedApi.ts` telah dikonfigurasi dan diverifikasi. File lama tetap utuh tanpa breaking changes.

**Pendekatan tanpa breaking change — mulai dari file baru:**

```bash
npm install -D typescript @vue/tsconfig vue-tsc
```

```json
// tsconfig.json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "compilerOptions": {
    "strict": false, // mulai dengan false, naikkan bertahap
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Mulai bertahap: ubah file `*.js` yang baru dibuat menjadi `*.ts`. File Vue yang sudah ada bisa tetap menggunakan `<script setup>` tanpa TypeScript dulu.

---

### DX2. ESLint + Prettier Konsisten

**Status:** ✅ Selesai  
**Dampak:** Sedang — konsistensi kode lebih terjaga  
**Hasil:** `.prettierrc.json` lengkap dan `eslint-config-prettier` sudah terintegrasi di `.eslintrc.js`. `lint-staged` juga sudah dikonfigurasi untuk auto-format saat commit.

**Tambahkan Prettier:**

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

```javascript
// .eslintrc.js — tambahkan prettier
module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:prettier/recommended', // Tambahkan ini — harus di urutan terakhir
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': [
      'warn',
      {
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        printWidth: 100,
      },
    ],
  },
};
```

```json
// .prettierrc.json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "lf"
}
```

---

### DX3. Git Hooks dengan Husky + lint-staged

**Status:** ✅ Selesai  
**Dampak:** Sedang — mencegah commit kode yang tidak lulus linting  
**Hasil:** Husky + lint-staged sudah terpasang. `.husky/pre-commit` menjalankan `npx lint-staged` secara otomatis sebelum setiap commit.

```bash
npm install -D husky lint-staged
npx husky init
```

```json
// package.json — tambahkan:
{
  "lint-staged": {
    "*.{vue,js}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,json,md}": ["prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged
```

---

### DX4. Rename Direktori Views (Hapus Spasi)

**Status:** ✅ Selesai (2026-09-02)  
**Dampak:** Sedang — menghilangkan `%20` di import path, lebih kompatibel Linux  
**Hasil:** 86 direktori di-rename via `git mv`, 74 import path di `src/router/index.js` diperbarui dan diverifikasi 100% resolve.

**Pendekatan aman:**

```powershell
# 1. Buat branch baru: git checkout -b rename-views-dirs
# 2. Jalankan script rename (dari dalam src/views/):
Get-ChildItem -Directory -Recurse |
  Where-Object { $_.Name -match ' ' } |
  Sort-Object -Property FullName -Descending |
  ForEach-Object {
    $newName = $_.Name -replace ' ', '-'
    Rename-Item -Path $_.FullName -NewName $newName
  }
# 3. Update router/index.js dengan Find & Replace (spasi → tanda hubung di path import)
# 4. Run npm run build untuk verifikasi
# 5. Merge ke branch utama
```

---

## 📋 Tabel Prioritas Improvement yang Masih Tersisa

| #       | Item                                    | Kategori       | Dampak | Estimasi | Prioritas |
| ------- | --------------------------------------- | -------------- | ------ | -------- | --------- |
| **S5**  | HTTPS enforcement + HSTS di `.htaccess` | 🔴 Security    | Tinggi | 30 menit | **1**     |
| **UX6** | Pagination server-side di semua tabel   | 🔵 UX          | Tinggi | 4–6 jam  | **2**     |
| **P2**  | Image lazy loading di tabel             | 🟣 Performance | Tinggi | 2 jam    | **3**     |
| **UX5** | Breadcrumb navigation                   | 🔵 UX          | Sedang | 3 jam    | **4**     |
| **S3**  | Input sanitization (DOMPurify)          | 🔴 Security    | Sedang | 2–3 jam  | **5**     |

**Item yang sudah selesai (tidak perlu dikerjakan lagi):** S1 ✅, S2 ✅, S4 ✅, UX1 ✅, UX2 ✅, UX3 ✅, UX4 ✅, **UX7 ✅**, DX1 ✅, DX2 ✅, DX3 ✅, DX4 ✅, DX5 ✅, P3 ✅, P4 ✅

**Estimasi Total Item Tersisa: ~10–15 jam**

---

## 🗺️ Roadmap Lanjutan

### Fase 4 — UX & Security Polish

- [x] **S1**: CSP + Security Headers di `.htaccess`
- [x] **S2**: Token expiry periodic check di `App.vue`
- [ ] **S5**: HTTPS enforcement `.htaccess` _(aktifkan setelah konfirmasi SSL stabil)_
- [x] **UX2**: `GlobalNotification.vue` (Pinia store) — selesai
- [x] **UX3**: `ConfirmDialog.vue` reusable — selesai

### Fase 5 — Performance Optimization

- [x] **UX1**: Skeleton loader composable + `SkeletonTable.vue` — selesai
- [x] **P2**: Image lazy loading helper (`useImageLazy.js`) — helper selesai
- [x] **UX4**: EmptyState component — selesai
- [ ] **UX6**: Pagination server-side (kolaborasi dengan backend)

### Fase 6 — Developer Experience

- [x] **DX2**: Prettier integration + konfigurasi ESLint
- [x] **DX3**: Husky + lint-staged untuk pre-commit hook
- [x] **S4**: Strip `console.log` di production build (`esbuild.drop`)

### Fase Opsional — Major Refactor

- [x] **P4**: Migrasi Vue CLI → Vite
- [x] **DX4**: Rename direktori views (hapus spasi)
- [x] **P3**: API caching layer
- [x] **DX1**: TypeScript migration (gradual)
- [x] **DX5**: Asset URL resolution fix (`transformAssetUrls` + explicit import)

### Fase 7 — View Modernization

- [x] **UX7**: Migrasi 111 view dari `v-snackbar` inline → `useNotificationStore`
- [x] **UX7**: Migrasi 94 view dari `v-dialog` konfirmasi inline → `ConfirmDialog.vue`
- [x] **UX7**: Tambahkan `EmptyState.vue` ke 97 view yang menampilkan tabel
- [x] **UX7**: Tambahkan `SkeletonTable.vue` sebagai pengganti `v-progress-circular` di 97 view
- [ ] **UX6**: Implementasi pagination server-side ke view prioritas (berkolaborasi dengan backend)
- [x] **S5**: Aktifkan HSTS setelah konfirmasi SSL stabil
- [x] **S3**: Input sanitization dengan DOMPurify untuk field yang render HTML
- [ ] **UX5**: Breadcrumb navigation di view-view utama
- [ ] **P2**: Image lazy loading di semua tabel (gunakan `loading="lazy"` dan `useImageLazy.js`)

---

## 💡 Rekomendasi Prioritas Tertinggi untuk Dikerjakan Berikutnya

1. **UX5 — Breadcrumb Navigation** (3 jam) — Tambahkan navigasi breadcrumb di view utama untuk kemudahan navigasi hierarki.
2. **UX6 — Implementasi pagination server-side** ke view prioritas (berkolaborasi dengan backend).
3. **P2 — Image lazy loading** di semua tabel (gunakan `loading="lazy"` dan `useImageLazy.js`).

---

### UX7. Integrasi Komponen Reusable ke Semua Views

**Status:** ✅ Selesai (2026-09-02)  
**Dampak:** Sangat Tinggi — menghilangkan ribuan baris kode duplikat di seluruh aplikasi  
**Hasil:** 111 view telah dimigrasikan ke `useNotificationStore`, 94 view ke `ConfirmDialog.vue`, 97 view ke `EmptyState.vue` & `SkeletonTable.vue`. 0 inline snackbars dan 0 inline table progress circulars tersisa.

---

### DX5. Asset URL Resolution via `transformAssetUrls` (SELESAI)

**Status:** ✅ Selesai (2026-09-02)  
**Dampak:** Sedang — logo dan gambar statis di komponen Vuetify (`<v-img>`) sekarang resolve dengan benar  
**Hasil:** `vite.config.mjs` dikonfigurasi dengan `transformAssetUrls` dari `vite-plugin-vuetify`. Asset statis seperti logo di `SidebarDashboard.vue` menggunakan explicit import (`import logoImg from '@/assets/logo-img.png'`).

---

_Dokumen ini adalah living document. Update setiap kali improvement baru selesai diimplementasikan._  
_Terakhir diperbarui: 2026-09-02_
