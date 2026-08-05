# 🔐 IMPLEMENTATION.md — Fase 1: Security Hardening

> **Target Audiens:** Model Gemini Flash yang akan mengeksekusi task ini
> **Prasyarat:** Baca [`docs/README.md`](./README.md) dan [`ANALYSIS.md`](../ANALYSIS.md) terlebih dahulu
> **Fase:** 1 dari 3
> **Fokus:** Security Hardening — perbaikan keamanan fundamental

---

## 📋 Ringkasan Eksekutif

Fase 1 bertujuan memperbaiki **4 isu keamanan kritikal** yang saat ini ada di proyek AdminGypsy:

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Dua Axios instance dengan URL hardcoded | Inkonsistensi request, URL bocor di source |
| 2 | Token auth di `localStorage` | Rentan XSS — token bisa dicuri script |
| 3 | Route guard copy-paste 90x | Sulit maintain, bug berulang |
| 4 | Token expiry tidak redirect ke login | User stuck di halaman kosong |

**Setelah Fase 1 selesai:**
- ✅ Satu Axios instance terpusat dengan URL dari env variable
- ✅ Token lebih aman di `sessionStorage` dengan abstraksi layer
- ✅ Router bersih dari duplikasi — satu global guard
- ✅ Token expiry otomatis redirect ke login
- ✅ Security headers di server cPanel

---

## 🕐 Timeline & Estimasi

| Task | Nama | Estimasi | Urutan |
|------|------|----------|--------|
| T1 | Setup Environment Variables | 30 menit | 1 |
| T2 | Buat `tokenStorage.js` | 30 menit | 2 |
| T3 | Buat `apiClient.js` | 45 menit | 3 |
| T4 | Refactor `main.js` | 30 menit | 4 (setelah T3) |
| T5 | Hapus `util/axios.js` | 10 menit | 5 (setelah T4) |
| T6 | Migrasi localStorage → sessionStorage | 60–90 menit | 6 (setelah T2) |
| T7 | Perbaiki `App.vue` token expiry | 30–45 menit | 7 (setelah T2) |
| T8 | Refactor `router/index.js` | 90–120 menit | 8 (setelah T2) |
| T9 | Buat `.htaccess` security headers | 20 menit | 9 (independen) |
| | **TOTAL** | **~7–9 jam** | |

### Dependency Chart

```
T1 (env) ──────────────────────────────→ T3 (apiClient)
                                              ↓
T2 (tokenStorage) → T3 (apiClient) → T4 (main.js) → T5 (hapus axios.js)
       ↓
       ├──→ T6 (migrasi localStorage)
       ├──→ T7 (App.vue expiry)
       └──→ T8 (router refactor)

T9 (htaccess) → independen, bisa kapan saja
```

**Urutan yang HARUS diikuti:** T1 → T2 → T3 → T4 → T5, kemudian T6, T7, T8 bisa paralel, T9 kapan saja.

---

## 📊 Estimasi Resource

| Resource | Detail |
|----------|--------|
| **Model** | Gemini 2.5 Flash (High Thinking) |
| **Context yang diperlukan** | File proyek: `main.js`, `App.vue`, `router/index.js`, `src/util/`, `src/components/SidebarDashboard.vue`, `src/views/login/` |
| **Tools yang dibutuhkan** | `view_file`, `write_to_file`, `replace_file_content`, `multi_replace_file_content`, `run_command`, `grep_search` |
| **Waktu total** | 7–9 jam aktif eksekusi |
| **Risiko utama** | Breaking change pada auth flow — test menyeluruh wajib |

---

## ✅ Progress Checklist

Centang item berikut saat sudah selesai dikerjakan:

- [x] **T1** — File `.env.local` dan `.env.production` dibuat
- [x] **T2** — File `src/util/tokenStorage.js` dibuat
- [x] **T3** — File `src/util/apiClient.js` dibuat
- [x] **T4** — `src/main.js` direfactor (hapus axiosAbsensi, tambah apiClient)
- [x] **T5** — `src/util/axios.js` direfactor/di-redirect ke apiClient
- [x] **T6** — Semua `localStorage.getItem('token')` → `tokenStorage.getToken()`
- [x] **T7** — `src/App.vue` diperbaiki (periodic check + redirect)
- [x] **T8** — `src/router/index.js` direfactor (global guard)
- [x] **T9** — File `public/.htaccess` dibuat dengan security headers

---

## 📝 Detail Task

---

### T1 — Setup Environment Variables

**Deskripsi:**
Buat file `.env.local` (untuk development) dan `.env.production` (untuk build production) di root project. Ini menggantikan URL hardcoded yang sekarang ada di `main.js` dan `util/axios.js`. Vue CLI akan embed nilai ini ke dalam bundle saat `npm run build` — kompatibel dengan cPanel.

**Mengapa penting:**
- URL API tidak lagi hardcoded di source code
- Berbeda environment (dev/prod) bisa punya URL berbeda tanpa ubah kode
- File `.env` tidak ikut di-commit ke git (sensitive data)

