# 🔍 ANALYSIS.md — AdminGypsy Project Code Review (v2)

> **Tanggal Analisis:** 2026-08-05 (diperbarui)
> **Tech Stack:** Vue 3, Vue CLI (Webpack), Vuex 4, Vue Router 4, Vuetify 3, Axios
> **Deployment:** cPanel Shared Hosting
> **Jumlah Halaman/Views:** 35+ direktori view
> **Ukuran Router:** 1.635 baris

---

## 📊 Ringkasan Eksekutif

Proyek ini adalah admin panel skala menengah-besar. Fungsionalitas berjalan, namun ditemukan sejumlah isu yang memengaruhi keamanan, performa, dan maintainability. Dokumen ini telah diperbarui untuk mempertimbangkan **konteks deployment cPanel** dan menambahkan rekomendasi **keamanan token** serta **best practice modern** yang relevan.

### Estimasi Total Waktu Perbaikan

| Kategori | Estimasi Waktu |
|----------|----------------|
| 🔴 Kritikal (Security & Bugs) | 6–9 jam |
| 🟠 Tinggi (Architecture) | 10–16 jam |
| 🟡 Sedang (Code Quality & Performance) | 10–16 jam |
| 🟢 Rendah (Best Practices) | 4–6 jam |
| **Total** | **30–47 jam** |

---

## 🔴 KRITIKAL

---

### 1. Dual Axios Instance & Hardcoded URL — Kompatibel dengan cPanel

**File:** `src/main.js`, `src/util/axios.js`

**Masalah:**
Terdapat dua instance Axios dengan URL berbeda yang berjalan paralel:
- `main.js` → `adminsymphinite.symphinite.tech/api/`
- `util/axios.js` → `admin1.the-gypsy.sg/api`

Token di-set **sekali saat load**, bukan di setiap request. Artinya jika token berubah di tengah sesi (misal re-login di tab lain), request tetap menggunakan token lama.

**❓ Apakah bisa diimplementasi di cPanel?**

> **✅ YA, 100% kompatibel dengan cPanel.**

Vue CLI menggunakan webpack yang **memproses file `.env` saat build time** (`npm run build`), bukan saat runtime. Nilai `VUE_APP_*` di-embed langsung ke dalam file JavaScript hasil build. Ini berarti:

- Server cPanel **tidak perlu** mendukung environment variable.
- Anda cukup buat `.env.production` di mesin lokal, build, lalu upload folder `dist/` ke cPanel seperti biasa.
- File `.env` **tidak ikut di-upload** ke server — hanya file hasil build.

**Alur kerja dengan cPanel:**
```
Developer Machine:
  1. Buat/edit file .env.production
  2. npm run build  ← nilai env di-embed di sini
  3. Upload folder dist/ ke public_html cPanel

Server cPanel:
  - Hanya menyajikan file statis dari dist/
  - Tidak perlu konfigurasi apapun
```

**Estimasi Waktu:** 2–3 jam

**Langkah Implementasi:**

Buat dua file environment di root project:

```bash
# .env.local (untuk development, jangan commit ke git)
VUE_APP_API_BASE_URL=https://adminsymphinite.symphinite.tech/api/
VUE_APP_FILE_URL=https://admin1.the-gypsy.sg/img/app/

# .env.production (untuk build production, jangan commit ke git)
VUE_APP_API_BASE_URL=https://adminsymphinite.symphinite.tech/api/
VUE_APP_FILE_URL=https://admin1.the-gypsy.sg/img/app/
```

Tambahkan ke `.gitignore`:
```
.env.local
.env.production
```

Buat satu file `src/util/apiClient.js` yang terpusat:
```javascript
// src/util/apiClient.js
import axios from 'axios';
import router from '@/router';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 180000,
  headers: { post: { Accept: 'application/json' } },
});

// Request Interceptor: ambil token terbaru SETIAP kali request
// (bukan sekali saat load seperti sekarang)
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token'); // lihat poin #2
  if (token) {
    config.headers.Authorization = token;
    config.headers.LoginTime = sessionStorage.getItem('loginTime') || '';
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      router.push('/auth/login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

Update `main.js` — hapus `axiosAbsensi`, gunakan `apiClient`:
```javascript
// main.js — versi bersih
import apiClient from './util/apiClient';

