# 🔐 IMPLEMENTATION.md — Fase 1: Security Hardening ✅ SELESAI

> **Status:** COMPLETED (commit `39ce7f1d`)
> **Tanggal selesai:** 2026-08-05

**Yang sudah selesai di Fase 1:**
- ✅ `.env.local` dan `.env.production` dengan API URL
- ✅ `src/util/tokenStorage.js` (abstraksi sessionStorage)
- ✅ `src/util/apiClient.js` (satu Axios instance terpusat)
- ✅ `src/main.js` direfactor — hapus `axiosAbsensi`, tambah `$api`
- ✅ `src/util/axios.js` di-redirect ke `apiClient` untuk backward compat
- ✅ Login & Sidebar migrated ke `tokenStorage`
- ✅ `src/App.vue` — periodic token expiry check + redirect
- ✅ `src/router/index.js` — global `router.beforeEach` menggantikan 90x `beforeEnter`
- ✅ `public/.htaccess` — SPA routing, CSP headers, caching, Gzip

---

# 🏗️ IMPLEMENTATION.md — Fase 2: Architecture Upgrade ✅ SELESAI

> **Status:** COMPLETED
> **Tanggal selesai:** 2026-08-05
> **Target Audiens:** Model Gemini Flash (High) yang akan mengeksekusi task ini
> **Prasyarat WAJIB:** Baca [`docs/README.md`](./README.md) sebelum memulai
> **Fase:** 2 dari 3
> **Fokus:** Migrasi state management ke Pinia, penggantian EventBus, dan pembersihan dependency

---

## ⚠️ PERINGATAN KRITIS — BACA SEBELUM MEMULAI

> Percobaan implementasi Fase 2 sebelumnya **menyebabkan error pada banyak komponen UI**.
> Ikuti urutan task **secara ketat**. Jangan melompat atau menggabungkan task.

**Prinsip Aman yang WAJIB diikuti:**

1. **JANGAN uninstall Vuex** sampai setiap referensi `$store` sudah dikonfirmasi tergantikan.
2. **Jalankan Pinia dan Vuex secara paralel** sampai migrasi selesai.
3. **Verifikasi dev server tidak error setelah SETIAP task**, bukan hanya di akhir.
4. **Jangan ubah file komponen view** (di `src/views/`) kecuali yang disebutkan secara eksplisit.
5. **Ubah satu file per waktu**, lalu cek browser sebelum lanjut.

---

## 📋 Ringkasan Eksekutif

Fase 2 bertujuan melakukan upgrade arsitektur internal tanpa mengubah tampilan atau fungsionalitas aplikasi dari sudut pandang user.

| # | Perubahan | Dampak |
|---|-----------|--------|
| 1 | Install Pinia (berjalan paralel dengan Vuex) | State management lebih modern dan ringan |
| 2 | Buat `stores/navigation.js` di Pinia | Terpusat, reaktif, tanpa boilerplate Vuex |
| 3 | Migrasi `SidebarDashboard.vue` & `AdminDashboard.vue` ke Pinia | Hapus `$store.getters.navigation` |
| 4 | Uninstall Vuex (HANYA setelah T3 selesai dan terverifikasi) | Kurangi bundle size |
| 5 | Ganti `eventBus.js` dengan `mitt` | Hapus anti-pattern double Vue instance |

**Yang TIDAK dilakukan di Fase 2:**
- Tidak rename direktori views (dipindah ke Fase 3)
- Tidak mengubah komponen views individual
- Tidak migrasi ke Composition API (Fase 3)
- Tidak migrasi ke Vite (Fase 3)

---

## 🕐 Timeline & Estimasi

| Task | Nama | Estimasi | Urutan |
|------|------|----------|--------|
| T1 | Install Pinia + register di main.js | 15 menit | 1 |
| T2 | Buat `src/stores/navigation.js` | 20 menit | 2 (setelah T1) |
| T3 | Migrate `SidebarDashboard.vue` ke Pinia | 30 menit | 3 (setelah T2) |
| T4 | Migrate `AdminDashboard.vue` ke Pinia | 20 menit | 4 (setelah T3 terverifikasi) |
| T5 | Uninstall Vuex + cleanup | 20 menit | 5 (HANYA setelah T4) |
| T6 | Install `mitt` + update `eventBus.js` | 20 menit | 6 (independen) |
| T7 | Update `SidebarDashboard.vue` eventBus calls | 20 menit | 7 (setelah T6) |
| T8 | Update `UserMaster.vue` eventBus calls | 20 menit | 8 (setelah T6) |
| | **TOTAL** | **~2.5–3 jam** | |