**Estimasi Waktu:** 30 menit
**Complexity:** 🟢 Rendah
**Risk:** 🟢 Rendah — hanya membuat file baru, tidak mengubah file yang ada

**Step-by-Step Execution:**

**Langkah 1:** Baca `main.js` untuk mengetahui URL API yang saat ini digunakan
```
Tool: view_file
File: src/main.js
Range: baris 19–21
```

**Langkah 2:** Buat file `.env.local` di root project
```
Tool: write_to_file
Path: .env.local (di root project, sejajar dengan package.json)
```

Isi file `.env.local`:
```env
# Development environment — JANGAN COMMIT ke git
VUE_APP_API_BASE_URL=https://adminsymphinite.symphinite.tech/api/
VUE_APP_FILE_URL=https://admin1.the-gypsy.sg/img/app/
```

**Langkah 3:** Buat file `.env.production` di root project
```
Tool: write_to_file
Path: .env.production (di root project)
```

Isi file `.env.production`:
```env
# Production environment — JANGAN COMMIT ke git
VUE_APP_API_BASE_URL=https://adminsymphinite.symphinite.tech/api/
VUE_APP_FILE_URL=https://admin1.the-gypsy.sg/img/app/
```

**Langkah 4:** Tambahkan kedua file ke `.gitignore` agar tidak ter-commit
```
Tool: view_file
File: .gitignore
```
Cek apakah sudah ada `.env.local` dan `.env.production`. Jika belum, tambahkan:
```
Tool: replace_file_content atau append ke .gitignore
```
Tambahkan baris:
```
.env.local
.env.production
```

**Langkah 5:** Verifikasi — cek file yang baru dibuat sudah ada
```
Tool: view_file
File: .env.local
```

**Verifikasi Keberhasilan:**
- [ ] File `.env.local` ada di root project
- [ ] File `.env.production` ada di root project
- [ ] Kedua file ada di `.gitignore`

---

### T2 — Buat `src/util/tokenStorage.js`

**Deskripsi:**
Buat file abstraksi untuk penyimpanan token. File ini menjadi **single source of truth** untuk semua operasi token — get, set, remove. Dengan abstraksi ini, jika suatu saat ingin ganti `sessionStorage` ke metode lain, cukup ubah satu file ini.

**Mengapa penting:**
- Memisahkan concern penyimpanan dari logika bisnis
- Memudahkan refactoring di masa depan (misalnya: pindah ke memory store)
- Menstandarisasi cara akses token di seluruh aplikasi

**Estimasi Waktu:** 30 menit
**Complexity:** 🟢 Rendah
**Risk:** 🟢 Rendah — file baru, tidak ada breaking change

**Step-by-Step Execution:**

**Langkah 1:** Cek apakah file sudah ada (jika sudah, skip ke langkah 3)
```
Tool: view_file
File: src/util/tokenStorage.js
```

**Langkah 2:** Buat file `src/util/tokenStorage.js`
```
Tool: write_to_file
Path: src/util/tokenStorage.js
```

Isi file lengkap:
```javascript
/**
 * tokenStorage.js
 *
 * Abstraksi untuk penyimpanan token auth dan data user.
 * Menggunakan sessionStorage (lebih aman dari localStorage karena
 * data hilang saat browser/tab ditutup — mempersempit window of exposure XSS).
 *
 * Gunakan file ini sebagai satu-satunya tempat akses token.
 * Jangan gunakan localStorage.getItem('token') langsung di komponen.
 */

const KEYS = {
  TOKEN: 'token',
  LOGIN_TIME: 'loginTime',
  USER: 'user',
  NAME: 'name',
  ROLE: 'role',
  IMAGE: 'image',
  ID: 'id',
};

export const tokenStorage = {
  // Token
  getToken: () => sessionStorage.getItem(KEYS.TOKEN),
  setToken: (token) => sessionStorage.setItem(KEYS.TOKEN, token),
  removeToken: () => sessionStorage.removeItem(KEYS.TOKEN),

  // Login time
  getLoginTime: () => sessionStorage.getItem(KEYS.LOGIN_TIME),
  setLoginTime: (time) => sessionStorage.setItem(KEYS.LOGIN_TIME, String(time)),

  // User data (stored as JSON object)
  getUser: () => {
    try {
      return JSON.parse(sessionStorage.getItem(KEYS.USER) || 'null');
    } catch {
      return null;
    }
  },
  setUser: (user) => sessionStorage.setItem(KEYS.USER, JSON.stringify(user)),

  // Individual user fields (untuk backward compatibility)
  getName: () => {
    const raw = sessionStorage.getItem(KEYS.NAME);
    if (!raw) return '';
    // Handle jika data masih disimpan dengan tanda kutip (legacy localStorage format)
    return raw.startsWith('"') ? raw.slice(1, -1) : raw;
  },
  setName: (name) => sessionStorage.setItem(KEYS.NAME, name),

  getRole: () => {
    const raw = sessionStorage.getItem(KEYS.ROLE);
    if (!raw) return '';
    return raw.startsWith('"') ? raw.slice(1, -1) : raw;
  },
  setRole: (role) => sessionStorage.setItem(KEYS.ROLE, role),

  getImage: () => sessionStorage.getItem(KEYS.IMAGE),
  setImage: (image) => sessionStorage.setItem(KEYS.IMAGE, image),

  getId: () => sessionStorage.getItem(KEYS.ID),
  setId: (id) => sessionStorage.setItem(KEYS.ID, String(id)),

  // Clear semua data auth
  clearAll: () => sessionStorage.clear(),

  // Cek apakah user sudah login
  isAuthenticated: () => !!sessionStorage.getItem(KEYS.TOKEN),
};
```