// Hapus semua kode axiosAbsensi (baris 22-60)
// Ganti dengan:
app.config.globalProperties.$api = apiClient;
app.config.globalProperties.$fileURL = process.env.VUE_APP_FILE_URL;
```

Hapus `src/util/axios.js` — tidak diperlukan lagi.

---

### 2. Keamanan Token — Migrasi dari localStorage ke sessionStorage

**File:** `src/main.js`, `src/util/apiClient.js`, `src/App.vue`, `src/components/SidebarDashboard.vue`, semua view yang mengakses localStorage

**Masalah Keamanan localStorage:**

`localStorage` rentan terhadap serangan **XSS (Cross-Site Scripting)**. Jika ada celah XSS di aplikasi, script berbahaya dapat:
1. Membaca token langsung: `localStorage.getItem('token')`
2. Mengirim token ke server attacker
3. Melakukan request API atas nama user (session hijacking)

Token yang disimpan di `localStorage` juga **persisten** — tetap ada meski browser ditutup, memanjangkan window of exposure.

**Perbandingan Opsi Penyimpanan Token:**

| Metode | XSS Protection | Persisten? | Perlu Backend Change? | Rekomendasi |
|--------|---------------|------------|----------------------|-------------|
| `localStorage` | ❌ Rentan | Ya (permanent) | Tidak | ❌ Hindari untuk token |
| `sessionStorage` | ⚠️ Masih rentan XSS, tapi terbatas | Tidak (hilang saat tab ditutup) | Tidak | ✅ Minimal viable improvement |
| `HttpOnly Cookie` | ✅ Aman dari XSS | Bisa dikontrol | **Ya** (server harus set cookie) | ✅ Terbaik jika backend support |
| In-memory (Vuex state) | ✅ Aman dari XSS | Tidak (hilang saat refresh) | Tidak | ⚠️ UX kurang nyaman |

**Rekomendasi Praktis untuk Proyek Ini:**

Karena backend mungkin belum mendukung HttpOnly Cookie, gunakan **strategi dua lapis**:

> **Opsi A (Minimal Change):** Pindahkan token ke `sessionStorage`.
> - Token hilang saat tab/browser ditutup → lebih aman.
> - Tidak perlu perubahan backend.
> - Masih rentan XSS tapi window of exposure jauh lebih kecil.

> **Opsi B (Lebih Aman):** Simpan token di Vuex (in-memory) + data non-sensitif di `sessionStorage`.
> - Token tidak bisa diakses JS lain → aman dari XSS.
> - User harus login ulang jika refresh halaman (bisa diatasi dengan auto-login dari sessionStorage dengan hati-hati).

**Estimasi Waktu:** 2–3 jam (Opsi A), 4–6 jam (Opsi B)

**Implementasi Opsi A — Migrasi ke sessionStorage:**

```javascript
// src/util/tokenStorage.js — Abstraksi storage agar mudah diganti
const TOKEN_KEY = 'token';
const LOGIN_TIME_KEY = 'loginTime';
const USER_KEY = 'user';

export const tokenStorage = {
  getToken: () => sessionStorage.getItem(TOKEN_KEY),
  setToken: (token) => sessionStorage.setItem(TOKEN_KEY, token),
  removeToken: () => sessionStorage.removeItem(TOKEN_KEY),

  getLoginTime: () => sessionStorage.getItem(LOGIN_TIME_KEY),
  setLoginTime: (time) => sessionStorage.setItem(LOGIN_TIME_KEY, time),

  getUser: () => JSON.parse(sessionStorage.getItem(USER_KEY) || 'null'),
  setUser: (user) => sessionStorage.setItem(USER_KEY, JSON.stringify(user)),

  clearAll: () => sessionStorage.clear(),
};
```

```javascript
// Cara pakai di komponen/store (ganti semua localStorage.getItem('token'))
import { tokenStorage } from '@/util/tokenStorage';

// Sebelum:
localStorage.getItem('token')
localStorage.setItem('token', value)
localStorage.clear()