### Dependency Chart

```
T1 (install pinia) → T2 (navigation store) → T3 (sidebar migrate) → T4 (admin migrate) → T5 (uninstall vuex)

T6 (install mitt) → T7 (sidebar eventbus) → T8 (usermaste eventbus)

T6 bisa dikerjakan paralel dengan T1-T4, TAPI T7 harus setelah T6 selesai.
```

---

## 📊 Estimasi Resource

| Resource | Detail |
|----------|--------|
| **Model** | Gemini 2.5 Flash (High Thinking) |
| **File yang diubah** | `main.js`, `SidebarDashboard.vue`, `AdminDashboard.vue`, `eventBus.js`, `UserMaster.vue`, `HeaderDashboard.vue` |
| **File yang TIDAK boleh diubah** | Semua file di `src/views/` KECUALI `UserMaster.vue` |
| **Tools yang dibutuhkan** | `run_command`, `view_file`, `replace_file_content`, `write_to_file`, `grep_search` |
| **Risiko utama** | Menghapus Vuex terlalu cepat sebelum migrasi selesai |

---

## ✅ Progress Checklist

- [x] **T1** — Pinia terinstall dan terdaftar di `main.js`
- [x] **T2** — `src/stores/navigation.js` dibuat
- [x] **T3** — `SidebarDashboard.vue` menggunakan Pinia, bukan `$store`
- [x] **T4** — `AdminDashboard.vue` menggunakan Pinia, bukan `$store`
- [x] **T5** — Vuex di-uninstall, `src/store/` dihapus, `main.js` dibersihkan
- [x] **T6** — `mitt` terinstall, `src/util/eventBus.js` diperbarui
- [x] **T7** — `SidebarDashboard.vue` menggunakan `mitt` API baru
- [x] **T8** — `UserMaster.vue` & `HeaderDashboard.vue` menggunakan `mitt` API baru

---

## 📝 Detail Task

---

### T1 — Install Pinia dan Register di `main.js`

**Deskripsi:**
Install Pinia secara paralel dengan Vuex yang masih ada. Pada tahap ini Vuex **belum** dihapus. Kedua state manager akan berjalan bersamaan sementara.

**Mengapa paralel?**
Menghapus Vuex sebelum semua komponen dimigrasi akan langsung menyebabkan error di `SidebarDashboard.vue` dan `AdminDashboard.vue`.

**Estimasi Waktu:** 15 menit
**Complexity:** 🟢 Rendah
**Risk:** 🟢 Rendah — hanya menambah dependency baru

**Step-by-Step Execution:**

**Langkah 1:** Install Pinia
```
Tool: run_command
Command: npm install pinia
Cwd: d:\Projects\freelance\admingypsy-new
WaitMsBeforeAsync: 30000
```

**Langkah 2:** Verifikasi Pinia terinstall
```
Tool: run_command
Command: node -e "require('pinia'); console.log('pinia ok')"
```

**Langkah 3:** Baca `main.js` untuk memahami struktur saat ini
```
Tool: view_file
File: src/main.js
```

**Langkah 4:** Update `main.js` — tambahkan Pinia, TETAP pertahankan Vuex

Cari baris import store:
```javascript
import store from './store';
```

Tambahkan Pinia di bawahnya:
```javascript
import store from './store';
import { createPinia } from 'pinia'; // ← tambahkan ini
```

Lalu pada bagian `app.use(...)`, tambahkan Pinia:
```javascript
// Sebelum:
app.use(router).use(store).use(vuetify).mount('#app');

// Sesudah:
const pinia = createPinia();
app.use(router).use(store).use(pinia).use(vuetify).mount('#app');
```

**Langkah 5:** Verifikasi dev server masih berjalan tanpa error
```
Tool: run_command
Command: (tunggu output dari npm run serve yang sudah berjalan)
```
Buka http://localhost:8080 di browser, pastikan tidak ada error di console.

**Verifikasi Keberhasilan:**
- [ ] `node_modules/pinia` ada di project
- [ ] `main.js` mengimport dan menggunakan `createPinia()`
- [ ] Vuex (`store`) masih ada dan terdaftar
- [ ] Dev server compiled tanpa error