**Langkah 3:** Verifikasi file berhasil dibuat
```
Tool: view_file
File: src/util/tokenStorage.js
```

**Verifikasi Keberhasilan:**
- [ ] File `src/util/tokenStorage.js` ada dan bisa dibaca
- [ ] Semua method tersedia: `getToken`, `setToken`, `clearAll`, `isAuthenticated`

---

### T3 — Buat `src/util/apiClient.js`

**Deskripsi:**
Buat satu Axios instance terpusat yang menggantikan dua instance yang bermasalah (`axiosAbsensi` di `main.js` dan instance di `util/axios.js`). Instance baru ini akan:
- Menggunakan URL dari environment variable (bukan hardcoded)
- Mengambil token terbaru dari `sessionStorage` di **setiap** request (bukan sekali saat load)
- Handle 401 error secara terpusat

**Dependency:** T1 dan T2 harus selesai terlebih dahulu.

**Estimasi Waktu:** 45 menit
**Complexity:** 🟡 Sedang
**Risk:** 🟡 Sedang — perubahan cara pengiriman token ke API

**Step-by-Step Execution:**

**Langkah 1:** Baca `main.js` untuk memahami konfigurasi Axios yang saat ini ada
```
Tool: view_file
File: src/main.js
Range: baris 1–70
```

**Langkah 2:** Baca `src/util/axios.js` untuk memahami instance kedua
```
Tool: view_file
File: src/util/axios.js
```

**Langkah 3:** Buat file `src/util/apiClient.js`
```
Tool: write_to_file
Path: src/util/apiClient.js
```

Isi file lengkap:
```javascript
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
  baseURL: process.env.VUE_APP_API_BASE_URL,
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
      config.headers.Authorization = token;
    }
    if (loginTime) {
      config.headers.LoginTime = loginTime;
    }

    return config;
  },
  (error) => Promise.reject(error)
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
  }
);

export default apiClient;
```

**Langkah 4:** Verifikasi file berhasil dibuat dan kontennya benar
```
Tool: view_file
File: src/util/apiClient.js
```

**Verifikasi Keberhasilan:**
- [ ] File `src/util/apiClient.js` ada
- [ ] `baseURL` menggunakan `process.env.VUE_APP_API_BASE_URL`
- [ ] Request interceptor mengambil token dari `tokenStorage.getToken()`
- [ ] Response interceptor handle 401 dan redirect ke login

---

### T4 — Refactor `src/main.js`

**Deskripsi:**
Bersihkan `main.js` dengan:
1. Hapus seluruh blok `axiosAbsensi` (baris 22–60)
2. Import `apiClient` dari file baru
3. Ganti `globalProperties.$axios` menjadi `globalProperties.$api`
4. Ganti `globalProperties.$fileURL` hardcoded menjadi dari env variable

**Dependency:** T3 harus selesai terlebih dahulu.

**Estimasi Waktu:** 30 menit
**Complexity:** 🟡 Sedang
**Risk:** 🟠 Tinggi — file ini adalah entry point aplikasi. Error di sini akan crash semua halaman.

> ⚠️ **PERINGATAN:** Baca seluruh `main.js` sebelum mengedit. Jangan hapus import CSS atau konfigurasi lain yang masih diperlukan.

**Step-by-Step Execution:**

**Langkah 1:** Baca `main.js` secara lengkap
```
Tool: view_file
File: src/main.js
```

**Langkah 2:** Identifikasi bagian yang akan dihapus (baris 19–60 approx):
- Baris 19–20: `const BASE_API_PATH = ...` → HAPUS
- Baris 22–24: `var axiosAbsensi = axios.create(...)` → HAPUS
- Baris 26–32: `axiosAbsensi.defaults.*` → HAPUS
- Baris 34–60: `axiosAbsensi.interceptors.*` → HAPUS
- Baris 62: `// Vue.prototype.$axios = axiosAbsensi;` → HAPUS (sudah dikomentari)

**Langkah 3:** Identifikasi import yang perlu diubah:
- `import axios from 'axios';` → HAPUS (tidak diperlukan lagi di main.js)
- Tambah: `import apiClient from './util/apiClient';`

**Langkah 4:** Edit `main.js` menggunakan `replace_file_content`