// Sesudah:
tokenStorage.getToken()
tokenStorage.setToken(value)
tokenStorage.clearAll()
```

**Implementasi Opsi B — Token di Vuex (lebih aman):**

```javascript
// src/store/modules/auth.js
export default {
  namespaced: true,
  state: {
    token: null, // Token HANYA di memory — tidak tersimpan di browser storage
    user: JSON.parse(sessionStorage.getItem('user') || 'null'), // Data non-sensitif boleh di sessionStorage
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    token: (state) => state.token,
    currentUser: (state) => state.user,
    userName: (state) => state.user?.name || '',
    userRole: (state) => {
      const role = state.user?.role;
      if (role === 'S') return 'Superadmin';
      if (role === 'A') return 'Admin';
      return '';
    },
    userImage: (state) => state.user?.image || null,
    loginTime: (state) => state.user?.loginTime || null,
  },
  mutations: {
    SET_AUTH(state, { token, user }) {
      state.token = token; // Token di memory
      state.user = user;
      // Hanya data non-sensitif yang boleh disimpan
      sessionStorage.setItem('user', JSON.stringify(user));
    },
    CLEAR_AUTH(state) {
      state.token = null;
      state.user = null;
      sessionStorage.clear();
    },
  },
  actions: {
    login({ commit }, payload) {
      commit('SET_AUTH', payload);
    },
    logout({ commit }) {
      commit('CLEAR_AUTH');
    },
  },
};
```

**Tambahan: Proteksi XSS dengan Content Security Policy**

Tambahkan header CSP di `.htaccess` cPanel untuk lapisan perlindungan ekstra:
```apache
# public_html/.htaccess
<IfModule mod_headers.c>
  Header set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com data:; img-src 'self' data: https://cdn.pixabay.com https://admin1.the-gypsy.sg; connect-src 'self' https://adminsymphinite.symphinite.tech;"
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "DENY"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

---

### 3. Route Guard Copy-Paste 90+ Kali di `router/index.js`

**File:** `src/router/index.js` (1.635 baris!)

**Masalah:**
Setiap route memiliki kode `beforeEnter` yang identik diulang **~90 kali**:

```javascript
beforeEnter: (to, from, next) => {
  if (localStorage.getItem('token') == null) {
    next('/auth/login');
  } else { next(); }
},
```

**Estimasi Waktu:** 3–4 jam

**Implementasi dengan Global Guard (kompatibel dengan semua pendekatan token):**

```javascript
// src/router/index.js — dari 1.635 baris menjadi ~300 baris
import { createRouter, createWebHistory } from 'vue-router';
import { tokenStorage } from '@/util/tokenStorage'; // atau gunakan store

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/dashboard/AdminContainer.vue'),
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/login/AdminPage.vue'),
    meta: { public: true }, // satu-satunya route publik
  },
  {
    path: '/users',
    name: 'user-master',
    component: () => import('@/views/users/UsersContainer.vue'),
  },
  // ... semua route lain TANPA beforeEnter
  {
    path: '/:pathMatch(.*)*', // Catch-all
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }; // Scroll ke atas saat navigasi
  },
});

// SATU global guard — menggantikan 90x beforeEnter
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!tokenStorage.getToken(); // atau store.getters['auth/isAuthenticated']
  const isPublicRoute = to.meta?.public === true;

  if (!isAuthenticated && !isPublicRoute) {
    return next({ name: 'login' });
  }
  if (isAuthenticated && to.name === 'login') {
    return next({ name: 'home' });
  }
  next();
});

export default router;
```

---

### 4. Token Expiry Check di `App.vue` Tidak Lengkap

**File:** `src/App.vue`

**Masalah:**
- Cek hanya dilakukan sekali saat `mounted()`.
- Setelah `localStorage.clear()`, **tidak ada redirect** ke halaman login.
- Tidak ada penanganan jika token corrupt/invalid.

**Estimasi Waktu:** 1–2 jam

**Implementasi:**