---

### T2 — Buat `src/stores/navigation.js`

**Deskripsi:**
Buat Pinia store untuk navigation yang akan menggantikan data navigasi di Vuex. Isi data navigasi harus **persis sama** dengan yang ada di `src/store/index.js` saat ini.

> ⚠️ **PENTING:** Salin data `navigation` dari Vuex secara lengkap. Jangan kurangi atau ubah datanya.

**Estimasi Waktu:** 20 menit
**Complexity:** 🟢 Rendah
**Risk:** 🟢 Rendah — file baru, tidak mengubah yang sudah ada

**Step-by-Step Execution:**

**Langkah 1:** Baca seluruh `src/store/index.js` untuk mendapatkan data navigasi yang lengkap
```
Tool: view_file
File: src/store/index.js
```

**Langkah 2:** Buat folder `src/stores/` jika belum ada
```
Tool: run_command
Command: New-Item -ItemType Directory -Path "src\stores" -Force
Cwd: d:\Projects\freelance\admingypsy-new
```

**Langkah 3:** Buat file `src/stores/navigation.js`
```
Tool: write_to_file
Path: src/stores/navigation.js
```

Isi file:
```javascript
/**
 * navigation.js — Pinia Store
 *
 * Menggantikan Vuex navigation state.
 * Digunakan oleh SidebarDashboard.vue dan AdminDashboard.vue
 * untuk mendapatkan daftar menu navigasi sidebar.
 */

import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    navigation: [
      {
        title: 'Masters',
        open: false,
        subnav: [
          { title: 'Users', path: '/users' },
          {
            title: 'Gypsy Registrations',
            open: false,
            subnav: [
              { title: 'Invite Users', path: '/invite_users' },
              { title: 'Registered Users', path: '/registered_users' },
            ],
          },
          {
            title: 'App Master',
            open: false,
            subnav: [
              { title: 'App - New', path: '/app-new' },
              { title: 'App - Country & City', path: '/app-country' },
              { title: 'App - Socials', path: '/app-socials' },
            ],
          },
          { title: 'Partner Master', path: '/partner_master' },
          { title: 'On-Board Merchants', path: '/onboard-merchant' },
          { title: 'Restaurant Master', path: '/restaurant-master' },
          { title: 'Menu Management', path: '/menu-management' },
          { title: 'Dish Master', path: '/dish-master' },
          { title: 'Industry Master', path: '/industry_master' },
          { title: 'Position Master', path: '/position_master' },
          { title: 'Skills Master', path: '/skills-group' },
          { title: 'Category Master', path: '/category_master' },
          { title: 'Product Master', path: '/product_master' },
          { title: 'Cart Master', path: '/cart_master' },
          { title: 'Price List Master', path: '/price_list_master' },
          { title: 'Jobs Master', path: '/jobs-master' },
          { title: 'Application Master', path: '/application-master' },
          { title: 'Applicant Master', path: '/applicant-master' },
          { title: 'Qualification Master', path: '/qualification_master' },
          { title: 'Manage Countries', path: '/country-master' },
          { title: 'Manage Emails', path: '/email-master' },
          { title: 'Address Master', path: '/address-master' },
          { title: 'Platform Fee', path: '/platform-fee' },
          { title: 'GST', path: '/gst-master' },
          { title: 'Delivery Charges', path: '/delivery-charges' },
        ],
      },
      {
        title: 'Inquiries',
        open: false,
        subnav: [{ title: 'Websites' }, { title: 'Open Source' }],
      },
    ],
  }),

  getters: {
    getNavigation: (state) => state.navigation,
  },
});
```

> ⚠️ **Langkah 3b — VERIFIKASI DATA:** Setelah membuat file, bandingkan isi `navigation` array dengan `src/store/index.js`. Pastikan semua item menu sama persis. Jika ada perbedaan, ikuti data dari `src/store/index.js` sebagai sumber kebenaran.

**Langkah 4:** Verifikasi file berhasil dibuat
```
Tool: view_file
File: src/stores/navigation.js
```

**Verifikasi Keberhasilan:**
- [ ] File `src/stores/navigation.js` ada
- [ ] Data `navigation` array sama persis dengan `src/store/index.js`
- [ ] Dev server tidak error setelah file dibuat

---

### T3 — Migrate `SidebarDashboard.vue` ke Pinia