Target `main.js` setelah refactor:
```javascript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'maz-ui/css/main.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import '/node_modules/flag-icons/css/flag-icons.min.css';

import store from './store';
import apiClient from './util/apiClient';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

loadFonts();

const app = createApp(App);

// Global properties
app.config.globalProperties.$api = apiClient;
app.config.globalProperties.$fileURL = process.env.VUE_APP_FILE_URL;

app.component('VueDatePicker', VueDatePicker);
app.use(router).use(store).use(vuetify).mount('#app');
```

**Langkah 5:** Setelah edit, verifikasi `main.js` bisa di-parse tanpa error
```
Tool: view_file
File: src/main.js
```

**Langkah 6:** Cek di browser bahwa dev server masih berjalan (tidak crash)
- Buka http://localhost:8080
- Cek console browser untuk error

**Verifikasi Keberhasilan:**
- [ ] `main.js` tidak mengandung `axiosAbsensi` lagi
- [ ] `main.js` tidak mengandung `BASE_API_PATH` lagi
- [ ] `main.js` mengimport `apiClient` dari `./util/apiClient`
- [ ] `$api` dan `$fileURL` diset sebagai global properties
- [ ] Dev server tidak crash

---

### T5 — Hapus `src/util/axios.js`

**Deskripsi:**
File `src/util/axios.js` adalah Axios instance kedua yang sudah tidak diperlukan setelah `apiClient.js` dibuat. File ini perlu dihapus untuk menghindari confusion. Namun, **sebelum menghapus**, pastikan tidak ada file lain yang mengimportnya.

**Dependency:** T4 harus selesai terlebih dahulu.

**Estimasi Waktu:** 10 menit
**Complexity:** 🟢 Rendah
**Risk:** 🟠 Sedang — jika ada komponen yang masih import dari `util/axios.js`, penghapusan akan menyebabkan error.

**Step-by-Step Execution:**

**Langkah 1:** Cari semua file yang mengimport `util/axios.js`
```
Tool: grep_search
Query: util/axios
SearchPath: src/
```

Juga cari dengan pola lain:
```
Tool: grep_search
Query: from '@/util/axios'
SearchPath: src/
```

```
Tool: grep_search
Query: from '../util/axios'
SearchPath: src/
```

**Langkah 2:** Analisis hasil pencarian:
- Jika **tidak ada** file yang mengimport `util/axios.js` → lanjut ke langkah 3
- Jika **ada** file yang mengimport → update file tersebut untuk menggunakan `apiClient` sebelum menghapus

**Langkah 3:** Hapus file `src/util/axios.js`
```
Tool: run_command
Command: Remove-Item -Path "src\util\axios.js" -Force
Cwd: d:\Projects\freelance\admingypsy-new
```

**Langkah 4:** Verifikasi file sudah terhapus
```
Tool: run_command
Command: Test-Path "src\util\axios.js"
Cwd: d:\Projects\freelance\admingypsy-new
```
Hasil harus `False`.

**Verifikasi Keberhasilan:**
- [ ] `src/util/axios.js` tidak ada lagi
- [ ] Tidak ada file yang masih import dari `util/axios.js`
- [ ] Dev server masih berjalan normal

---

### T6 — Migrasi `localStorage` → `sessionStorage` (via tokenStorage)

**Deskripsi:**
Ganti semua penggunaan `localStorage.getItem('token')`, `localStorage.setItem('token', ...)`, dan `localStorage.clear()` yang berkaitan dengan auth, menggunakan method dari `tokenStorage.js`.

**Scope migrasi:** Hanya untuk data auth (token, name, role, image, loginTime, id). Data lain di localStorage (jika ada) tidak perlu diubah.

**Dependency:** T2 harus selesai terlebih dahulu.

**Estimasi Waktu:** 60–90 menit
**Complexity:** 🟡 Sedang
**Risk:** 🟠 Tinggi — memengaruhi login flow dan semua komponen yang baca data user.

> ⚠️ **PERINGATAN:** Setelah migrasi ini, user yang sedang login menggunakan localStorage lama akan otomatis ter-logout. Ini adalah behavior yang diinginkan dan normal.

**Step-by-Step Execution:**

**Langkah 1:** Cari semua penggunaan localStorage yang berkaitan dengan auth
```
Tool: grep_search
Query: localStorage.getItem('token')
SearchPath: src/
```

```
Tool: grep_search
Query: localStorage.setItem('token'
SearchPath: src/
```

```
Tool: grep_search
Query: localStorage.clear()
SearchPath: src/
```

```
Tool: grep_search
Query: localStorage.getItem('name')
SearchPath: src/
```

Catat semua file yang ditemukan.

**Langkah 2:** Update setiap file yang ditemukan

Untuk setiap file, lakukan substitusi berikut:

| Sebelum | Sesudah |
|---------|---------|
| `localStorage.getItem('token')` | `tokenStorage.getToken()` |
| `localStorage.setItem('token', value)` | `tokenStorage.setToken(value)` |
| `localStorage.getItem('name')` | `tokenStorage.getName()` |
| `localStorage.setItem('name', value)` | `tokenStorage.setName(value)` |
| `localStorage.getItem('role')` | `tokenStorage.getRole()` |
| `localStorage.setItem('role', value)` | `tokenStorage.setRole(value)` |
| `localStorage.getItem('image')` | `tokenStorage.getImage()` |
| `localStorage.setItem('image', value)` | `tokenStorage.setImage(value)` |
| `localStorage.getItem('loginTime')` | `tokenStorage.getLoginTime()` |
| `localStorage.setItem('loginTime', value)` | `tokenStorage.setLoginTime(value)` |
| `localStorage.getItem('id')` | `tokenStorage.getId()` |
| `localStorage.setItem('id', value)` | `tokenStorage.setId(value)` |
| `localStorage.clear()` | `tokenStorage.clearAll()` |
| `localStorage.removeItem('token')` | `tokenStorage.removeToken()` |

**Langkah 3:** Untuk setiap file yang diubah, tambahkan import `tokenStorage`:
```javascript
import { tokenStorage } from '@/util/tokenStorage';
// atau path relatif jika file bukan di src/
import { tokenStorage } from '../util/tokenStorage';
```

**Langkah 4:** File-file kritis yang HARUS diupdate:

**4a. `src/components/SidebarDashboard.vue`** — baca nama, role, image, loginTime
```
Tool: view_file
File: src/components/SidebarDashboard.vue
```
Update `mounted()` dan `updateImage()`:
```javascript
// mounted() — sebelum
this.name = localStorage.getItem('name')?.slice(1, -1);
const getRole = localStorage.getItem('role')?.slice(1, -1);

// mounted() — sesudah
this.name = tokenStorage.getName(); // getName() sudah handle .slice()
const getRole = tokenStorage.getRole(); // getRole() sudah handle .slice()
```

**4b. File login** (cari di `src/views/login/`)
```
Tool: grep_search
Query: localStorage.setItem
SearchPath: src/views/login/
```
Pastikan saat login, token disimpan via `tokenStorage.setToken()`.

**4c. `src/App.vue`** — sudah akan diupdate di T7.

**4d. `src/router/index.js`** — sudah akan diupdate di T8.

**Langkah 5:** Verifikasi tidak ada lagi `localStorage.getItem('token')` di src/
```
Tool: grep_search
Query: localStorage.getItem('token')
SearchPath: src/
```
Hasil harus kosong (0 matches).

**Verifikasi Keberhasilan:**
- [ ] Tidak ada `localStorage.getItem('token')` di `src/`
- [ ] Tidak ada `localStorage.setItem('token'` di `src/`
- [ ] Semua file yang diupdate sudah import `tokenStorage`
- [ ] Login masih berfungsi (test manual)
- [ ] Sidebar masih menampilkan nama dan role user

---

### T7 — Perbaiki Token Expiry di `src/App.vue`

**Deskripsi:**
Perbaiki dua bug di `App.vue`:
1. Setelah token expired, **tidak ada redirect** ke halaman login
2. Cek hanya dilakukan **sekali** saat `mounted()` — jika token expired saat user aktif, tidak terdeteksi

Solusi: Tambahkan periodic check setiap 1 menit dan tambahkan redirect.

**Dependency:** T2 harus selesai terlebih dahulu.

**Estimasi Waktu:** 30–45 menit
**Complexity:** 🟡 Sedang
**Risk:** 🟡 Sedang — jika periodic check bermasalah bisa menyebabkan loop redirect.

**Step-by-Step Execution:**

**Langkah 1:** Baca `App.vue` secara lengkap
```
Tool: view_file
File: src/App.vue
```

**Langkah 2:** Identifikasi bagian yang akan diubah:
- Bagian `<script>` — terutama `data()`, `mounted()`, dan `methods`

**Langkah 3:** Update `src/App.vue`

Target `App.vue` setelah perbaikan:
```vue
<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import jwtDecode from 'jwt-decode';
import { tokenStorage } from '@/util/tokenStorage';

export default {
  name: 'App',

  data: () => ({
    tokenCheckInterval: null,
  }),

  mounted() {
    // Cek token saat pertama kali load
    this.checkTokenExpiry();

    // Cek token setiap 1 menit (60.000 ms)
    // Ini mendeteksi token yang expired saat user sedang aktif
    this.tokenCheckInterval = setInterval(this.checkTokenExpiry, 60 * 1000);
  },

  beforeUnmount() {
    // Bersihkan interval saat komponen di-unmount untuk mencegah memory leak
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  },

  methods: {
    checkTokenExpiry() {
      const token = tokenStorage.getToken();

      // Jika tidak ada token, tidak perlu dicek
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token expired — bersihkan semua data dan redirect ke login
          tokenStorage.clearAll();

          // Redirect hanya jika belum di halaman login
          if (this.$route.name !== 'login') {
            this.$router.push({ name: 'login' });
          }
        }
      } catch {
        // Token malformed atau tidak bisa di-decode
        // Anggap tidak valid — clear dan redirect
        tokenStorage.clearAll();

        if (this.$route && this.$route.name !== 'login') {
          this.$router.push({ name: 'login' });
        }
      }
    },
  },
};
</script>

<style lang="scss">
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome.scss';

.image-upload-cont {
  width: 70px;
  height: 40px;
  overflow: hidden;
  border: 1px solid grey;
}

.image-upload-item {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
```