```javascript
// App.vue
import jwtDecode from 'jwt-decode';
import { tokenStorage } from '@/util/tokenStorage';

export default {
  name: 'App',
  data: () => ({ tokenCheckInterval: null }),
  mounted() {
    this.checkTokenExpiry();
    // Cek setiap 1 menit
    this.tokenCheckInterval = setInterval(this.checkTokenExpiry, 60 * 1000);
  },
  beforeUnmount() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  },
  methods: {
    checkTokenExpiry() {
      const token = tokenStorage.getToken();
      if (!token) return;
      try {
        const { exp } = jwtDecode(token);
        if (exp < Date.now() / 1000) {
          tokenStorage.clearAll();
          this.$store.commit('auth/CLEAR_AUTH');
          this.$router.push({ name: 'login' }); // ← Redirect yang hilang
        }
      } catch {
        // Token malformed/corrupt
        tokenStorage.clearAll();
        this.$router.push({ name: 'login' });
      }
    },
  },
};
```

---

## 🟠 TINGGI (Architecture & Performance)

---

### 5. Migrasi Vuex 4 → Pinia (State Manager Resmi Vue 3)

**File:** `src/store/index.js`

**Konteks:**
Vuex 4 adalah state manager Vue 3 yang "lama". Tim Vue.js secara resmi merekomendasikan **Pinia** sebagai pengganti Vuex untuk proyek Vue 3 baru. Pinia lebih ringan, lebih intuitif, dan memiliki TypeScript support yang jauh lebih baik.

**Perbandingan:**
| Fitur | Vuex 4 | Pinia |
|-------|--------|-------|
| Boilerplate | Tinggi (state/mutations/actions/getters) | Rendah (hanya state/actions/getters) |
| TypeScript | Perlu konfigurasi manual | Otomatis |
| DevTools | ✅ | ✅ (lebih baik) |
| Bundle size | ~10kB | ~1.5kB |
| Hot Module Replacement | Terbatas | ✅ Penuh |
| Modules | Perlu namespace | Store terpisah per-file (lebih natural) |

**Estimasi Waktu:** 4–6 jam (termasuk migrasi store yang sudah ada)

**Contoh Implementasi:**

```bash
npm uninstall vuex
npm install pinia
```

```javascript
// main.js
import { createPinia } from 'pinia';
app.use(createPinia());

// src/stores/auth.js (gantikan src/store/modules/auth.js)
import { defineStore } from 'pinia';
import { tokenStorage } from '@/util/tokenStorage';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null, // In-memory untuk keamanan
    user: JSON.parse(sessionStorage.getItem('user') || 'null'),
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || '',
    userRole: (state) => {
      const r = state.user?.role;
      return r === 'S' ? 'Superadmin' : r === 'A' ? 'Admin' : '';
    },
    userImage: (state) => state.user?.image
      ? `${import.meta.env.VUE_APP_FILE_URL}${state.user.image}`
      : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  },
  actions: {
    setAuth(token, user) {
      this.token = token;
      this.user = user;
      sessionStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
      this.token = null;
      this.user = null;
      sessionStorage.clear();
    },
  },
});

// src/stores/navigation.js (pindahkan dari Vuex)
import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    items: [
      // ... data navigasi yang sekarang ada di Vuex
    ],
  }),
});
```

```javascript
// Penggunaan di komponen (jauh lebih clean dari Vuex)
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  // atau dengan Options API:
  computed: {
    userName() { return useAuthStore().userName; },
  },
};
```

---

### 6. `eventBus.js` — Anti-Pattern Vue 3

**File:** `src/util/eventBus.js`

**Masalah:** Membuat `createApp({})` kedua hanya untuk event bus. Anti-pattern di Vue 3.

**Estimasi Waktu:** 1–2 jam

**Implementasi dengan `mitt`:**

```bash
npm install mitt
```

```javascript
// src/util/eventBus.js — 3 baris, bersih
import mitt from 'mitt';
export default mitt();
```

---

### 7. Nama Direktori View Menggunakan Spasi

**Masalah:** 35 direktori dengan nama berspasi menyebabkan `%20` di import path dan masalah di Linux server.

**Estimasi Waktu:** 1–2 jam

**Script rename PowerShell (jalankan di `src/views/`):**
```powershell
Get-ChildItem -Directory -Recurse |
  Where-Object { $_.Name -match ' ' } |
  Sort-Object -Property FullName -Descending |
  ForEach-Object {
    $newName = $_.Name -replace ' ', '-'
    Rename-Item -Path $_.FullName -NewName $newName
  }
```

Setelah rename, update semua import path di `router/index.js` menggunakan Find & Replace.

---