**Deskripsi:**
Update `SidebarDashboard.vue` untuk menggunakan Pinia store (`useNavigationStore`) sebagai pengganti `this.$store.getters.navigation`.

> ⚠️ **RISIKO TINGGI:** File ini adalah komponen inti sidebar. Error di sini akan menyebabkan sidebar tidak tampil di seluruh halaman.

**Estimasi Waktu:** 30 menit
**Complexity:** 🟡 Sedang
**Risk:** 🔴 Tinggi — komponen inti aplikasi

**Step-by-Step Execution:**

**Langkah 1:** Baca seluruh script section `SidebarDashboard.vue` secara lengkap
```
Tool: view_file
File: src/components/SidebarDashboard.vue
```
Catat:
- Baris import saat ini
- Cara `navigation` computed property digunakan
- Struktur `export default {}` secara lengkap

**Langkah 2:** Identifikasi baris yang perlu diubah

Cari baris:
```javascript
// Di bagian import (biasanya tidak ada import store karena pakai this.$store)

// Di computed:
navigation() {
  return this.$store.getters.navigation;
},
```

**Langkah 3:** Edit `SidebarDashboard.vue`

**3a. Tambahkan import Pinia store** di bagian atas `<script>`:
```javascript
import { useNavigationStore } from '@/stores/navigation';
```

**3b. Tambahkan `data()` property baru** untuk menyimpan navigation store:
```javascript
data() {
  return {
    // ... data yang sudah ada ...
    navStore: null, // ← tambahkan ini
  };
},
```

**3c. Inisialisasi `navStore` di `created()` atau `mounted()`**:

Tambahkan di awal `created()` (atau `mounted()` jika `created()` tidak ada):
```javascript
created() {
  this.navStore = useNavigationStore();
  // ... kode created() lainnya yang sudah ada ...
},
```

**3d. Update computed `navigation`**:
```javascript
// Sebelum:
navigation() {
  return this.$store.getters.navigation;
},

// Sesudah:
navigation() {
  return this.navStore ? this.navStore.navigation : [];
},
```

**Langkah 4:** Verifikasi perubahan tidak merusak file
```
Tool: view_file
File: src/components/SidebarDashboard.vue
```
Pastikan tidak ada syntax error (kurung kurawal tidak seimbang, koma hilang, dll).

**Langkah 5:** Buka browser http://localhost:8080
- Login ke aplikasi
- Pastikan **sidebar masih tampil** dengan semua menu yang benar
- Pastikan tidak ada error di browser console

**Verifikasi Keberhasilan:**
- [ ] `SidebarDashboard.vue` mengimport `useNavigationStore`
- [ ] Computed `navigation` menggunakan `this.navStore.navigation`
- [ ] Sidebar tampil normal di browser
- [ ] Semua menu di sidebar ada dan bisa diklik
- [ ] Tidak ada error di browser console

---

### T4 — Migrate `AdminDashboard.vue` ke Pinia

**Deskripsi:**
Sama seperti T3, update `AdminDashboard.vue` untuk menggunakan Pinia.

> `AdminDashboard.vue` adalah layout wrapper utama — error di sini akan menyebabkan seluruh halaman dashboard blank.

**Estimasi Waktu:** 20 menit
**Complexity:** 🟡 Sedang
**Risk:** 🔴 Tinggi — layout wrapper utama

**Step-by-Step Execution:**

**Langkah 1:** Baca seluruh `AdminDashboard.vue`
```
Tool: view_file
File: src/components/AdminDashboard.vue
```
Catat struktur lengkap script section.

**Langkah 2:** Lakukan perubahan yang sama seperti T3

**2a. Tambahkan import:**
```javascript
import { useNavigationStore } from '@/stores/navigation';
```

**2b. Tambahkan `navStore: null` di `data()`**

**2c. Inisialisasi `navStore` di `created()` atau `mounted()`:**
```javascript
this.navStore = useNavigationStore();
```

**2d. Update computed `navigation`:**
```javascript
navigation() {
  return this.navStore ? this.navStore.navigation : [];
},
```

**Langkah 3:** Verifikasi browser masih berfungsi normal

**Verifikasi Keberhasilan:**
- [ ] `AdminDashboard.vue` mengimport `useNavigationStore`
- [ ] Computed `navigation` menggunakan `this.navStore.navigation`
- [ ] Layout utama dashboard masih tampil normal
- [ ] Tidak ada error di console