**Langkah 4:** Verifikasi perubahan
```
Tool: view_file
File: src/App.vue
```

**Langkah 5:** Test di browser:
- Login ke aplikasi
- Tunggu beberapa saat, pastikan tidak ada redirect yang tidak diinginkan
- Buka console dan tidak ada error JavaScript

**Verifikasi Keberhasilan:**
- [ ] `App.vue` menggunakan `tokenStorage.getToken()` bukan `localStorage`
- [ ] Ada `setInterval` untuk periodic check
- [ ] Ada `clearInterval` di `beforeUnmount`
- [ ] Ada redirect `this.$router.push({ name: 'login' })` setelah token expired
- [ ] Ada try-catch untuk handle token malformed

---

### T8 — Refactor `src/router/index.js` dengan Global Guard

**Deskripsi:**
Ini adalah task terbesar di Fase 1. Tujuannya adalah mengubah `router/index.js` dari 1.635 baris menjadi ~300–400 baris dengan:
1. Menghapus semua `beforeEnter` yang identik (copy-paste ~90 kali)
2. Menambahkan satu global `router.beforeEach()` yang menangani auth check
3. Menggunakan `tokenStorage` bukan `localStorage`
4. Memperbaiki route name yang duplikat
5. Menggunakan format route name yang konsisten

**Dependency:** T2 harus selesai terlebih dahulu.

**Estimasi Waktu:** 90–120 menit
**Complexity:** 🔴 Tinggi
**Risk:** 🔴 Tinggi — refactor file yang sangat besar. Kesalahan bisa memutuskan navigasi seluruh aplikasi.

> ⚠️ **STRATEGI AMAN:** Lakukan dengan cara Replace-Find pada pola `beforeEnter` menggunakan tool, bukan tulis ulang seluruh file. Ini meminimalkan risiko.

**Step-by-Step Execution:**

**Langkah 1:** Baca awal dan akhir `router/index.js`
```
Tool: view_file
File: src/router/index.js
Range: baris 1–50 (bagian awal)
```

```
Tool: view_file
File: src/router/index.js
Range: baris 1620–1635 (bagian akhir)
```

**Langkah 2:** Tambahkan import `tokenStorage` di baris paling atas file
```javascript
// Tambahkan setelah import createRouter
import { tokenStorage } from '@/util/tokenStorage';
```

**Langkah 3:** Hapus semua blok `beforeEnter` dari setiap route

Setiap route saat ini memiliki blok ini:
```javascript
beforeEnter: (to, from, next) => {
  // Pengecekan status login sebelum masuk ke halaman beranda
  if (localStorage.getItem('token') == null) {
    next('/auth/login'); // Alihkan ke halaman login jika belum masuk
  } else {
    next(); // Lanjutkan ke halaman beranda jika sudah masuk
  }
},
```

Gunakan Find & Replace untuk menghapus blok ini dari semua route:

> **Catatan untuk AI:** Karena ada ~90 blok identik yang perlu dihapus, gunakan tool `run_command` dengan PowerShell untuk melakukan penggantian massal. Ini lebih efisien daripada mengganti satu per satu.

```powershell
# Command untuk hapus semua blok beforeEnter dari router/index.js
$content = Get-Content "src\router\index.js" -Raw
$pattern = @'
,
    beforeEnter: \(to, from, next\) => \{
      // Pengecekan status login sebelum masuk ke halaman beranda
      if \(localStorage\.getItem\('token'\) == null\) \{
        next\('/auth/login'\); // Alihkan ke halaman login jika belum masuk
      \} else \{
        next\(\); // Lanjutkan ke halaman beranda jika sudah masuk
      \}
    \}
'@
$replacement = ''
$newContent = $content -replace $pattern, $replacement
Set-Content "src\router\index.js" -Value $newContent -Encoding UTF8
```

Jika ada variasi format (beberapa route mungkin tanpa komentar), cari dan hapus juga:
```powershell
$content = Get-Content "src\router\index.js" -Raw
$pattern2 = @'
,
    beforeEnter: \(to, from, next\) => \{
      if \(localStorage\.getItem\('token'\) == null\) \{
        next\('/auth/login'\);
      \} else \{
        next\(\);
      \}
    \}
'@
$newContent = $content -replace $pattern2, ''
Set-Content "src\router\index.js" -Value $newContent -Encoding UTF8
```

**Langkah 4:** Perbaiki catch-all route di akhir file

Cari baris:
```javascript
{
  path: '/*', // Rute ini akan menangkap semua rute yang tidak cocok dengan rute lainnya
  redirect: '/', // Alihkan ke halaman dashboard
},
```

Ganti dengan:
```javascript
{
  path: '/:pathMatch(.*)*',
  redirect: { name: 'home' },
},
```