## 🟡 SEDANG (Code Quality & Performance)

---

### 8. Migrasi ke Composition API + `<script setup>`

**Context:** Semua komponen saat ini menggunakan Options API yang lebih verbose. Vue 3 Composition API dengan `<script setup>` adalah standar modern yang lebih efisien.

**Estimasi Waktu:** 8–12 jam (bertahap, mulai dari komponen shared)

**Contoh — SidebarDashboard.vue sebelum vs sesudah:**

```vue
<!-- SEBELUM (Options API, verbose) -->
<script>
import Dropdown from './Dropdown.vue';
import app from '@/util/eventBus';

export default {
  components: { Dropdown },
  data() { return { rail: false, image: '', name: '', role: '' }; },
  computed: {
    navigation() { return this.$store.getters.navigation; }
  },
  mounted() {
    this.name = localStorage.getItem('name')?.slice(1, -1);
    // ...
  },
};
</script>
```

```vue
<!-- SESUDAH (Composition API + <script setup>, clean) -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNavigationStore } from '@/stores/navigation';
import eventBus from '@/util/eventBus';
import Dropdown from './Dropdown.vue';

const router = useRouter();
const authStore = useAuthStore();
const navStore = useNavigationStore();

const navigation = computed(() => navStore.items);
const userName = computed(() => authStore.userName);
const userRole = computed(() => authStore.userRole);
const userImage = computed(() => authStore.userImage);

const updateImage = (dataItems) => {
  const userId = parseInt(sessionStorage.getItem('id'));
  const img = dataItems.find((d) => d.id === userId)?.image;
  if (img) authStore.updateImage(img);
};

onMounted(() => eventBus.on('update-image', updateImage));
onBeforeUnmount(() => eventBus.off('update-image', updateImage));

const logout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};
</script>
```

---

### 9. Performa Tabel: Debounce Terpusat & Virtual Scrolling

**File:** Semua view dengan tabel data (MenuManagement.vue sudah pakai debounce tapi manual)

**Masalah:**
- Tabel dengan data besar memuat semua baris sekaligus — memberatkan DOM.
- Debounce diimplementasi secara manual dan berulang di tiap view.
- Pencarian/filter dilakukan di client side untuk semua data.

**Estimasi Waktu:** 3–4 jam

**Implementasi composable `useDebounce` (reusable):**

```javascript
// src/composables/useDebounce.js
import { ref } from 'vue';

export function useDebounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function useDebouncedRef(initialValue, delay = 300) {
  const value = ref(initialValue);
  const debouncedValue = ref(initialValue);
  
  watch(value, useDebounce((newVal) => {
    debouncedValue.value = newVal;
  }, delay));
  
  return { value, debouncedValue };
}
```

**Virtual scrolling untuk tabel besar (install `vue-virtual-scroller`):**
```bash
npm install vue3-virtual-scroller
```

---

### 10. Migrasi Vue CLI → Vite (Performa Build)

**Context:** Vue CLI menggunakan Webpack yang sudah legacy. Vite adalah build tool resmi Vue 3 yang jauh lebih cepat.

| | Vue CLI (Webpack) | Vite |
|-|-------------------|------|
| Cold Start Dev Server | 10–30 detik | < 1 detik |
| Hot Module Replacement | 1–3 detik | < 100ms |
| Build Production | 2–5 menit | 20–60 detik |
| Bundle size (dengan tree-shaking) | Lebih besar | Lebih kecil |
| Maintained? | ⚠️ Legacy mode | ✅ Aktif dikembangkan |

**Estimasi Waktu:** 4–8 jam

**Penting:** Vite menggunakan `import.meta.env.VITE_*` bukan `process.env.VUE_APP_*`. Semua env variable perlu di-rename.

```javascript
// .env.production (Vite)
VITE_API_BASE_URL=https://adminsymphinite.symphinite.tech/api/
VITE_FILE_URL=https://admin1.the-gypsy.sg/img/app/

// Penggunaan di kode:
import.meta.env.VITE_API_BASE_URL // gantikan process.env.VUE_APP_API_BASE_URL
```

---

### 11. Dead Code — Ratusan Baris Dikomentari

**Files:** `src/components/ImageUpload.vue` (~200 baris), `src/main.js`, `src/App.vue`, `MenuManagement.vue`