---

### T5 — Verifikasi dan Uninstall Vuex

**Deskripsi:**
Ini adalah task yang paling berisiko. **HANYA lakukan ini jika T3 dan T4 sudah selesai dan terverifikasi berjalan normal di browser.**

> ⚠️ **WAJIB:** Sebelum menghapus Vuex, lakukan grep untuk memastikan tidak ada lagi `$store` di seluruh `src/`.

**Estimasi Waktu:** 20 menit
**Complexity:** 🟡 Sedang
**Risk:** 🔴 Tinggi — menghapus dependency yang masih mungkin digunakan

**Step-by-Step Execution:**

**Langkah 1 — WAJIB:** Cari semua sisa `$store` di seluruh proyek
```
Tool: grep_search
Query: $store
SearchPath: src/
```

**Jika ada hasil yang ditemukan:**
- STOP. Jangan lanjutkan ke langkah berikutnya.
- Update file yang masih menggunakan `$store` terlebih dahulu.
- Ulangi langkah 1 sampai hasilnya 0 (nol).

**Jika hasil pencarian kosong (0 matches):** Lanjut ke langkah 2.

**Langkah 2 — WAJIB:** Cari semua sisa `from 'vuex'` di seluruh proyek
```
Tool: grep_search
Query: from 'vuex'
SearchPath: src/
```

Jika masih ada hasil: update file tersebut dulu.

**Langkah 3:** Uninstall Vuex
```
Tool: run_command
Command: npm uninstall vuex @vue/cli-plugin-vuex
WaitMsBeforeAsync: 30000
```

**Langkah 4:** Hapus import Vuex dari `main.js`
```
Tool: view_file
File: src/main.js
```

Hapus baris:
```javascript
import store from './store'; // ← HAPUS baris ini
```

Dan hapus `store` dari `app.use(...)`:
```javascript
// Sebelum:
app.use(router).use(store).use(pinia).use(vuetify).mount('#app');

// Sesudah:
app.use(router).use(pinia).use(vuetify).mount('#app');
```

**Langkah 5:** Hapus folder `src/store/`
```
Tool: run_command
Command: Remove-Item -Path "src\store" -Recurse -Force
Cwd: d:\Projects\freelance\admingypsy-new
```

**Langkah 6:** Verifikasi dev server compiled tanpa error

Jika ada error:
- Baca error message dengan teliti
- Kemungkinan ada file yang masih mengimport dari `@/store` atau `vuex`
- Gunakan grep untuk mencari: `grep_search "from 'vuex'"` dan `grep_search "@/store"`
- Update file yang ditemukan

**Langkah 7:** Verifikasi browser berfungsi normal
- Login
- Pastikan sidebar tampil
- Navigasi ke beberapa halaman

**Verifikasi Keberhasilan:**
- [ ] `grep_search "$store"` di `src/` → 0 hasil
- [ ] `grep_search "from 'vuex'"` di `src/` → 0 hasil
- [ ] `vuex` tidak ada di `package.json` dependencies
- [ ] Folder `src/store/` sudah tidak ada
- [ ] Dev server compiled tanpa error
- [ ] Sidebar dan layout masih berfungsi normal

---

### T6 — Install `mitt` dan Update `eventBus.js`

**Deskripsi:**
Ganti implementasi event bus yang saat ini menggunakan `createApp({})` kedua (anti-pattern) dengan library `mitt` yang ringan dan benar.

**Konteks penting:** EventBus saat ini menggunakan API `$on`, `$off`, `$emit`. Pola ini akan tetap dipertahankan agar perubahan di komponen lain minimal.

**Estimasi Waktu:** 20 menit
**Complexity:** 🟢 Rendah
**Risk:** 🟡 Sedang — mengubah utility yang digunakan beberapa komponen

**Step-by-Step Execution:**

**Langkah 1:** Install `mitt`
```
Tool: run_command
Command: npm install mitt
WaitMsBeforeAsync: 30000
```

**Langkah 2:** Verifikasi `mitt` terinstall
```
Tool: run_command
Command: node -e "require('mitt'); console.log('mitt ok')"
```

**Langkah 3:** Pahami penggunaan eventBus saat ini
```
Tool: grep_search
Query: $eventBus
SearchPath: src/
MatchPerLine: true
```