**Langkah 5:** Tambahkan `meta: { public: true }` pada route login
Cari route login dan tambahkan meta:
```javascript
{
  name: 'login',
  path: '/auth/login',
  component: () => import('@/views/login/AdminPage.vue'),
  meta: { public: true }, // ← tambahkan ini
},
```

**Langkah 6:** Perbaiki route name yang duplikat

Cari nama duplikat:
- `'primary skills regurable association'` muncul 2x → rename satu menjadi `'primary-skills-country'`
- `'restaurant master'` (ada 2 versi) → `'main.restaurant-master'` dan `'biryani.restaurant-master'`
- `'dish master'` (ada 2 versi) → `'main.dish-master'` dan `'biryani.dish-master'`

**Langkah 7:** Tambahkan global guard dan `scrollBehavior` SEBELUM `export default router`

Cari baris:
```javascript
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
```

Ganti dengan:
```javascript
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // Selalu scroll ke atas saat navigasi halaman
    return { top: 0 };
  },
});

// Global Navigation Guard — menggantikan 90x beforeEnter yang identik
router.beforeEach((to, from, next) => {
  const isAuthenticated = tokenStorage.isAuthenticated();
  const isPublicRoute = to.meta?.public === true;

  // Jika belum login dan bukan route publik → redirect ke login
  if (!isAuthenticated && !isPublicRoute) {
    return next({ name: 'login' });
  }

  // Jika sudah login dan mencoba akses halaman login → redirect ke home
  if (isAuthenticated && to.name === 'login') {
    return next({ name: 'home' });
  }

  // Lanjut navigasi normal
  next();
});
```

**Langkah 8:** Verifikasi jumlah baris berkurang signifikan
```
Tool: run_command
Command: (Get-Content "src\router\index.js").Count
Cwd: d:\Projects\freelance\admingypsy-new
```
Jumlah baris seharusnya berkurang dari ~1.635 menjadi ~300–500 baris.

**Langkah 9:** Verifikasi tidak ada `localStorage` di router
```
Tool: grep_search
Query: localStorage
SearchPath: src/router/index.js
```
Hasil harus kosong.

**Langkah 10:** Test navigasi di browser
- Akses http://localhost:8080 (harus redirect ke login jika tidak login)
- Login ke aplikasi
- Navigasi ke beberapa halaman berbeda
- Pastikan tidak ada 404 atau redirect yang aneh

**Verifikasi Keberhasilan:**
- [ ] Tidak ada `beforeEnter` di route individual (kecuali jika ada yang memang berbeda)
- [ ] Ada satu `router.beforeEach()` di akhir file
- [ ] Route login punya `meta: { public: true }`
- [ ] Tidak ada `localStorage` di router
- [ ] Catch-all route menggunakan `'/:pathMatch(.*)*'`
- [ ] Tidak ada route name duplikat
- [ ] Navigasi aplikasi masih berfungsi normal

---

### T9 — Buat Security Headers di `.htaccess`

**Deskripsi:**
Tambahkan security headers dan aturan SPA routing di file `.htaccess` yang akan diupload ke cPanel. File ini memberikan lapisan keamanan tambahan di level server.

**Estimasi Waktu:** 20 menit
**Complexity:** 🟢 Rendah
**Risk:** 🟡 Sedang — konfigurasi `.htaccess` yang salah bisa menyebabkan halaman tidak bisa diakses.

**Step-by-Step Execution:**

**Langkah 1:** Cek apakah sudah ada `.htaccess` di folder `public/`
```
Tool: view_file
File: public/.htaccess (mungkin tidak ada)
```

**Langkah 2:** Buat file `public/.htaccess`
```
Tool: write_to_file
Path: public/.htaccess
```

> **Penting:** File ini harus ada di folder `public/` agar ikut ter-copy ke `dist/` saat build. Kemudian upload `dist/.htaccess` ke root `public_html` di cPanel.

Isi file `.htaccess`:
```apache
# ============================================================
# AdminGypsy — Apache Configuration
# Upload file ini ke: public_html/ di cPanel
# ============================================================

# SPA Routing — Redirect semua request ke index.html
# Wajib untuk Vue Router agar refresh halaman tidak 404
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Jangan rewrite jika file atau direktori sudah ada
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Semua request ke index.html
  RewriteRule . /index.html [L]
</IfModule>

# ============================================================
# Security Headers
# ============================================================
<IfModule mod_headers.c>

  # Content Security Policy (CSP)
  # Batasi sumber resource yang boleh dimuat browser
  # Sesuaikan domain di bawah jika ada perubahan URL API atau CDN
  Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://cdn.pixabay.com https://admin1.the-gypsy.sg; connect-src 'self' https://adminsymphinite.symphinite.tech https://admin1.the-gypsy.sg; frame-ancestors 'none';"

  # Mencegah browser menebak tipe konten (MIME sniffing attack)
  Header set X-Content-Type-Options "nosniff"

  # Mencegah halaman dimuat dalam iframe (clickjacking protection)
  Header set X-Frame-Options "DENY"

  # Kontrol informasi referrer saat navigasi ke situs lain
  Header set Referrer-Policy "strict-origin-when-cross-origin"

  # Paksa HTTPS untuk 1 tahun (hanya aktifkan jika SSL sudah terpasang!)
  # Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"

  # Hapus header yang mengekspos info server
  Header unset X-Powered-By
  Header always unset X-Powered-By

</IfModule>

# ============================================================
# Cache Control
# ============================================================
<IfModule mod_expires.c>
  ExpiresActive On

  # HTML tidak di-cache (agar update langsung terasa)
  ExpiresByType text/html "access plus 0 seconds"

  # Asset statis di-cache lama (Vue CLI sudah tambahkan hash di nama file)
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>

# ============================================================
# Gzip Compression (untuk performa)
# ============================================================
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
  AddOutputFilterByType DEFLATE application/json application/xml
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>
```