**Estimasi Waktu:** 2–3 jam

**Rekomendasi:** Hapus semua kode yang dikomentari. Git history menyimpannya. Gunakan `// TODO:` atau `// FIXME:` untuk kode yang masih pending.

---

### 12. Bug di `ImageUpload.vue` — `openInputImage` Mengosongkan Data

**File:** `src/components/ImageUpload.vue` baris 434–438

**Masalah:**
```javascript
openInputImage() {
  this.tempAttachment = []; // ← BUG: menghapus gambar yang sudah ada!
  this.isInsertImage = true;
},
```

Gambar yang sudah ada hilang dari tampilan begitu dialog dibuka.

**Perbaikan:**
```javascript
openInputImage() {
  this.btnLoader = false;
  this.image = [{ image_path: '', image: null }]; // reset hanya buffer input baru
  // tempAttachment TIDAK direset — gambar lama tetap tampil
  this.isInsertImage = true;
},
```

Sederhanakan pengecekan tipe file dengan lookup object:
```javascript
computed: {
  getFileType() {
    return (filename) => {
      const ext = filename.split('.').pop().toLowerCase();
      const types = {
        jpg: 'image', jpeg: 'image', png: 'image', tif: 'image', bmp: 'image',
        pdf: 'pdf',
        doc: 'word', docx: 'word', odt: 'word',
        xls: 'excel', xlsx: 'excel',
        pptx: 'powerpoint', pptm: 'powerpoint', ppt: 'powerpoint',
        mp4: 'video', mov: 'video', avi: 'video', wmv: 'video', flv: 'video',
        zip: 'archive', rar: 'archive', '7-zip': 'archive',
        txt: 'text', dwg: 'cad',
      };
      return types[ext] || 'unknown';
    };
  },
},
```

**Estimasi Waktu:** 2–3 jam

---

### 13. Duplikasi Dependency Package

**File:** `package.json`

**Package yang harus dihapus:**
- `font-awesome: ^4.7.0` → digantikan `@fortawesome/fontawesome-free: ^6.4.0`
- `flag-icon-css: ^4.1.7` → digantikan `flag-icons: ^6.11.0`
- `roboto-fontface` → Roboto sudah di-load via webfontloader
- `handy-uploader` → tidak terlihat digunakan
- `buffer-es6` → tidak terlihat digunakan

```bash
npm uninstall font-awesome flag-icon-css roboto-fontface handy-uploader buffer-es6
```

**Estimasi Waktu:** 1 jam

---

## 🟢 RENDAH (Best Practices)

---

### 14. Route Name Duplikat

**File:** `src/router/index.js`

**Masalah:**
```javascript
// Duplikat nama (baris 362 & 378):
{ name: 'primary skills regurable association', path: '/primary-skills/regu-assoc/:id' }
{ name: 'primary skills regurable association', path: '/primary-skills/country/:id' }

// Duplikat entitas:
{ name: 'restaurant master 2', path: '/restaurant-master' }
{ name: 'restaurant master', path: '/biryani-home/restaurant-master' }
```

**Estimasi Waktu:** 1 jam

**Rekomendasi:** Gunakan konvensi prefix modul, contoh:
```javascript
{ name: 'main.restaurant-master', path: '/restaurant-master' }
{ name: 'biryani.restaurant-master', path: '/biryani-home/restaurant-master' }
```

---

### 15. Global Error Handler

**File:** `src/main.js`

**Masalah:** Saat ini tidak ada penanganan error runtime yang terpusat. Jika terjadi unhandled error, user melihat layar putih tanpa informasi.

**Estimasi Waktu:** 1–2 jam

**Implementasi:**
```javascript
// main.js
app.config.errorHandler = (err, instance, info) => {
  console.error('Global Error:', err, info);
  // Opsional: kirim ke error tracking service (Sentry, dll)
};

// Tambahkan error boundary di App.vue dengan onErrorCaptured
// atau buat komponen ErrorBoundary.vue
```

---

## 📋 Tabel Prioritas Lengkap