Catat semua file yang menggunakan `$eventBus.$on`, `$eventBus.$off`, `$eventBus.$emit`, dan caranya.

**Langkah 4:** Baca `SidebarDashboard.vue` bagian eventBus
```
Tool: view_file
File: src/components/SidebarDashboard.vue
```
Cari baris:
```javascript
app.config.globalProperties.$eventBus.$on('update-image', this.updateImage);
app.config.globalProperties.$eventBus.$off('update-image', this.updateImage);
```

**Langkah 5:** Update `src/util/eventBus.js`

```
Tool: write_to_file (overwrite)
Path: src/util/eventBus.js
```

Isi baru:
```javascript
/**
 * eventBus.js
 *
 * Global event bus menggunakan `mitt`.
 * Menggantikan implementasi sebelumnya yang menggunakan createApp({}) kedua.
 *
 * API yang tersedia:
 *   eventBus.emit('event-name', payload)
 *   eventBus.on('event-name', handler)
 *   eventBus.off('event-name', handler)
 *
 * Cara import di komponen:
 *   import eventBus from '@/util/eventBus';
 */

import mitt from 'mitt';

const eventBus = mitt();

export default eventBus;
```

**Langkah 6:** Verifikasi file tersimpan
```
Tool: view_file
File: src/util/eventBus.js
```

> ⚠️ **PERHATIAN:** Setelah T6, komponen yang masih menggunakan `app.config.globalProperties.$eventBus.$on(...)` akan **error**. Segera lanjut ke T7 dan T8.

**Verifikasi Keberhasilan:**
- [ ] `mitt` terinstall
- [ ] `src/util/eventBus.js` menggunakan `mitt`
- [ ] File tidak lagi menggunakan `createApp({})`

---

### T7 — Update `SidebarDashboard.vue` untuk `mitt` API

**Deskripsi:**
Update `SidebarDashboard.vue` untuk menggunakan API `mitt` yang baru (`eventBus.on`, `eventBus.off`) menggantikan API lama (`app.config.globalProperties.$eventBus.$on`).

**Estimasi Waktu:** 20 menit
**Complexity:** 🟢 Rendah
**Risk:** 🟡 Sedang — komponen inti

**Step-by-Step Execution:**

**Langkah 1:** Baca bagian `created`, `beforeUnmount`, dan import di `SidebarDashboard.vue`
```
Tool: view_file
File: src/components/SidebarDashboard.vue
```

**Langkah 2:** Update import eventBus

Cari baris:
```javascript
import app from '@/util/eventBus';
```

Ganti dengan:
```javascript
import eventBus from '@/util/eventBus';
```

**Langkah 3:** Update `created()` lifecycle hook

Cari:
```javascript
created() {
  app.config.globalProperties.$eventBus.$on('update-image', this.updateImage);
},
```

Ganti dengan:
```javascript
created() {
  eventBus.on('update-image', this.updateImage);
},
```

**Langkah 4:** Update `beforeUnmount()` lifecycle hook

Cari:
```javascript
beforeUnmount() {
  app.config.globalProperties.$eventBus.$off(
    'update-image',
    this.updateImage
  );
},
```

Ganti dengan:
```javascript
beforeUnmount() {
  eventBus.off('update-image', this.updateImage);
},
```

**Langkah 5:** Verifikasi tidak ada lagi referensi ke `app.config.globalProperties.$eventBus` di file ini
```
Tool: grep_search
Query: $eventBus
SearchPath: src/components/SidebarDashboard.vue
```
Hasil harus 0.

**Langkah 6:** Buka browser, pastikan sidebar masih berfungsi normal.

**Verifikasi Keberhasilan:**
- [ ] `SidebarDashboard.vue` mengimport `eventBus from '@/util/eventBus'`
- [ ] `created()` menggunakan `eventBus.on(...)`
- [ ] `beforeUnmount()` menggunakan `eventBus.off(...)`
- [ ] Tidak ada `app.config.globalProperties.$eventBus` di file
- [ ] Dev server tidak error

---

### T8 — Update `UserMaster.vue` untuk `mitt` API

**Deskripsi:**
`UserMaster.vue` adalah satu-satunya view yang aktif menggunakan `$eventBus.$emit`. Update untuk menggunakan `mitt` API.

**Estimasi Waktu:** 20 menit
**Complexity:** 🟢 Rendah
**Risk:** 🟢 Rendah — hanya mengubah cara emit, tidak mengubah logika