**Langkah 3:** Verifikasi file berhasil dibuat
```
Tool: view_file
File: public/.htaccess
```

**Langkah 4 (Informasi untuk User):**
Setelah `npm run build`, file `dist/.htaccess` akan terbentuk. Upload file ini ke `public_html/` di cPanel bersamaan dengan isi folder `dist/` lainnya.

> ⚠️ **PERHATIAN UNTUK USER:** Aktifkan baris `Strict-Transport-Security` hanya jika SSL Certificate sudah terpasang dan HTTPS aktif di cPanel. Mengaktifkan header ini tanpa SSL akan menyebabkan situs tidak bisa diakses.

**Verifikasi Keberhasilan:**
- [ ] File `public/.htaccess` ada dan berisi SPA routing rules
- [ ] File berisi security headers (CSP, X-Frame-Options, X-Content-Type-Options)
- [ ] Baris HSTS masih dikomentari (aman untuk kasus umum)

---

## ⚠️ Risk Register & Mitigasi

| # | Risk | Kemungkinan | Dampak | Mitigasi |
|---|------|-------------|--------|----------|
| R1 | Build gagal setelah hapus axiosAbsensi | Sedang | Tinggi | Jalankan `npm run serve` setelah T4 untuk verifikasi |
| R2 | Komponen yang masih pakai `$axios` (global property lama) | Rendah | Tinggi | Grep semua file: `grep_search "$axios"` di src/ |
| R3 | User ter-logout paksa setelah migrasi sessionStorage | Pasti | Rendah | Ini behavior yang diharapkan — informasikan ke user |
| R4 | Router refactor memutuskan navigasi | Sedang | Tinggi | Test setiap route setelah refactor T8 |
| R5 | `.htaccess` memblokir API request | Rendah | Tinggi | Test `connect-src` CSP header di browser DevTools |
| R6 | `beforeEnter` yang memiliki logika BERBEDA terhapus | Rendah | Sedang | Baca router.js dulu, cari `beforeEnter` yang unik sebelum hapus |
| R7 | env variable tidak terbaca (`undefined`) | Sedang | Tinggi | Pastikan nama variable diawali `VUE_APP_` |

---

## 🔍 Panduan Testing Setelah Implementasi

### Test Manual yang Wajib Dilakukan

Setelah semua task selesai, lakukan test berikut secara berurutan:

1. **Test Auth Flow:**
   - [ ] Buka http://localhost:8080 tanpa login → harus redirect ke `/auth/login`
   - [ ] Login dengan kredensial valid → harus berhasil masuk ke dashboard
   - [ ] Sidebar menampilkan nama dan role user dengan benar
   - [ ] Logout → harus kembali ke halaman login

2. **Test API Request:**
   - [ ] Buka halaman yang memuat data dari API (misal: Users, Restaurant Master)
   - [ ] Buka Network tab di DevTools browser
   - [ ] Cek header request: harus ada `Authorization` dengan token
   - [ ] Tidak ada error 401 jika token valid

3. **Test Token Expiry:**
   - [ ] Login ke aplikasi
   - [ ] Buka DevTools → Application → Session Storage
   - [ ] Hapus item `token` dari sessionStorage secara manual
   - [ ] Tunggu maksimal 1 menit atau navigasi ke halaman lain
   - [ ] Harus otomatis redirect ke halaman login

4. **Test Navigasi:**
   - [ ] Navigasi ke 5–10 halaman berbeda menggunakan sidebar
   - [ ] Tidak ada 404 atau blank page
   - [ ] URL di browser sesuai dengan halaman yang dikunjungi

5. **Test SessionStorage:**
   - [ ] Setelah login, buka DevTools → Application → Session Storage
   - [ ] Harus ada: `token`, `name`, `role`, `image`, `loginTime`
   - [ ] **Tidak boleh** ada token di `localStorage`

---

## 📝 Catatan Implementasi

> **Tulis di sini jika ada temuan, keputusan, atau perubahan dari rencana awal selama implementasi.**

```
[Tanggal] [Task] — Catatan:
...
```

---

*File ini dibuat pada 2026-08-05. Update progress checklist setiap kali menyelesaikan task.*