| # | Isu | Severity | Estimasi | Prioritas |
|---|-----|----------|----------|-----------|
| 1 | Dual Axios + Hardcoded URL (cPanel-compatible) | 🔴 Kritikal | 2–3 jam | 1 |
| 2 | Keamanan Token (localStorage → sessionStorage/Vuex) | 🔴 Kritikal | 2–6 jam | 2 |
| 3 | Route guard 90x duplikasi | 🔴 Kritikal | 3–4 jam | 3 |
| 4 | Token expiry check tidak lengkap + redirect | 🔴 Kritikal | 1–2 jam | 4 |
| 5 | Migrasi Vuex → Pinia | 🟠 Tinggi | 4–6 jam | 5 |
| 6 | EventBus anti-pattern → mitt | 🟠 Tinggi | 1–2 jam | 6 |
| 7 | Nama direktori dengan spasi | 🟠 Tinggi | 1–2 jam | 7 |
| 8 | Migrasi Options API → Composition API | 🟡 Sedang | 8–12 jam | 8 |
| 9 | Performa tabel (debounce composable) | 🟡 Sedang | 3–4 jam | 9 |
| 10 | Migrasi Vue CLI → Vite | 🟡 Sedang | 4–8 jam | 10 |
| 11 | Dead code cleanup | 🟡 Sedang | 2–3 jam | 11 |
| 12 | Bug ImageUpload + simplifikasi template | 🟡 Sedang | 2–3 jam | 12 |
| 13 | Duplikasi dependency | 🟡 Sedang | 1 jam | 13 |
| 14 | Route name duplikat | 🟢 Rendah | 1 jam | 14 |
| 15 | Global error handler | 🟢 Rendah | 1–2 jam | 15 |
| | **TOTAL** | | **~36–64 jam** | |

---

## 🗺️ Roadmap Perbaikan (3 Fase)

### Fase 1 — Security Hardening (Prioritas Tinggi, ~8–15 jam)

Lakukan ini lebih dulu sebelum yang lain — berdampak langsung pada keamanan.

- [ ] Buat `.env.local` dan `.env.production` dengan API URL
- [ ] Buat `src/util/tokenStorage.js` (abstraksi storage)
- [ ] Buat `src/util/apiClient.js` (satu Axios instance)
- [ ] Update `main.js` — hapus `axiosAbsensi`, hapus `src/util/axios.js`
- [ ] Migrasi token dari localStorage → sessionStorage (Opsi A)
- [ ] Perbaiki token expiry + redirect di `App.vue`
- [ ] Refactor `router/index.js` dengan global navigation guard
- [ ] Tambahkan security headers di `.htaccess` cPanel

### Fase 2 — Architecture Upgrade (~10–16 jam)

- [ ] Install Pinia, buat `src/stores/auth.js` dan `src/stores/navigation.js`
- [ ] Uninstall Vuex, migrasi semua `$store` usage
- [ ] Install `mitt`, replace eventBus
- [ ] Rename direktori views (hapus spasi)
- [ ] Update semua import path di router

### Fase 3 — Code Quality & Performance (~18–33 jam)

- [ ] Migrasi komponen shared ke Composition API + `<script setup>`
- [ ] Buat composable `useDebounce`, `useApi`
- [ ] Hapus dead code (kode dikomentari)
- [ ] Perbaiki bug ImageUpload + sederhanakan template
- [ ] Hapus dependency duplikat
- [ ] Perbaiki route name duplikat
- [ ] Tambahkan global error handler
- [ ] (Opsional) Migrasi ke Vite

---

## 💡 Catatan Penting untuk Deployment cPanel

1. **Env Variable**: Buat `.env.production` di lokal, build (`npm run build`), upload `dist/`. File `.env` TIDAK perlu ada di server.
2. **SPA Routing**: Pastikan `.htaccess` di `public_html` sudah ada aturan rewrite untuk SPA:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
3. **HTTPS**: Pastikan SSL sudah aktif di cPanel — wajib untuk keamanan token.
4. **Subfolder Deploy**: Jika deploy di subfolder (bukan root domain), sesuaikan `publicPath` di `vue.config.js` dan `BASE_URL`.

---

*Dokumen ini dibuat berdasarkan analisis static code pada 2026-08-05 (revisi v2). Untuk analisis lebih mendalam, gunakan Vue DevTools, Lighthouse audit, dan lakukan profiling runtime.*