**Step-by-Step Execution:**

**Langkah 1:** Baca bagian script `UserMaster.vue` — khususnya import dan baris yang menggunakan `$eventBus.$emit`
```
Tool: view_file
File: src/views/users/UserMaster.vue
Range: baris 254–270 (bagian import)
```

```
Tool: grep_search
Query: $eventBus
SearchPath: src/views/users/UserMaster.vue
MatchPerLine: true
```

**Langkah 2:** Update import

Cari:
```javascript
import app from '@/util/eventBus';
```

Ganti dengan:
```javascript
import eventBus from '@/util/eventBus';
```

**Langkah 3:** Update `$emit` calls

Cari:
```javascript
app.config.globalProperties.$eventBus.$emit('update-image', ...);
```

Ganti dengan:
```javascript
eventBus.emit('update-image', ...);
```

**Langkah 4:** Verifikasi tidak ada lagi referensi ke `app.config.globalProperties.$eventBus`
```
Tool: grep_search
Query: $eventBus
SearchPath: src/views/users/UserMaster.vue
```
Hasil harus 0 (atau hanya baris yang sudah dikomentari).

**Langkah 5:** Verifikasi dev server compiled tanpa error.

**Verifikasi Keberhasilan:**
- [ ] `UserMaster.vue` mengimport `eventBus from '@/util/eventBus'`
- [ ] Semua `$eventBus.$emit` → `eventBus.emit`
- [ ] Tidak ada error di dev server
- [ ] Fungsi upload/update gambar di Users page masih berfungsi

---

## ⚠️ Risk Register & Mitigasi

| # | Risk | Kemungkinan | Dampak | Mitigasi |
|---|------|-------------|--------|----------|
| R1 | Uninstall Vuex saat masih ada `$store` yang dipakai | Sedang | Sangat Tinggi | Wajib grep `$store` dan `from 'vuex'` sebelum uninstall |
| R2 | Data navigasi tidak lengkap di Pinia store | Rendah | Tinggi | Bandingkan baris per baris dengan `src/store/index.js` |
| R3 | Sidebar blank karena Pinia store tidak terinisialisasi | Sedang | Tinggi | Gunakan pola `navStore: null` di data + inisialisasi di created |
| R4 | eventBus.$on tidak berfungsi setelah migrasi mitt | Rendah | Sedang | Pastikan pakai `eventBus.on()` bukan `eventBus.$on()` |
| R5 | `useNavigationStore()` dipanggil di luar setup() | Rendah | Sedang | Panggil di `created()` dan simpan ke `data()`, jangan di `computed()` langsung |
| R6 | Dev server tidak reload setelah perubahan | Rendah | Rendah | Restart server jika perlu: `npm run serve` |

---

## 🔍 Testing Checklist Setelah Fase 2 Selesai

Lakukan semua test berikut sebelum dianggap selesai:

1. **Test Sidebar:**
   - [x] Sidebar tampil dengan semua menu
   - [x] Menu accordion bisa dibuka/ditutup
   - [x] Klik menu navigasi berpindah halaman

2. **Test Layout:**
   - [x] Halaman dashboard tampil normal
   - [x] Header dan sidebar tidak berubah tampilan

3. **Test Upload User Image:**
   - [x] Buka halaman Users
   - [x] Klik tombol upload gambar pada satu user
   - [x] Upload gambar berhasil
   - [x] Gambar di sidebar terupdate (test eventBus)

4. **Test Auth:**
   - [x] Login masih berfungsi
   - [x] Logout masih berfungsi
   - [x] Token expiry masih terdeteksi

5. **Test Console:**
   - [x] Tidak ada error merah di browser console
   - [x] Tidak ada Vue warning tentang `$store` atau `vuex`

---

## 📝 Catatan Implementasi

```
[2026-08-05] Fase 2 Completed:
- Migrasi state management dari Vuex ke Pinia (stores/navigation.js)
- Uninstalled vuex & @vue/cli-plugin-vuex
- Migrasi eventBus dari Vue 2-style app instance ke mitt library
- Updated SidebarDashboard.vue, AdminDashboard.vue, HeaderDashboard.vue, & UserMaster.vue
- Production build (npm run build) verified 0 errors
```

---

*File ini diperbarui pada 2026-08-05. Fase 1 dan Fase 2 sudah selesai.*
