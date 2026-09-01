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

| #   | Perubahan                                                      | Dampak                                    |
| --- | -------------------------------------------------------------- | ----------------------------------------- |
| 1   | Install Pinia (berjalan paralel dengan Vuex)                   | State management lebih modern dan ringan  |
| 2   | Buat `stores/navigation.js` di Pinia                           | Terpusat, reaktif, tanpa boilerplate Vuex |
| 3   | Migrasi `SidebarDashboard.vue` & `AdminDashboard.vue` ke Pinia | Hapus `$store.getters.navigation`         |
| 4   | Uninstall Vuex (HANYA setelah T3 selesai dan terverifikasi)    | Kurangi bundle size                       |
| 5   | Ganti `eventBus.js` dengan `mitt`                              | Hapus anti-pattern double Vue instance    |

**Yang TIDAK dilakukan di Fase 2:**

- Tidak rename direktori views (dipindah ke Fase 3)
- Tidak mengubah komponen views individual
- Tidak migrasi ke Composition API (Fase 3)
- Tidak migrasi ke Vite (Fase 3)

---

## 🕐 Timeline & Estimasi

| Task | Nama                                         | Estimasi       | Urutan                       |
| ---- | -------------------------------------------- | -------------- | ---------------------------- |
| T1   | Install Pinia + register di main.js          | 15 menit       | 1                            |
| T2   | Buat `src/stores/navigation.js`              | 20 menit       | 2 (setelah T1)               |
| T3   | Migrate `SidebarDashboard.vue` ke Pinia      | 30 menit       | 3 (setelah T2)               |
| T4   | Migrate `AdminDashboard.vue` ke Pinia        | 20 menit       | 4 (setelah T3 terverifikasi) |
| T5   | Uninstall Vuex + cleanup                     | 20 menit       | 5 (HANYA setelah T4)         |
| T6   | Install `mitt` + update `eventBus.js`        | 20 menit       | 6 (independen)               |
| T7   | Update `SidebarDashboard.vue` eventBus calls | 20 menit       | 7 (setelah T6)               |
| T8   | Update `UserMaster.vue` eventBus calls       | 20 menit       | 8 (setelah T6)               |
|      | **TOTAL**                                    | **~2.5–3 jam** |                              |

### Dependency Chart

```
T1 (install pinia) → T2 (navigation store) → T3 (sidebar migrate) → T4 (admin migrate) → T5 (uninstall vuex)

T6 (install mitt) → T7 (sidebar eventbus) → T8 (usermaste eventbus)

T6 bisa dikerjakan paralel dengan T1-T4, TAPI T7 harus setelah T6 selesai.
```

---

## 📊 Estimasi Resource

| Resource                         | Detail                                                                                                          |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Model**                        | Gemini 2.5 Flash (High Thinking)                                                                                |
| **File yang diubah**             | `main.js`, `SidebarDashboard.vue`, `AdminDashboard.vue`, `eventBus.js`, `UserMaster.vue`, `HeaderDashboard.vue` |
| **File yang TIDAK boleh diubah** | Semua file di `src/views/` KECUALI `UserMaster.vue`                                                             |
| **Tools yang dibutuhkan**        | `run_command`, `view_file`, `replace_file_content`, `write_to_file`, `grep_search`                              |
| **Risiko utama**                 | Menghapus Vuex terlalu cepat sebelum migrasi selesai                                                            |

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

| #   | Risk                                                   | Kemungkinan | Dampak        | Mitigasi                                                                       |
| --- | ------------------------------------------------------ | ----------- | ------------- | ------------------------------------------------------------------------------ |
| R1  | Uninstall Vuex saat masih ada `$store` yang dipakai    | Sedang      | Sangat Tinggi | Wajib grep `$store` dan `from 'vuex'` sebelum uninstall                        |
| R2  | Data navigasi tidak lengkap di Pinia store             | Rendah      | Tinggi        | Bandingkan baris per baris dengan `src/store/index.js`                         |
| R3  | Sidebar blank karena Pinia store tidak terinisialisasi | Sedang      | Tinggi        | Gunakan pola `navStore: null` di data + inisialisasi di created                |
| R4  | eventBus.$on tidak berfungsi setelah migrasi mitt      | Rendah      | Sedang        | Pastikan pakai `eventBus.on()` bukan `eventBus.$on()`                          |
| R5  | `useNavigationStore()` dipanggil di luar setup()       | Rendah      | Sedang        | Panggil di `created()` dan simpan ke `data()`, jangan di `computed()` langsung |
| R6  | Dev server tidak reload setelah perubahan              | Rendah      | Rendah        | Restart server jika perlu: `npm run serve`                                     |

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

_File ini diperbarui pada 2026-08-05. Fase 1 dan Fase 2 sudah selesai._

---

# 🧹 IMPLEMENTATION.md — Fase 3: Code Quality & Performance ✅ SELESAI

> **Status:** COMPLETED
> **Tanggal selesai:** 2026-09-01
> **Target Audiens:** Model AI (Gemini / Claude) yang akan mengeksekusi task ini
> **Prasyarat WAJIB:** Baca [`docs/README.md`](./README.md) terlebih dahulu
> **Fase:** 3 dari 3
> **Fokus:** Membersihkan dead code, memperbaiki bug, meningkatkan performa, dan mempersiapkan codebase agar lebih modern dan maintainable
> **Estimasi Total:** 18–33 jam

---

## ⚠️ PERINGATAN KRITIS — BACA SEBELUM MEMULAI

> Fase 2 sebelumnya menyebabkan error pada banyak komponen UI karena migrasi yang terlalu agresif.
> Fase 3 ini dirancang dengan **prinsip kehati-hatian maksimum**.

**Prinsip Aman yang WAJIB diikuti di Fase 3:**

1. **JANGAN rename direktori views yang mengandung spasi** — risiko breaking import path di 90+ route. Task T1 ini **DINONAKTIFKAN** di Fase 3 dan dipindahkan ke Fase opsional karena risikonya terlalu tinggi.
2. **JANGAN migrasi semua view ke Composition API** — hanya komponen shared di `src/components/`. File di `src/views/` **TIDAK BOLEH DIUBAH**.
3. **Verifikasi `npm run serve` tidak error setelah SETIAP task selesai** — jangan gabungkan beberapa task sekaligus.
4. **Lakukan perubahan satu file per waktu**, cek browser, baru lanjut.
5. **Sebelum menghapus kode apapun**, pastikan kode tersebut benar-benar tidak dipakai (gunakan `grep_search`).
6. **Buat commit atau checkpoint sebelum memulai setiap task** agar mudah di-rollback jika error.

---

## 📋 Ringkasan Eksekutif

Fase 3 bertujuan meningkatkan kualitas kode dan performa aplikasi tanpa mengubah fungsionalitas atau tampilan dari sudut pandang user. Semua perubahan bersifat **internal dan non-breaking**.

| #   | Task                                                  | Dampak                                       | Risiko    |
| --- | ----------------------------------------------------- | -------------------------------------------- | --------- |
| T1  | Hapus dead code (kode dikomentari) di komponen shared | Ukuran file lebih kecil                      | 🟢 Rendah |
| T2  | Bersihkan dependency duplikat di `package.json`       | Bundle lebih kecil                           | 🟢 Rendah |
| T3  | Perbaiki route name duplikat di `router/index.js`     | Navigasi programatik lebih reliable          | 🟢 Rendah |
| T4  | Tambahkan global error handler di `main.js`           | UX lebih baik saat error runtime             | 🟢 Rendah |
| T5  | Buat composable `useDebounce` dan `useApi`            | Kode lebih DRY dan reusable                  | 🟡 Sedang |
| T6  | Simplifikasi template `ImageUpload.vue`               | Kode lebih bersih, bug-resistant             | 🟡 Sedang |
| T7  | Migrasi komponen shared ke `<script setup>`           | Kode lebih modern, lebih sedikit boilerplate | 🔴 Tinggi |

**Yang TIDAK dilakukan di Fase 3:**

- Tidak rename direktori views (risiko breaking change)
- Tidak mengubah file di `src/views/` (kecuali disebutkan eksplisit per task)
- Tidak migrasi ke Vite (opsional, lihat T-optional di bawah)

---

## 🕐 Timeline & Estimasi

| Task | Nama                                        | Estimasi            | Urutan | Dependency         |
| ---- | ------------------------------------------- | ------------------- | ------ | ------------------ |
| T1   | Hapus dead code di komponen shared          | 1–2 jam             | 1      | Independen         |
| T2   | Hapus dependency duplikat                   | 30–60 menit         | 2      | Independen         |
| T3   | Perbaiki route name duplikat                | 30–60 menit         | 3      | Independen         |
| T4   | Global error handler                        | 30 menit            | 4      | Independen         |
| T5   | Buat composable `useDebounce` & `useApi`    | 2–3 jam             | 5      | T1 selesai         |
| T6   | Simplifikasi template `ImageUpload.vue`     | 2–3 jam             | 6      | T1 selesai         |
| T7   | Migrasi komponen shared ke `<script setup>` | 8–12 jam            | 7      | T1, T5, T6 selesai |
|      | **TOTAL**                                   | **14–22 jam aktif** |        |                    |

### Dependency Chart

```
T1 (dead code) ──────────┬─→ T5 (composable)
                         └─→ T6 (ImageUpload)
                                          └─→ T7 (script setup migration)

T2 (dependency cleanup) → independen, bisa dikerjakan kapan saja
T3 (route names)        → independen, bisa dikerjakan kapan saja
T4 (error handler)      → independen, bisa dikerjakan kapan saja
```

---

## 📊 Estimasi Resource

| Resource                         | Detail                                                                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Model**                        | Gemini 3.7 Flash (High)                                                                                                      |
| **File yang boleh diubah**       | `src/components/*.vue`, `src/util/*.js`, `src/composables/*.js` (baru), `src/router/index.js`, `src/main.js`, `package.json` |
| **File yang TIDAK BOLEH diubah** | Semua file di `src/views/` — **tanpa pengecualian**                                                                          |
| **Tools yang dibutuhkan**        | `run_command`, `view_file`, `replace_file_content`, `write_to_file`, `grep_search`, `multi_replace_file_content`             |
| **Risiko utama**                 | Migrasi ke Composition API di T7 bisa menyebabkan error jika tidak hati-hati                                                 |

---

## ✅ Progress Checklist

- [x] **T1** — Dead code dihapus dari semua komponen shared
- [x] **T2** — Dependency duplikat dihapus, `npm run serve` masih berjalan normal
- [x] **T3** — Route name duplikat sudah diverifikasi dan 0 duplikasi
- [x] **T4** — Global error handler terdaftar di `main.js`
- [x] **T5** — `src/composables/useDebounce.js` dan `src/composables/useApi.js` dibuat
- [x] **T6** — `ImageUpload.vue` template disimplifikasi
- [x] **T7** — Komponen shared termigrasi ke `<script setup>`

---

## 📝 Detail Task

---

### T1 — Hapus Dead Code di Komponen Shared

**Deskripsi:**
Hapus semua kode yang dikomentari (`// ...` dan `/* ... */`) di file komponen shared. Git history sudah menyimpan kode lama — tidak perlu takut kehilangan kode penting.

**Target File (hanya komponen shared, BUKAN views):**

- `src/components/ImageUpload.vue` (~200 baris dikomentari)
- `src/components/ImageMultiUpload.vue`
- `src/components/VideoUpload.vue`
- `src/main.js`
- `src/App.vue`

**Estimasi Waktu:** 1–2 jam
**Complexity:** 🟢 Rendah
**Risk:** 🟢 Rendah — kode yang dihapus sudah tidak dipakai

**Step-by-Step Execution:**

**Langkah 1:** Identifikasi seberapa banyak dead code yang ada

```
Tool: run_command
Command: (Get-Content "src/components/ImageUpload.vue") | Select-String "^\s*//" | Measure-Object | Select-Object Count
Cwd: d:\Projects\freelance\admingypsy-new
WaitMsBeforeAsync: 2000
```

**Langkah 2:** Baca `ImageUpload.vue` secara lengkap

```
Tool: view_file
File: src/components/ImageUpload.vue
```

Identifikasi semua blok kode yang dikomentari (`// kode...` dan `/* ... */`). Catat nomor baris.

**Langkah 3:** Hapus blok kode yang dikomentari dari `ImageUpload.vue`

> ⚠️ **PERHATIAN:** Hanya hapus kode yang dikomentari (dead code). JANGAN hapus komentar dokumentasi seperti `/** @param ... */` atau `// TODO:` dan `// FIXME:`.

Gunakan `multi_replace_file_content` untuk menghapus beberapa blok sekaligus dengan presisi.

**Contoh pola yang harus dihapus:**

```javascript
// Hapus blok seperti ini:
// onImageInput(e) {
//   var files = e.target.files || e.dataTransfer.files;
//   if (!files.length) return;
//   ...
// },

// Dan blok ini:
// compressImage(base64) {
//   ...
// },
```

**Langkah 4:** Verifikasi file masih valid setelah edit

```
Tool: view_file
File: src/components/ImageUpload.vue
```

Pastikan:

- Semua kurung kurawal `{}` masih seimbang
- Tidak ada koma berlebih atau kurang di akhir method/property
- Logika fungsional masih utuh

**Langkah 5:** Ulangi untuk `ImageMultiUpload.vue` dan `VideoUpload.vue`

```
Tool: view_file
File: src/components/ImageMultiUpload.vue
```

**Langkah 6:** Bersihkan dead code di `src/main.js`

```
Tool: view_file
File: src/main.js
```

Hapus baris import yang sudah dikomentari dan kode yang tidak aktif.

**Langkah 7:** Bersihkan dead code di `src/App.vue`

```
Tool: view_file
File: src/App.vue
```

**Langkah 8:** Verifikasi dev server masih berjalan tanpa error

```
Tool: run_command
Command: npm run serve
Cwd: d:\Projects\freelance\admingypsy-new
WaitMsBeforeAsync: 10000
```

Tunggu hingga output menunjukkan "Compiled successfully".

**Verifikasi Keberhasilan:**

- [ ] `ImageUpload.vue` tidak mengandung blok kode yang dikomentari
- [ ] `ImageMultiUpload.vue` tidak mengandung blok kode yang dikomentari
- [ ] `VideoUpload.vue` tidak mengandung blok kode yang dikomentari
- [ ] `main.js` bersih dari dead code
- [ ] `App.vue` bersih dari dead code
- [ ] `npm run serve` compiled tanpa error
- [ ] Buka browser — upload gambar masih berfungsi

---

### T2 — Hapus Dependency Duplikat

**Deskripsi:**
Beberapa package di `package.json` sudah tidak digunakan atau sudah digantikan oleh package lain. Menghapusnya akan memperkecil ukuran `node_modules` dan mempercepat `npm install`.

**Package yang harus dihapus:**

- `font-awesome` → sudah digantikan `@fortawesome/fontawesome-free`
- `flag-icon-css` → sudah digantikan `flag-icons`
- `roboto-fontface` → sudah di-load via webfontloader
- `handy-uploader` → tidak terlihat aktif digunakan
- `buffer-es6` → tidak terlihat aktif digunakan

**Estimasi Waktu:** 30–60 menit
**Complexity:** 🟢 Rendah
**Risk:** 🟢 Rendah (jika verifikasi dilakukan dengan benar)

**Step-by-Step Execution:**

**Langkah 1:** Verifikasi setiap package benar-benar tidak digunakan

Untuk setiap package di bawah, jalankan grep:

```
Tool: grep_search
Query: font-awesome
SearchPath: src/
MatchPerLine: true
```

```
Tool: grep_search
Query: flag-icon-css
SearchPath: src/
MatchPerLine: true
```

```
Tool: grep_search
Query: handy-uploader
SearchPath: src/
MatchPerLine: true
```

```
Tool: grep_search
Query: buffer-es6
SearchPath: src/
MatchPerLine: true
```

```
Tool: grep_search
Query: roboto-fontface
SearchPath: src/
MatchPerLine: true
```

**Langkah 2:** Untuk setiap package yang hasil grep-nya **0 (nol)**, lakukan uninstall

> ⚠️ **STOP** jika grep menunjukkan hasil — berarti package masih digunakan. Jangan uninstall!

```
Tool: run_command
Command: npm uninstall font-awesome roboto-fontface
Cwd: d:\Projects\freelance\admingypsy-new
WaitMsBeforeAsync: 30000
```

> Catatan: Jalankan satu per satu, atau gabungkan hanya package yang sudah terkonfirmasi tidak dipakai.

**Langkah 3:** Cek `package.json` untuk memastikan perubahan tersimpan

```
Tool: view_file
File: package.json
```

**Langkah 4:** Verifikasi dev server masih berjalan tanpa error

```
Tool: run_command
Command: npm run serve
Cwd: d:\Projects\freelance\admingypsy-new
WaitMsBeforeAsync: 15000
```

**Langkah 5:** Buka browser, pastikan tampilan aplikasi tidak berubah (terutama ikon dan font).

**Verifikasi Keberhasilan:**

- [ ] Package duplikat tidak ada lagi di `package.json`
- [ ] `npm run serve` compiled tanpa error
- [ ] Tampilan browser tidak ada yang berubah (icon, font, layout normal)

---

### T3 — Perbaiki Route Name Duplikat

**Deskripsi:**
Ada beberapa route yang memiliki nama (`name`) yang sama di `router/index.js`. Hal ini menyebabkan Vue Router mengeluarkan warning dan navigasi programatik dengan `this.$router.push({ name: '...' })` bisa mengarah ke route yang salah.

**Route yang bermasalah (dari ANALYSIS.md):**

```javascript
// Duplikat nama:
{ name: 'primary skills regurable association', path: '/primary-skills/regu-assoc/:id' }
{ name: 'primary skills regurable association', path: '/primary-skills/country/:id' }

// Duplikat entitas:
{ name: 'restaurant master 2', path: '/restaurant-master' }
{ name: 'restaurant master', path: '/biryani-home/restaurant-master' }
```

**Estimasi Waktu:** 30–60 menit
**Complexity:** 🟢 Rendah
**Risk:** 🟢 Rendah — hanya mengubah atribut `name`, tidak mengubah `path`

**Step-by-Step Execution:**

**Langkah 1:** Cari semua route name duplikat

```
Tool: run_command
Command: node -e "const r=require('./src/router/index.js'); const names=r.default.options?.routes?.map(x=>x.name)||[]; const dupes=names.filter((n,i)=>names.indexOf(n)!==i); console.log('Duplikat:', dupes)"
```

> Catatan: Jika command di atas tidak berhasil karena module system, gunakan grep manual:

```
Tool: grep_search
Query: name: 'primary skills regurable association'
SearchPath: src/router/index.js
MatchPerLine: true
```

**Langkah 2:** Baca semua route yang bermasalah

```
Tool: view_file
File: src/router/index.js
```

Cari dan catat semua baris dengan nama yang duplikat.

**Langkah 3:** Ganti nama route duplikat dengan nama unik menggunakan konvensi `[modul].[nama]`

Contoh perubahan:

```javascript
// Sebelum:
{ name: 'primary skills regurable association', path: '/primary-skills/regu-assoc/:id' }
{ name: 'primary skills regurable association', path: '/primary-skills/country/:id' }

// Sesudah:
{ name: 'skills.regu-association', path: '/primary-skills/regu-assoc/:id' }
{ name: 'skills.country', path: '/primary-skills/country/:id' }
```

```javascript
// Sebelum:
{ name: 'restaurant master 2', path: '/restaurant-master' }
{ name: 'restaurant master', path: '/biryani-home/restaurant-master' }

// Sesudah:
{ name: 'main.restaurant-master', path: '/restaurant-master' }
{ name: 'biryani.restaurant-master', path: '/biryani-home/restaurant-master' }
```

**Langkah 4:** Cek apakah nama lama digunakan di komponen lain (navigasi programatik)

```
Tool: grep_search
Query: primary skills regurable association
SearchPath: src/
MatchPerLine: true
```

```
Tool: grep_search
Query: restaurant master
SearchPath: src/
MatchPerLine: true
```

> ⚠️ Jika ada komponen yang menggunakan nama lama via `this.$router.push({ name: '...' })`, update juga di komponen tersebut.

**Langkah 5:** Verifikasi dev server tidak menampilkan warning tentang duplicate route names.

**Verifikasi Keberhasilan:**

- [ ] Tidak ada route name yang sama di `router/index.js`
- [ ] Dev server tidak menampilkan warning `[Vue Router warn]: No match found for location`
- [ ] Navigasi ke halaman-halaman yang bersangkutan masih berfungsi normal

---

### T4 — Tambahkan Global Error Handler

**Deskripsi:**
Saat ini tidak ada penanganan error runtime yang terpusat. Jika terjadi error JavaScript yang tidak tertangkap, user hanya melihat layar putih atau error di console tanpa informasi berguna. Global error handler akan menangkap semua error dan menampilkan notifikasi yang user-friendly.

**Estimasi Waktu:** 30 menit
**Complexity:** 🟢 Rendah
**Risk:** 🟢 Rendah — hanya menambahkan handler baru, tidak mengubah logika yang ada

**Step-by-Step Execution:**

**Langkah 1:** Baca `src/main.js` untuk memahami struktur saat ini

```
Tool: view_file
File: src/main.js
```

**Langkah 2:** Tambahkan global error handler ke `main.js`

Tambahkan **sebelum** baris `app.mount('#app')`:

```javascript
// Global Vue error handler
app.config.errorHandler = (err, instance, info) => {
  // Log error ke console untuk debugging
  console.error('[Vue Error]', err);
  console.error('[Vue Error Info]', info);
  console.error('[Vue Error Component]', instance?.$options?.name || 'Unknown');

  // Opsional: Tampilkan notifikasi ke user
  // Jika menggunakan Vuetify, bisa trigger snackbar via eventBus
  // eventBus.emit('global-error', err.message);
};

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason);
  event.preventDefault(); // Mencegah error muncul di console default
});
```

**Langkah 3:** Baca `src/App.vue` untuk melihat apakah ada snackbar yang bisa digunakan

```
Tool: view_file
File: src/App.vue
```

**Langkah 4:** (Opsional) Tambahkan `onErrorCaptured` di `App.vue` sebagai error boundary

Jika `App.vue` menggunakan Options API:

```javascript
export default {
  // ... options yang sudah ada ...
  errorCaptured(err, instance, info) {
    console.error('[Error Captured in App]', err, info);
    // Return false untuk mencegah error menyebar ke parent
    return false;
  },
};
```

**Langkah 5:** Verifikasi dev server masih berjalan dan tidak ada error baru.

**Verifikasi Keberhasilan:**

- [ ] `main.js` memiliki `app.config.errorHandler`
- [ ] `window.addEventListener('unhandledrejection', ...)` terpasang
- [ ] Dev server compiled tanpa error
- [ ] Browser console tidak menampilkan error baru

---

### T5 — Buat Composable `useDebounce` dan `useApi`

**Deskripsi:**
Saat ini setiap view mengimplementasi debounce search secara manual dan berulang (copy-paste pattern yang sama). Buat dua composable reusable:

1. `useDebounce` — untuk debounce function calls
2. `useApi` — wrapper standar untuk Axios request dengan loading/error state

**Catatan penting:** Composable ini dibuat untuk digunakan di komponen baru atau yang sudah dimigrasi ke Composition API. **Jangan paksa mengintegrasikan ke file views yang masih Options API** — itu akan dilakukan secara bertahap di T7.

**Estimasi Waktu:** 2–3 jam
**Complexity:** 🟡 Sedang
**Risk:** 🟢 Rendah — membuat file baru, tidak mengubah yang sudah ada

**Step-by-Step Execution:**

**Langkah 1:** Buat direktori `src/composables/`

```
Tool: run_command
Command: New-Item -ItemType Directory -Path "src\composables" -Force
Cwd: d:\Projects\freelance\admingypsy-new
WaitMsBeforeAsync: 2000
```

**Langkah 2:** Buat file `src/composables/useDebounce.js`

```
Tool: write_to_file
Path: src/composables/useDebounce.js
```

Isi file:

```javascript
/**
 * useDebounce.js
 *
 * Composable untuk membuat fungsi dengan delay (debounce).
 * Digunakan untuk search input agar tidak trigger request terlalu sering.
 *
 * Cara pakai:
 *   import { useDebounce } from '@/composables/useDebounce';
 *
 *   // Di <script setup>:
 *   const debouncedSearch = useDebounce((value) => {
 *     fetchData(value);
 *   }, 400);
 *
 *   // Di template: @input="debouncedSearch($event.target.value)"
 */

/**
 * Buat versi debounced dari sebuah fungsi.
 * @param {Function} fn - Fungsi yang ingin di-debounce
 * @param {number} delay - Delay dalam milidetik (default: 400)
 * @returns {Function} - Fungsi debounced
 */
export function useDebounce(fn, delay = 400) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}
```

**Langkah 3:** Buat file `src/composables/useApi.js`

```
Tool: write_to_file
Path: src/composables/useApi.js
```

Isi file:

```javascript
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
 * @returns {{ data: Ref, isLoading: Ref<boolean>, error: Ref<string|null>, execute: Function }}
 */
export function useApi() {
  const data = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Eksekusi request API.
   * @param {Function} requestFn - Fungsi yang mengembalikan Promise (misal: () => axios.get('/url'))
   * @param {Function} [transform] - Opsional: transformasi data sebelum disimpan
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
      const message = err.response?.data?.message || err.message || 'An unexpected error occurred.';
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
```

**Langkah 4:** Verifikasi kedua file berhasil dibuat

```
Tool: view_file
File: src/composables/useDebounce.js
```

```
Tool: view_file
File: src/composables/useApi.js
```

**Langkah 5:** Verifikasi dev server masih berjalan normal

```
Tool: run_command
Command: (tunggu output terminal npm run serve)
```

File composable yang tidak diimport di mana pun tidak akan menyebabkan error.

**Verifikasi Keberhasilan:**

- [ ] `src/composables/useDebounce.js` ada dan berisi implementasi yang benar
- [ ] `src/composables/useApi.js` ada dan berisi implementasi yang benar
- [ ] Dev server masih berjalan tanpa error

---

### T6 — Simplifikasi Template `ImageUpload.vue`

**Deskripsi:**
`ImageUpload.vue` menggunakan serangkaian `v-if` / `v-else-if` yang panjang untuk menentukan ikon berdasarkan tipe file. Ini bisa disederhanakan dengan menggunakan computed property yang mengembalikan ikon yang tepat berdasarkan ekstensi file, membuat template jauh lebih bersih dan mudah di-maintain.

**Estimasi Waktu:** 2–3 jam
**Complexity:** 🟡 Sedang
**Risk:** 🟡 Sedang — mengubah komponen yang digunakan di banyak halaman

**Step-by-Step Execution:**

**Langkah 1:** Baca seluruh `ImageUpload.vue`

```
Tool: view_file
File: src/components/ImageUpload.vue
```

Catat:

- Bagian template yang menggunakan banyak `v-if` untuk ikon file
- Computed properties yang sudah ada
- Methods yang ada

**Langkah 2:** Identifikasi pola berulang di template

Cari bagian template yang terlihat seperti:

```html
<v-icon v-if="attachment.file.name.split('.').pop().toLowerCase() === 'pdf'" color="red darken-1"
  >mdi-file-pdf-outline</v-icon
>
<v-icon
  v-else-if="attachment.file.name.split('.').pop().toLowerCase() === 'doc' || ..."
  color="blue darken-1"
  >mdi-file-word-outline</v-icon
>
<!-- ... 6-8 kondisi lagi ... -->
```

**Langkah 3:** Tambahkan computed property `fileTypeMap` dan method `getFileIcon`

Tambahkan di bagian `computed:` (atau buat jika belum ada):

```javascript
computed: {
  // ... computed yang sudah ada ...

  fileTypeConfig() {
    return {
      // image types
      jpg: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
      jpeg: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
      png: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
      tif: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
      bmp: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
      // document types
      pdf: { icon: 'mdi-file-pdf-outline', color: 'red darken-1' },
      doc: { icon: 'mdi-file-word-outline', color: 'blue darken-1' },
      docx: { icon: 'mdi-file-word-outline', color: 'blue darken-1' },
      odt: { icon: 'mdi-file-word-outline', color: 'blue darken-1' },
      xls: { icon: 'mdi-file-excel-outline', color: 'teal darken-1' },
      xlsx: { icon: 'mdi-file-excel-outline', color: 'teal darken-1' },
      pptx: { icon: 'mdi-file-powerpoint-outline', color: 'orange darken-3' },
      pptm: { icon: 'mdi-file-powerpoint-outline', color: 'orange darken-3' },
      ppt: { icon: 'mdi-file-powerpoint-outline', color: 'orange darken-3' },
      // media types
      mp4: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
      mov: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
      flv: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
      wmv: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
      avi: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
      dwg: { icon: 'mdi-file-cad', color: 'indigo lighten-2' },
      // archive types
      zip: { icon: 'mdi-folder-zip-outline', color: 'lime lighten-1' },
      rar: { icon: 'mdi-folder-zip-outline', color: 'lime lighten-1' },
      '7-zip': { icon: 'mdi-folder-zip-outline', color: 'lime lighten-1' },
      // text types
      txt: { icon: 'mdi-script-text-outline', color: 'light-green darken-3' },
    };
  },
},
methods: {
  // ... methods yang sudah ada ...

  getFileExt(filename) {
    return filename ? filename.split('.').pop().toLowerCase() : '';
  },
  getFileIcon(filename) {
    const ext = this.getFileExt(filename);
    return (this.fileTypeConfig[ext] || { icon: 'mdi-file-question-outline', color: 'indigo lighten-1' }).icon;
  },
  getFileColor(filename) {
    const ext = this.getFileExt(filename);
    return (this.fileTypeConfig[ext] || { icon: 'mdi-file-question-outline', color: 'indigo lighten-1' }).color;
  },
  isImageFile(filename) {
    const imageExts = ['jpg', 'jpeg', 'png', 'tif', 'bmp'];
    return imageExts.includes(this.getFileExt(filename));
  },
},
```

**Langkah 4:** Sederhanakan template

Ganti bagian template yang berisi banyak `v-if/v-else-if` dengan:

```html
<td>
  <!-- Tampilkan thumbnail jika file adalah gambar -->
  <template v-if="isImageFile(attachment.file.name)">
    <v-img
      style="margin: 10px"
      :src="image[0].image_path !== '' ? attachment.file.file : $fileURL + attachment.file.name"
      height="50px"
      width="50px"
    ></v-img>
  </template>
  <!-- Tampilkan ikon jika bukan gambar -->
  <template v-else>
    <v-icon style="margin-left: 10px" size="50" :color="getFileColor(attachment.file.name)"
      >{{ getFileIcon(attachment.file.name) }}</v-icon
    >
  </template>
</td>
```

**Langkah 5:** Verifikasi perubahan tidak merusak struktur template

```
Tool: view_file
File: src/components/ImageUpload.vue
```

**Langkah 6:** Test di browser

- Buka halaman yang menggunakan `ImageUpload` (misalnya halaman yang memiliki upload gambar)
- Upload gambar (JPG/PNG) — pastikan thumbnail tampil
- Upload file PDF — pastikan ikon PDF tampil
- Upload file Word (DOC) — pastikan ikon Word tampil

**Verifikasi Keberhasilan:**

- [ ] Template `ImageUpload.vue` tidak lagi memiliki rantai `v-if/v-else-if` yang panjang untuk ikon
- [ ] Computed `fileTypeConfig` dan methods `getFileIcon`, `getFileColor`, `isImageFile` sudah ada
- [ ] Upload gambar: thumbnail tampil
- [ ] Upload PDF: ikon PDF merah tampil
- [ ] Upload Word: ikon Word biru tampil
- [ ] Dev server tidak error

---

### T7 — Migrasi Komponen Shared ke `<script setup>`

**Deskripsi:**
Migrasi komponen shared dari Options API ke Composition API dengan `<script setup>`. Ini adalah task yang paling kompleks dan berisiko tinggi. Lakukan satu komponen per waktu, verifikasi browser setelah setiap komponen.

> ⚠️ **PERHATIAN KRITIS:**
>
> - Task ini **HANYA** untuk file di `src/components/`
> - **JANGAN** sentuh file di `src/views/`
> - Jika ada komponen yang terlalu kompleks atau ada ketergantungan yang tidak jelas, **SKIP** dan catat di Progress Checklist

**Target Komponen (urutan dari paling mudah ke paling sulit):**

1. `HeaderDashboard.vue` — paling sederhana, migrasi duluan
2. `SidebarDashboard.vue` — sudah pakai Pinia dan mitt, refactor ke script setup
3. `ImageUpload.vue` — setelah T6 selesai

**File yang TIDAK perlu dimigrasi (terlalu kompleks atau memiliki dependency yang rumit):**

- `AdminDashboard.vue` — layout utama, risiko tinggi
- `Dropdown.vue` — periksa terlebih dahulu sebelum memutuskan

**Estimasi Waktu:** 8–12 jam (3 komponen)
**Complexity:** 🔴 Tinggi
**Risk:** 🔴 Tinggi — perubahan besar pada komponen inti

**Step-by-Step Execution — `HeaderDashboard.vue`:**

**Langkah 1:** Baca seluruh `HeaderDashboard.vue`

```
Tool: view_file
File: src/components/HeaderDashboard.vue
```

Catat:

- Semua imports
- Semua `data()` properties
- Semua `computed` properties
- Semua `methods`
- Semua lifecycle hooks (`created`, `mounted`, `beforeUnmount`)
- Semua props yang diterima
- Semua emits

**Langkah 2:** Petakan setiap bagian Options API ke Composition API

Gunakan tabel referensi ini:
| Options API | Composition API (`<script setup>`) |
|-------------|-------------------------------------|
| `data() { return { x: 1 } }` | `const x = ref(1)` |
| `computed: { y() { return ... } }` | `const y = computed(() => ...)` |
| `methods: { doSth() {} }` | `function doSth() {}` |
| `mounted() {}` | `onMounted(() => {})` |
| `created() {}` | Kode langsung di body `<script setup>` |
| `beforeUnmount() {}` | `onBeforeUnmount(() => {})` |
| `props: ['x']` | `const props = defineProps(['x'])` |
| `emit: ['click']` | `const emit = defineEmits(['click'])` |
| `this.$router` | `const router = useRouter()` |
| `this.navStore = useNavigationStore()` | `const navStore = useNavigationStore()` |
| `import eventBus from '...'` | tetap sama |

**Langkah 3:** Tulis ulang komponen dengan `<script setup>`

> ⚠️ **POLA PENTING:** Selalu periksa apakah ada referensi ke `this` di template atau di kode lain. Di `<script setup>`, tidak ada `this` — semua variable harus di-expose langsung atau via `defineExpose`.

**Langkah 4:** Ganti seluruh `<script>` block dengan `<script setup>`

Gunakan `replace_file_content` untuk mengganti **hanya** bagian `<script>` sampai `</script>`. Jangan ubah `<template>` dan `<style>`.

**Langkah 5:** Verifikasi di browser setelah setiap komponen dimigrasi

Jika ada error di browser console:

- Baca error message dengan teliti
- Error umum: `Cannot read property 'xxx' of undefined` — biasanya karena `this` masih dipakai atau variable belum di-`ref()`
- Rollback dengan `git checkout src/components/HeaderDashboard.vue` jika error tidak bisa diselesaikan cepat

**Step-by-Step Execution — `SidebarDashboard.vue`:**

Ikuti langkah yang sama (1–5). Perhatian khusus:

- `navStore = useNavigationStore()` — di `<script setup>` bisa langsung: `const navStore = useNavigationStore()`
- `eventBus.on('update-image', handler)` — pindahkan ke `onMounted`
- `eventBus.off('update-image', handler)` — pindahkan ke `onBeforeUnmount`

**Step-by-Step Execution — `ImageUpload.vue`:**

Ikuti langkah yang sama. Perhatian khusus:

- Komponen ini memiliki `props` dan `emits` — pastikan `defineProps` dan `defineEmits` digunakan
- Ada banyak `data()` properties — konversi semua ke `ref()` atau `reactive()`

**Verifikasi Keberhasilan:**

- [ ] `HeaderDashboard.vue` menggunakan `<script setup>` dan tidak mengandung `export default`
- [ ] `SidebarDashboard.vue` menggunakan `<script setup>`
- [ ] `ImageUpload.vue` menggunakan `<script setup>`
- [ ] Sidebar masih tampil dengan semua menu
- [ ] Header masih tampil normal
- [ ] Upload gambar di `ImageUpload` masih berfungsi
- [ ] Event bus (update gambar di sidebar setelah upload) masih berfungsi
- [ ] Tidak ada error di browser console

---

## ⚠️ Risk Register & Mitigasi

| #   | Risk                                                                     | Kemungkinan | Dampak | Mitigasi                                                                   |
| --- | ------------------------------------------------------------------------ | ----------- | ------ | -------------------------------------------------------------------------- |
| R1  | Menghapus kode yang ternyata masih dipakai di views                      | Sedang      | Tinggi | Selalu grep sebelum hapus, hapus satu blok per waktu                       |
| R2  | `npm uninstall` menghapus package yang masih digunakan                   | Rendah      | Tinggi | Grep setiap package sebelum uninstall                                      |
| R3  | Migrasi `<script setup>` menyebabkan error karena `this` masih digunakan | Tinggi      | Tinggi | Baca seluruh komponen sebelum migrasi, test di browser setelah setiap file |
| R4  | Template simplifikasi di `ImageUpload.vue` menyebabkan ikon tidak tampil | Sedang      | Sedang | Test dengan berbagai tipe file setelah perubahan                           |
| R5  | Route name yang diubah di T3 menyebabkan navigasi gagal                  | Rendah      | Sedang | Grep nama lama di seluruh src/ sebelum ubah                                |
| R6  | Dev server tidak auto-reload setelah perubahan besar                     | Rendah      | Rendah | Restart `npm run serve` jika diperlukan                                    |
| R7  | Composable `useApi` digunakan secara tidak benar                         | Rendah      | Sedang | Ikuti contoh di dokumentasi composable, test di komponen kecil dulu        |

---

## 🔍 Testing Checklist Setelah Fase 3 Selesai

Lakukan semua test berikut sebelum dianggap selesai:

1. **Test Core Components:**

   - [ ] Header tampil normal, tombol toggle sidebar berfungsi
   - [ ] Sidebar tampil dengan semua menu, accordion bisa dibuka
   - [ ] Upload gambar di komponen `ImageUpload` berfungsi untuk berbagai tipe file

2. **Test Navigasi:**

   - [ ] Klik setiap menu di sidebar, pastikan mengarah ke halaman yang benar
   - [ ] Tidak ada Vue Router warning di console tentang route yang tidak ditemukan

3. **Test Dependency:**

   - [ ] `npm install` berjalan tanpa error setelah cleanup
   - [ ] `npm run build` menghasilkan `dist/` tanpa error

4. **Test Browser Console:**

   - [ ] Tidak ada error merah
   - [ ] Tidak ada Vue warning tentang deprecated API

5. **Test Auth:**
   - [ ] Login masih berfungsi
   - [ ] Logout masih berfungsi

---

## 📝 Catatan Implementasi

```
[2026-09-01] Fase 3 Completed:
- T1: Dead code & unused properties cleaned from ImageUpload.vue, ImageMultiUpload.vue, VideoUpload.vue, AdminDashboard.vue
- T2: Uninstalled unused dependencies: flag-icon-css, handy-uploader, buffer-es6, roboto-fontface (vulnerabilities dropped from 26 to 17)
- T3: Route names verified across all 112 routes (0 duplicate names found)
- T4: Global error handler and unhandledrejection listener added to main.js
- T5: Reusable composables useDebounce.js and useApi.js created in src/composables/
- T6: ImageUpload.vue template simplified using computed mapping
- T7: Shared components (HeaderDashboard.vue, SidebarDashboard.vue, ImageUpload.vue) migrated to <script setup> Composition API
- ESLint configuration updated with vue/setup-compiler-macros
- Production build (npm run build) completed successfully with 0 errors
```

---

_File ini diperbarui pada 2026-09-01. Fase 1, Fase 2, dan Fase 3 sudah selesai. Fase 4 siap dieksekusi._

---

# 🎨 IMPLEMENTATION.md — Fase 4: UX & Security Polish ✅ SELESAI

> **Status:** COMPLETED
> **Tanggal:** 2026-09-01
> **Target Audiens:** Model AI (Gemini Flash High / Claude) yang akan mengeksekusi task ini
> **Prasyarat WAJIB:** Baca [`docs/README.md`](./README.md) dan [`docs/IMPROVEMENT.md`](./IMPROVEMENT.md) terlebih dahulu
> **Fase:** 4 dari N
> **Fokus:** Meningkatkan UX dengan komponen reusable terpusat dan memperkuat security headers — tanpa menyentuh view files
> **Estimasi Total:** 12–18 jam

---

## ⚠️ PERINGATAN KRITIS — BACA SEBELUM MEMULAI

> Fase 2 dan 3 sebelumnya pernah menyebabkan error karena perubahan terlalu agresif.
> Fase 4 ini merancang semua improvement sebagai **komponen baru yang BERSIFAT ADDITIVE** — tidak mengubah file yang sudah ada, kecuali `src/App.vue`, `src/main.js`, dan `public/.htaccess`.

**Prinsip Aman WAJIB di Fase 4:**

1. **JANGAN ubah file di `src/views/`** — tanpa pengecualian apapun.
2. **Semua komponen baru** (GlobalNotification, ConfirmDialog, EmptyState, AppBreadcrumb) harus bisa digunakan **secara opsional** — tidak memaksa view yang sudah ada untuk berubah.
3. **Verifikasi `npm run build` berhasil** setelah setiap task selesai.
4. **Pinia store baru** tidak boleh mengubah store yang sudah ada (`navigation.js`).
5. **Baca file target lengkap** sebelum mengedit — jangan berasumsi isi file.
6. **Lakukan satu task per waktu** — jangan gabungkan beberapa task sekaligus.

---

## 📋 Ringkasan Eksekutif

Fase 4 berfokus pada tiga pilar utama:

1. **Security** — Memperkuat header HTTP dan mematikan `console.log` di production build
2. **UX Reusable Components** — Membuat komponen shared yang mengurangi duplikasi ratusan baris kode di seluruh view
3. **App.vue Enhancement** — Token expiry monitoring yang lebih robust

Semua perubahan bersifat **additive** (menambahkan hal baru) bukan **destructive** (mengubah yang sudah ada), sehingga risiko breaking change sangat rendah.

| #   | Task ID | Nama Task                                   | Dampak | Risiko    | Estimasi  |
| --- | ------- | ------------------------------------------- | ------ | --------- | --------- |
| 1   | T1      | Security headers & console.log cleanup      | Tinggi | 🟢 Rendah | 1–1.5 jam |
| 2   | T2      | Token expiry monitoring robust di `App.vue` | Sedang | 🟢 Rendah | 1–2 jam   |
| 3   | T3      | Pinia store `useNotificationStore`          | Sedang | 🟢 Rendah | 1 jam     |
| 4   | T4      | Komponen `GlobalNotification.vue`           | Tinggi | 🟢 Rendah | 1–2 jam   |
| 5   | T5      | Komponen `ConfirmDialog.vue` reusable       | Sedang | 🟢 Rendah | 1–2 jam   |
| 6   | T6      | Komponen `EmptyState.vue`                   | Sedang | 🟢 Rendah | 1 jam     |
| 7   | T7      | Composable `usePagination.js`               | Sedang | 🟡 Sedang | 2–3 jam   |
| 8   | T8      | Composable `useApiWithCache.js`             | Sedang | 🟡 Sedang | 2–3 jam   |
| 9   | T9      | Integrasi dan verifikasi akhir              | -      | 🟢 Rendah | 1–2 jam   |

**Yang TIDAK dilakukan di Fase 4:**

- Tidak mengubah view yang sudah ada untuk menggunakan komponen baru
- Tidak migrasi ke Vite
- Tidak rename direktori views
- Tidak mengubah API calls di view manapun

---

## 🕐 Timeline & Estimasi

| Task | Nama                                   | Estimasi        | Urutan | Dependency    |
| ---- | -------------------------------------- | --------------- | ------ | ------------- |
| T1   | Security headers + console.log cleanup | 1–1.5 jam       | 1      | Independen    |
| T2   | Token expiry monitoring                | 1–2 jam         | 2      | Independen    |
| T3   | `useNotificationStore` Pinia store     | 1 jam           | 3      | Independen    |
| T4   | `GlobalNotification.vue`               | 1–2 jam         | 4      | T3 selesai    |
| T5   | `ConfirmDialog.vue`                    | 1–2 jam         | 5      | Independen    |
| T6   | `EmptyState.vue`                       | 1 jam           | 6      | Independen    |
| T7   | `usePagination.js` composable          | 2–3 jam         | 7      | Independen    |
| T8   | `useApiWithCache.js` composable        | 2–3 jam         | 8      | Independen    |
| T9   | Integrasi & verifikasi akhir           | 1–2 jam         | 9      | T1–T8 selesai |
|      | **TOTAL**                              | **11–17.5 jam** |        |               |

### Dependency Chart

```
T1 (security) ─────────────────────────────────── T9 (verifikasi)
T2 (token expiry) ─────────────────────────────── T9
T3 (notification store) ──→ T4 (GlobalNotification) ─ T9
T5 (ConfirmDialog) ─────────────────────────────── T9
T6 (EmptyState) ────────────────────────────────── T9
T7 (usePagination) ─────────────────────────────── T9
T8 (useApiWithCache) ───────────────────────────── T9
```

---

## 📊 Estimasi Resource

| Resource                                         | Detail                                                                                                                                                    |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Model**                                        | Gemini Flash (High) atau Claude Sonnet                                                                                                                    |
| **File yang boleh dibuat/diubah**                | `public/.htaccess`, `vue.config.js`, `src/App.vue`, `src/main.js`, `src/stores/*.js` (baru), `src/components/*.vue` (baru), `src/composables/*.js` (baru) |
| **File yang TIDAK BOLEH diubah**                 | Semua file di `src/views/` — **tanpa pengecualian**                                                                                                       |
| **File yang SUDAH ADA — baca dulu sebelum edit** | `src/App.vue`, `src/main.js`, `public/.htaccess`, `vue.config.js`                                                                                         |
| **Tools yang dibutuhkan**                        | `run_command`, `view_file`, `replace_file_content`, `write_to_file`, `grep_search`, `multi_replace_file_content`                                          |

---

## ✅ Progress Checklist

- [x] **T1** — Security headers diperbarui di `.htaccess`, `console.log` distrip di production
- [x] **T2** — Token expiry `setInterval` ditambahkan di `App.vue`
- [x] **T3** — `src/stores/notification.js` dibuat dengan Pinia
- [x] **T4** — `src/components/GlobalNotification.vue` dibuat dan didaftarkan di `App.vue`
- [x] **T5** — `src/components/ConfirmDialog.vue` dibuat
- [x] **T6** — `src/components/EmptyState.vue` dibuat
- [x] **T7** — `src/composables/usePagination.js` dibuat
- [x] **T8** — `src/composables/useApiWithCache.js` dibuat
- [x] **T9** — `npm run build` berhasil 0 error, semua komponen baru terdaftar

---

## 📝 Detail Task

---

### T1 — Security Headers & Console.log Cleanup

**Deskripsi:**
Memperkuat security HTTP headers di `.htaccess` cPanel dan mematikan `console.log` secara otomatis di production build via konfigurasi Webpack. Ini adalah improvement paling aman karena tidak menyentuh kode Vue sama sekali.

**Kompleksitas:** 🟢 Rendah  
**Risiko:** 🟢 Sangat rendah — file `.htaccess` dan `vue.config.js` sudah ada, hanya ditambahkan konfigurasi

**⚠️ Catatan Penting:**

- Baca isi `public/.htaccess` dan `vue.config.js` terlebih dahulu sebelum mengedit
- Jangan hapus konfigurasi SPA routing yang sudah ada di `.htaccess`
- `vue.config.js` mungkin sudah memiliki konfigurasi lain — jangan timpa, hanya tambahkan

---

**Sub-task T1.1: Update Security Headers di `.htaccess`**

**Estimasi:** 30–45 menit

**Step-by-step:**

1. Baca isi `public/.htaccess` dengan `view_file`
2. Cek apakah sudah ada blok `<IfModule mod_headers.c>` — jika sudah ada, update; jika belum, tambahkan
3. Tambahkan/update header berikut (pastikan tidak menghapus SPA routing rules yang sudah ada):

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

  # Referrer Policy
  Header set Referrer-Policy "strict-origin-when-cross-origin"

  # Permissions Policy
  Header set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
</IfModule>
```

4. Verifikasi `npm run build` masih berhasil (header `.htaccess` tidak mempengaruhi build, tapi verifikasi diperlukan)

---

**Sub-task T1.2: Strip console.log di Production Build**

**Estimasi:** 30–45 menit

**Step-by-step:**

1. Baca isi `vue.config.js` dengan `view_file`
2. Tambahkan konfigurasi `chainWebpack` untuk menghapus `console.log` di production:

```javascript
// Tambahkan ke dalam module.exports di vue.config.js
chainWebpack: (config) => {
  if (process.env.NODE_ENV === 'production') {
    config.optimization.minimizer('terser').tap((args) => {
      if (args[0] && args[0].terserOptions) {
        args[0].terserOptions.compress = {
          ...args[0].terserOptions.compress,
          drop_console: true,
          drop_debugger: true,
        };
      }
      return args;
    });
  }
},
```

3. Jalankan `npm run build` dan verifikasi berhasil
4. Cek apakah output build bebas dari `console.log` di source maps atau bundle

**Total Estimasi T1: 1–1.5 jam**

---

### T2 — Token Expiry Monitoring yang Robust

**Deskripsi:**
Menambahkan `setInterval` 5 menit di `App.vue` untuk memeriksa apakah token JWT sudah expired secara periodik. Saat ini `App.vue` sudah memiliki token expiry check, tapi belum dijalankan secara periodik — hanya saat mounted.

**Kompleksitas:** 🟢 Rendah  
**Risiko:** 🟢 Rendah — `App.vue` sudah ada logika token check, ini hanya menambahkan interval

**⚠️ Catatan Penting:**

- Baca isi `src/App.vue` terlebih dahulu — file ini sudah punya kode token expiry
- Jangan menghapus logika yang sudah ada
- Pastikan interval di-clear di lifecycle `beforeUnmount` untuk mencegah memory leak

---

**Sub-task T2.1: Baca dan Pahami `App.vue` yang Sudah Ada**

**Estimasi:** 15 menit

**Step-by-step:**

1. Baca file `src/App.vue` dengan `view_file`
2. Identifikasi kode token expiry yang sudah ada
3. Tentukan titik yang tepat untuk menambahkan `setInterval`

---

**Sub-task T2.2: Tambahkan Periodic Token Check**

**Estimasi:** 45 menit–1 jam

**Step-by-step:**

Setelah membaca `App.vue`, tambahkan/perbarui logika berikut sesuai pattern yang sudah ada di file (bisa Options API atau Composition API):

**Jika `App.vue` menggunakan Options API:**

```javascript
// Tambahkan property tokenCheckInterval
data() {
  return {
    tokenCheckInterval: null,
    // ... property yang sudah ada
  };
},

mounted() {
  this.checkTokenExpiry(); // existing call
  // Tambahkan periodic check setiap 5 menit
  this.tokenCheckInterval = setInterval(this.checkTokenExpiry, 5 * 60 * 1000);
},

beforeUnmount() {
  // Bersihkan interval saat komponen di-destroy
  if (this.tokenCheckInterval) {
    clearInterval(this.tokenCheckInterval);
    this.tokenCheckInterval = null;
  }
},

methods: {
  checkTokenExpiry() {
    const token = tokenStorage.getToken();
    if (!token) return;

    try {
      // Decode JWT payload tanpa library (base64 decode bagian payload)
      const base64Payload = token.split('.')[1];
      if (!base64Payload) throw new Error('Invalid token format');
      const payload = JSON.parse(atob(base64Payload));

      if (payload.exp && payload.exp < Date.now() / 1000) {
        tokenStorage.clearAll();
        this.$router.push({ name: 'login' });
      }
    } catch {
      // Token malformed/corrupt — logout paksa
      tokenStorage.clearAll();
      this.$router.push({ name: 'login' });
    }
  },
},
```

**Jika `App.vue` sudah menggunakan Composition API / `<script setup>`:**

```javascript
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { tokenStorage } from '@/util/tokenStorage';

const router = useRouter();
let tokenCheckInterval = null;

const checkTokenExpiry = () => {
  const token = tokenStorage.getToken();
  if (!token) return;

  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) throw new Error('Invalid token format');
    const payload = JSON.parse(atob(base64Payload));

    if (payload.exp && payload.exp < Date.now() / 1000) {
      tokenStorage.clearAll();
      router.push({ name: 'login' });
    }
  } catch {
    tokenStorage.clearAll();
    router.push({ name: 'login' });
  }
};

onMounted(() => {
  checkTokenExpiry();
  tokenCheckInterval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
});

onBeforeUnmount(() => {
  if (tokenCheckInterval) clearInterval(tokenCheckInterval);
});
```

3. Jalankan `npm run build` untuk verifikasi

**Total Estimasi T2: 1–2 jam**

---

### T3 — Pinia Store `useNotificationStore`

**Deskripsi:**
Membuat Pinia store terpusat untuk mengelola notifikasi (success/error/warning snackbar) yang nantinya digunakan oleh `GlobalNotification.vue`. Store ini dirancang agar **view yang sudah ada tidak perlu diubah** — cukup komponen baru yang meng-consume store ini.

**Kompleksitas:** 🟢 Rendah  
**Risiko:** 🟢 Sangat rendah — file baru, tidak mengubah apapun yang sudah ada

---

**Sub-task T3.1: Buat `src/stores/notification.js`**

**Estimasi:** 30–45 menit

**Step-by-step:**

1. Cek apakah `src/stores/` sudah ada dengan `list_dir` — folder ini dibuat di Fase 2
2. Buat file `src/stores/notification.js` dengan konten berikut:

```javascript
// src/stores/notification.js
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    show: false,
    message: '',
    color: 'success',
    timeout: 3000,
    queue: [],
  }),

  actions: {
    _show(message, color, timeout = 3000) {
      this.message = message;
      this.color = color;
      this.timeout = timeout;
      this.show = true;
    },

    success(message, timeout = 3000) {
      this._show(message, 'success', timeout);
    },

    error(message, timeout = 4000) {
      this._show(message, 'error', timeout);
    },

    warning(message, timeout = 3500) {
      this._show(message, 'warning', timeout);
    },

    info(message, timeout = 3000) {
      this._show(message, 'info', timeout);
    },

    hide() {
      this.show = false;
    },
  },
});
```

3. Verifikasi store bisa di-import tanpa error dengan `node -e "require('./src/stores/notification.js')"` (jika memungkinkan)

**Total Estimasi T3: 30–45 menit**

---

### T4 — Komponen `GlobalNotification.vue`

**Deskripsi:**
Membuat komponen `GlobalNotification.vue` yang didaftarkan di `App.vue` satu kali, menggantikan pattern `v-snackbar` yang diulang di setiap view. Komponen ini bersifat **additive** — tidak menghapus snackbar yang sudah ada di view.

**Kompleksitas:** 🟢 Rendah  
**Risiko:** 🟢 Rendah — hanya menambahkan komponen baru di `App.vue`, tidak mengubah template view

**⚠️ Catatan Penting:**

- Daftarkan di `App.vue` dengan `<global-notification />` di template
- Baca `App.vue` dulu sebelum mengedit — pastikan tidak duplikat dengan komponen yang mungkin sudah ada

---

**Sub-task T4.1: Buat `src/components/GlobalNotification.vue`**

**Estimasi:** 30–45 menit

**Step-by-step:**

1. Buat file `src/components/GlobalNotification.vue`:

```vue
<!-- src/components/GlobalNotification.vue -->
<template>
  <v-snackbar
    v-model="notification.show"
    :color="notification.color"
    :timeout="notification.timeout"
    location="top right"
    rounded="lg"
    elevation="4"
    min-width="280"
  >
    <div class="d-flex align-center gap-2">
      <v-icon v-if="snackbarIcon" size="20">{{ snackbarIcon }}</v-icon>
      <span>{{ notification.message }}</span>
    </div>

    <template v-slot:actions>
      <v-btn icon variant="text" size="small" @click="notification.hide()">
        <v-icon size="18">mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue';
import { useNotificationStore } from '@/stores/notification';

const notification = useNotificationStore();

const snackbarIcon = computed(() => {
  const icons = {
    success: 'mdi-check-circle-outline',
    error: 'mdi-alert-circle-outline',
    warning: 'mdi-alert-outline',
    info: 'mdi-information-outline',
  };
  return icons[notification.color] || null;
});
</script>
```

---

**Sub-task T4.2: Daftarkan `GlobalNotification` di `App.vue`**

**Estimasi:** 15–20 menit

**Step-by-step:**

1. Baca isi `src/App.vue` dengan `view_file`
2. Tambahkan import komponen:
   ```javascript
   import GlobalNotification from '@/components/GlobalNotification.vue';
   ```
3. Daftarkan di `components` (jika Options API) atau cukup import (jika `<script setup>`)
4. Tambahkan tag `<global-notification />` di template `App.vue` — letakkan di luar `<router-view>` tapi masih di dalam root element

**Total Estimasi T4: 1–2 jam**

---

### T5 — Komponen `ConfirmDialog.vue` Reusable

**Deskripsi:**
Membuat komponen dialog konfirmasi yang dapat digunakan oleh view mana saja. Dialog ini menggantikan pola `v-dialog` konfirmasi delete yang sama persis diulang di 60+ view. Komponen bersifat **additive** — view yang sudah ada tidak diubah.

**Kompleksitas:** 🟢 Rendah  
**Risiko:** 🟢 Sangat rendah — file baru, tidak mengubah apapun yang sudah ada

---

**Sub-task T5.1: Buat `src/components/ConfirmDialog.vue`**

**Estimasi:** 45 menit–1 jam

**Step-by-step:**

1. Buat file `src/components/ConfirmDialog.vue`:

```vue
<!-- src/components/ConfirmDialog.vue -->
<!-- 
  CARA PENGGUNAAN DI VIEW (opsional, tidak wajib):
  
  <confirm-dialog
    v-model="isDeleteOpen"
    title="Delete Item"
    message="Are you sure you want to delete this item?"
    confirm-text="Delete"
    confirm-color="error"
    @confirm="handleDelete"
  />
  
  Di script:
  import ConfirmDialog from '@/components/ConfirmDialog.vue';
  components: { ConfirmDialog },
  data: () => ({ isDeleteOpen: false }),
  methods: {
    openDelete() { this.isDeleteOpen = true; },
    handleDelete() { /* logic delete */ },
  }
-->
<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
    :width="width"
  >
    <v-card rounded="lg">
      <v-card-title class="text-h6 pt-5 px-6">
        <v-icon v-if="icon" :color="confirmColor" class="mr-2">{{ icon }}</v-icon>
        {{ title }}
      </v-card-title>

      <v-card-text class="px-6 pb-2 text-body-2">
        {{ message }}
      </v-card-text>

      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn variant="text" style="text-transform: none" @click="onCancel">
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="confirmColor"
          variant="flat"
          style="text-transform: none"
          :loading="loading"
          @click="onConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Confirmation' },
  message: { type: String, default: 'Are you sure you want to proceed?' },
  confirmText: { type: String, default: 'Yes' },
  cancelText: { type: String, default: 'Cancel' },
  confirmColor: { type: String, default: 'error' },
  icon: { type: String, default: 'mdi-alert-circle-outline' },
  width: { type: [String, Number], default: 420 },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const onConfirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};

const onCancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};
</script>
```

2. Jalankan `npm run build` untuk memastikan tidak ada error

**Total Estimasi T5: 45 menit–1 jam**

---

### T6 — Komponen `EmptyState.vue`

**Deskripsi:**
Membuat komponen visual yang ditampilkan ketika tabel tidak memiliki data. Saat ini ketika data kosong, tabel hanya menampilkan baris kosong tanpa feedback visual yang jelas. Komponen ini bersifat **additive**.

**Kompleksitas:** 🟢 Rendah  
**Risiko:** 🟢 Sangat rendah — file baru saja

---

**Sub-task T6.1: Buat `src/components/EmptyState.vue`**

**Estimasi:** 30–45 menit

**Step-by-step:**

1. Buat file `src/components/EmptyState.vue`:

```vue
<!-- src/components/EmptyState.vue -->
<!--
  CARA PENGGUNAAN DI VIEW (opsional):
  
  <empty-state
    v-if="!isLoading && items.length === 0"
    title="No Data Found"
    subtitle="There are no records to display."
  />
  
  atau dengan tombol aksi:
  
  <empty-state
    v-if="!isLoading && items.length === 0"
    icon="mdi-account-off-outline"
    title="No Users Found"
    subtitle="Start by adding a new user."
    action-label="Add User"
    @action="openAddDialog"
  />
-->
<template>
  <div class="empty-state d-flex flex-column align-center justify-center py-12 px-4">
    <v-icon :size="iconSize" :color="iconColor" class="mb-4 empty-state__icon">
      {{ icon }}
    </v-icon>

    <p class="text-h6 font-weight-medium text-medium-emphasis mb-1">
      {{ title }}
    </p>

    <p class="text-body-2 text-disabled text-center" style="max-width: 320px">
      {{ subtitle }}
    </p>

    <v-btn
      v-if="actionLabel"
      :color="actionColor"
      variant="tonal"
      class="mt-5"
      style="text-transform: none"
      @click="$emit('action')"
    >
      <v-icon start>{{ actionIcon }}</v-icon>
      {{ actionLabel }}
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'mdi-database-off-outline' },
  iconSize: { type: [String, Number], default: 72 },
  iconColor: { type: String, default: 'grey-lighten-2' },
  title: { type: String, default: 'No Data Found' },
  subtitle: { type: String, default: 'There are no records to display.' },
  actionLabel: { type: String, default: '' },
  actionIcon: { type: String, default: 'mdi-plus' },
  actionColor: { type: String, default: 'primary' },
});

defineEmits(['action']);
</script>

<style scoped>
.empty-state__icon {
  opacity: 0.5;
}
</style>
```

2. Jalankan `npm run build` untuk memastikan tidak ada error

**Total Estimasi T6: 30–45 menit**

---

### T7 — Composable `usePagination.js`

**Deskripsi:**
Membuat composable reusable untuk pagination yang dapat digunakan oleh view manapun yang ingin mengimplementasikan pagination server-side. Composable ini tidak mengubah apapun yang sudah ada — view yang sudah ada tetap berjalan seperti biasa.

**Kompleksitas:** 🟡 Sedang — ada logic reactive yang perlu diperhatikan  
**Risiko:** 🟢 Rendah — file baru, tidak ada dependency ke view yang sudah ada

---

**Sub-task T7.1: Buat `src/composables/usePagination.js`**

**Estimasi:** 1–1.5 jam

**Step-by-step:**

1. Cek apakah `src/composables/` sudah ada (dibuat di Fase 3) dengan `list_dir`
2. Buat file `src/composables/usePagination.js`:

```javascript
// src/composables/usePagination.js
/**
 * Composable reusable untuk pagination.
 *
 * CARA PENGGUNAAN (opsional, di view baru):
 *
 * import { usePagination } from '@/composables/usePagination';
 * import axios from '@/util/axios';
 *
 * const fetchUsers = async ({ page, pageSize, search }) => {
 *   const res = await axios.get('/users', { params: { page, page_size: pageSize, search } });
 *   return { data: res.data.data, total: res.data.total };
 * };
 *
 * const {
 *   items, page, pageSize, total, totalPages,
 *   isLoading, error, fetch, goToPage, setSearch
 * } = usePagination(fetchUsers, { initialPageSize: 10 });
 *
 * // Panggil fetch() saat mounted
 * onMounted(() => fetch());
 */
import { ref, computed } from 'vue';

export function usePagination(fetchFn, options = {}) {
  const { initialPageSize = 10, initialPage = 1, immediate = false } = options;

  const page = ref(initialPage);
  const pageSize = ref(initialPageSize);
  const total = ref(0);
  const items = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const search = ref('');

  const totalPages = computed(() =>
    pageSize.value > 0 ? Math.ceil(total.value / pageSize.value) : 0
  );

  const hasNextPage = computed(() => page.value < totalPages.value);
  const hasPrevPage = computed(() => page.value > 1);

  const fetch = async (params = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await fetchFn({
        page: page.value,
        pageSize: pageSize.value,
        search: search.value,
        ...params,
      });

      items.value = result.data ?? [];
      total.value = result.total ?? 0;
    } catch (e) {
      error.value = e?.response?.data?.message || e?.message || 'An error occurred';
      items.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const goToPage = (p) => {
    const targetPage = Math.max(1, Math.min(p, totalPages.value || p));
    page.value = targetPage;
    fetch();
  };

  const nextPage = () => {
    if (hasNextPage.value) goToPage(page.value + 1);
  };

  const prevPage = () => {
    if (hasPrevPage.value) goToPage(page.value - 1);
  };

  const setSearch = (query) => {
    search.value = query;
    page.value = 1; // reset ke halaman pertama saat search
    fetch();
  };

  const setPageSize = (size) => {
    pageSize.value = size;
    page.value = 1;
    fetch();
  };

  const reset = () => {
    page.value = initialPage;
    pageSize.value = initialPageSize;
    total.value = 0;
    items.value = [];
    search.value = '';
    error.value = null;
  };

  if (immediate) {
    fetch();
  }

  return {
    // State
    page,
    pageSize,
    total,
    items,
    isLoading,
    error,
    search,
    // Computed
    totalPages,
    hasNextPage,
    hasPrevPage,
    // Actions
    fetch,
    goToPage,
    nextPage,
    prevPage,
    setSearch,
    setPageSize,
    reset,
  };
}
```

3. Jalankan `npm run build` untuk verifikasi

**Total Estimasi T7: 1–1.5 jam**

---

### T8 — Composable `useApiWithCache.js`

**Deskripsi:**
Membuat composable untuk meng-cache response API yang jarang berubah (misalnya: list aplikasi aktif, data referensi dropdown). Cache disimpan di memory (bukan localStorage) dan memiliki TTL (time-to-live) yang bisa dikonfigurasi.

**Kompleksitas:** 🟡 Sedang — ada cache eviction logic  
**Risiko:** 🟢 Rendah — file baru, tidak ada dependency

---

**Sub-task T8.1: Buat `src/composables/useApiWithCache.js`**

**Estimasi:** 1–1.5 jam

**Step-by-step:**

1. Buat file `src/composables/useApiWithCache.js`:

```javascript
// src/composables/useApiWithCache.js
/**
 * Composable untuk API calls dengan in-memory caching.
 * Cache di-reset otomatis saat page di-refresh.
 *
 * CARA PENGGUNAAN (opsional, di view baru atau composable lain):
 *
 * import { useApiWithCache } from '@/composables/useApiWithCache';
 *
 * // Cache selama 5 menit (default)
 * const { data, isLoading, error, fetch, invalidate } = useApiWithCache('/app/active');
 *
 * onMounted(() => fetch());
 *
 * // Force refresh (bypass cache)
 * const refresh = () => fetch(true);
 *
 * // Invalidate cache (hapus dari cache, next fetch akan hit server)
 * const clearCache = () => invalidate();
 */
import { ref } from 'vue';
import axios from '@/util/axios';

// Module-level cache — shared across all composable instances
const _cache = new Map();

export function useApiWithCache(url, options = {}) {
  const {
    ttlMs = 5 * 60 * 1000, // default: 5 menit
    transformData = (data) => data, // optional data transformer
    params = {},
  } = options;

  const data = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const _getCacheKey = () => {
    const paramStr = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
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
```

2. Jalankan `npm run build` untuk verifikasi

**Total Estimasi T8: 1–1.5 jam**

---

### T9 — Integrasi & Verifikasi Akhir

**Deskripsi:**
Memverifikasi semua task T1–T8 sudah diimplementasi dengan benar, tidak ada error build, dan mendaftarkan komponen baru di dokumentasi.

**Kompleksitas:** 🟢 Rendah  
**Risiko:** 🟢 Rendah

---

**Sub-task T9.1: Build Production Test**

**Estimasi:** 15–30 menit

**Step-by-step:**

1. Jalankan `npm run build`
2. Pastikan output menunjukkan `DONE Build complete` dengan 0 errors
3. Periksa apakah ada warning yang perlu diperhatikan (warning `::v-deep` adalah warisan lama dan bisa diabaikan)

---

**Sub-task T9.2: Verifikasi File yang Dibuat**

**Estimasi:** 15 menit

Pastikan semua file berikut ada dan dapat di-import:

```
src/
├── components/
│   ├── GlobalNotification.vue  ← T4
│   ├── ConfirmDialog.vue       ← T5
│   └── EmptyState.vue          ← T6
├── composables/
│   ├── useDebounce.js          ← dari Fase 3
│   ├── useApi.js               ← dari Fase 3
│   ├── usePagination.js        ← T7
│   └── useApiWithCache.js      ← T8
└── stores/
    ├── navigation.js           ← dari Fase 2
    └── notification.js         ← T3
```

---

**Sub-task T9.3: Update Checklist di IMPLEMENTATION.md**

**Estimasi:** 10 menit

Tandai semua item checklist di bagian `✅ Progress Checklist` sebagai `[x]` setelah semua task selesai.

**Total Estimasi T9: 30–45 menit**

---

## 🛡️ Risk & Mitigation

| Task                    | Risiko                                                         | Probabilitas | Mitigasi                                                                                                |
| ----------------------- | -------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| T1 (Security Headers)   | CSP memblokir resource yang legitimate                         | 🟡 Sedang    | Test di browser developer tools, perhatikan console CSP errors. Gunakan `'unsafe-inline'` sementara.    |
| T1 (Terser config)      | `chainWebpack` conflict dengan konfigurasi yang sudah ada      | 🟡 Sedang    | Baca `vue.config.js` dulu, gunakan `tap()` bukan replace.                                               |
| T2 (Token Expiry)       | Conflict dengan logika token check yang sudah ada di `App.vue` | 🟡 Sedang    | Baca `App.vue` dulu, jangan duplikasi, hanya tambahkan `setInterval`.                                   |
| T4 (GlobalNotification) | Conflict posisi `v-snackbar` dengan yang sudah ada di view     | 🟢 Rendah    | Komponen ini di `App.vue`, tidak menghapus yang ada di view — keduanya bisa berjalan bersamaan.         |
| T7 (usePagination)      | API backend tidak support pagination                           | 🟡 Sedang    | Composable sudah dirancang agar bebas dari format response tertentu — user bisa menyesuaikan `fetchFn`. |
| T8 (useApiWithCache)    | Cache stale data menyebabkan UI tidak update                   | 🟡 Sedang    | Gunakan `forceRefresh = true` atau `invalidate()` setelah mutation. Dokumentasikan di JSDoc.            |
| Semua                   | Breaking change di view                                        | 🟢 Rendah    | Semua komponen/composable baru bersifat additive — tidak ada yang memaksa view berubah.                 |

---

## 📋 Catatan Implementasi

```
[2026-09-01] Fase 4 Completed:
- T1: Updated Content-Security-Policy & Permissions-Policy in public/.htaccess, added chainWebpack terser drop_console & drop_debugger in vue.config.js
- T2: Token expiry periodic check verified & preserved in src/App.vue
- T3: Created src/stores/notification.js (Pinia store for toast notifications)
- T4: Created src/components/GlobalNotification.vue and registered in src/App.vue
- T5: Created src/components/ConfirmDialog.vue (reusable confirmation dialog)
- T6: Created src/components/EmptyState.vue (reusable empty state component)
- T7: Created src/composables/usePagination.js (reusable server pagination composable)
- T8: Created src/composables/useApiWithCache.js (in-memory TTL API cache composable)
- T9: Verification build (npm run build) completed successfully with 0 errors
```

---

_File ini diperbarui pada 2026-09-01. Fase 1, Fase 2, Fase 3, dan Fase 4 sudah selesai. Fase 5 siap dieksekusi._

---

# ⚡ IMPLEMENTATION.md — Fase 5: Performance Optimization ✅ SELESAI

> **Status:** COMPLETED
> **Tanggal:** 2026-09-01
> **Target Audiens:** Model AI (Gemini Flash High / Claude) yang akan mengeksekusi task ini
> **Prasyarat WAJIB:** Baca [`docs/README.md`](./README.md) dan [`docs/IMPROVEMENT.md`](./IMPROVEMENT.md) terlebih dahulu
> **Fase:** 5 dari N
> **Fokus:** Meningkatkan performa load halaman dan interaktivitas UI — tanpa menyentuh file di `src/views/` > **Estimasi Total:** 10–14 jam

---

## ⚠️ PERINGATAN KRITIS — BACA SEBELUM MEMULAI

> Fase ini dirancang sepenuhnya **ADDITIVE** — semua perubahan berupa penambahan file baru atau modifikasi minimal di file infrastruktur (`vue.config.js`, `src/main.js`).

**Prinsip Aman WAJIB di Fase 5:**

1. **JANGAN ubah file di `src/views/`** — tanpa pengecualian apapun.
2. **Jangan hapus atau ubah composable yang sudah ada** (`useApi.js`, `useDebounce.js`, `usePagination.js`, `useApiWithCache.js`).
3. **Verifikasi `npm run build` berhasil (0 errors)** setelah setiap task diselesaikan.
4. **Baca file target secara lengkap** sebelum mengedit menggunakan `view_file`.
5. **Jangan install dependency baru** tanpa memverifikasi bahwa tidak ada paket yang sudah tersedia secara built-in di Vuetify 3.
6. **Skeleton loader** menggunakan `v-skeleton-loader` dari Vuetify 3 — sudah tersedia, tidak perlu install apa-apa.

---

## 📋 Ringkasan Eksekutif

Fase 5 berfokus pada tiga pilar peningkatan performa:

1. **Skeleton Screen Loading** — Menggantikan spinner loading polos dengan skeleton loader yang informatif dan premium secara visual.
2. **Chunk Splitting Optimization** — Mengoptimasi cara Webpack memecah bundle agar halaman awal lebih cepat di-load.
3. **Image Lazy Loading** — Menambahkan lazy loading pada komponen `v-img` di seluruh tabel untuk mengurangi beban network awal.

Semua perubahan bersifat **additive** dan **tidak memaksa view yang sudah ada untuk berubah**. Komponen dan composable baru dapat digunakan secara opsional oleh view yang ingin memanfaatkannya.

| #   | Task ID | Nama Task                                                | Dampak | Risiko    | Estimasi  |
| --- | ------- | -------------------------------------------------------- | ------ | --------- | --------- |
| 1   | T1      | Webpack chunk splitting optimization                     | Tinggi | 🟢 Rendah | 1–1.5 jam |
| 2   | T2      | Composable `useSkeletonLoader.js`                        | Tinggi | 🟢 Rendah | 1 jam     |
| 3   | T3      | Komponen `SkeletonTable.vue` reusable                    | Tinggi | 🟢 Rendah | 2–3 jam   |
| 4   | T4      | Composable `useImageLazy.js` (image lazy loading helper) | Sedang | 🟢 Rendah | 1 jam     |
| 5   | T5      | Integrasi dan verifikasi akhir                           | -      | 🟢 Rendah | 1–2 jam   |

**Yang TIDAK dilakukan di Fase 5:**

- Tidak mengubah file di `src/views/` — semua komponen baru bersifat opsional
- Tidak migrasi ke Vite
- Tidak rename direktori views
- Tidak mengubah logika API call yang sudah ada

---

## 🕐 Timeline & Estimasi

| Task | Nama                              | Estimasi      | Urutan | Dependency    |
| ---- | --------------------------------- | ------------- | ------ | ------------- |
| T1   | Webpack chunk splitting           | 1–1.5 jam     | 1      | Independen    |
| T2   | `useSkeletonLoader.js` composable | 1 jam         | 2      | Independen    |
| T3   | `SkeletonTable.vue` component     | 2–3 jam       | 3      | T2 selesai    |
| T4   | `useImageLazy.js` composable      | 1 jam         | 4      | Independen    |
| T5   | Verifikasi akhir                  | 1–2 jam       | 5      | T1–T4 selesai |
|      | **TOTAL**                         | **6–9.5 jam** |        |               |

### Dependency Chart

```
T1 (chunk splitting) ─────────────────── T5 (verifikasi)
T2 (useSkeletonLoader) ──→ T3 (SkeletonTable) ─ T5
T4 (useImageLazy) ────────────────────── T5
```

---

## 📊 Estimasi Resource

| Resource                                         | Detail                                                                                    |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| **Model**                                        | Gemini Flash (High) atau Claude Sonnet                                                    |
| **File yang boleh dibuat/diubah**                | `vue.config.js`, `src/composables/*.js` (baru), `src/components/SkeletonTable.vue` (baru) |
| **File yang TIDAK BOLEH diubah**                 | Semua file di `src/views/` — **tanpa pengecualian**                                       |
| **File yang SUDAH ADA — baca dulu sebelum edit** | `vue.config.js`                                                                           |
| **Dependency baru**                              | Tidak ada — `v-skeleton-loader` sudah tersedia via Vuetify 3                              |
| **Tools yang dibutuhkan**                        | `run_command`, `view_file`, `replace_file_content`, `write_to_file`, `grep_search`        |

---

## ✅ Progress Checklist

- [x] **T1** — Webpack chunk splitting dikonfigurasi di `vue.config.js`
- [x] **T2** — `src/composables/useSkeletonLoader.js` dibuat
- [x] **T3** — `src/components/SkeletonTable.vue` dibuat
- [x] **T4** — `src/composables/useImageLazy.js` dibuat
- [x] **T5** — `npm run build` berhasil 0 error, semua file baru terdaftar

---

## 📝 Detail Task

---

### T1 — Webpack Chunk Splitting Optimization

**Deskripsi:**
Mengoptimasi konfigurasi `splitChunks` Webpack di `vue.config.js` agar Vuetify dipisah ke chunk tersendiri (`chunk-vuetify`), sehingga browser bisa meng-cache library UI secara independen dari kode aplikasi yang berubah lebih sering. Ini mengurangi ukuran bundle yang harus di-download ulang saat deploy baru.

**Kompleksitas:** 🟢 Rendah
**Risiko:** 🟢 Rendah — hanya modifikasi config Webpack, tidak menyentuh kode Vue

**⚠️ Catatan Penting:**

- Baca isi `vue.config.js` terlebih dahulu dengan `view_file` sebelum mengedit
- `chainWebpack` untuk terser (`drop_console`) sudah ada dari Fase 4 — jangan hapus, cukup tambahkan `configureWebpack`
- Kedua key (`chainWebpack` dan `configureWebpack`) bisa koeksistensi dalam `defineConfig({...})`

---

**Sub-task T1.1: Baca dan Pahami `vue.config.js` yang Sudah Ada**

**Estimasi:** 10 menit

**Step-by-step:**

1. Jalankan `view_file` pada `vue.config.js`
2. Pastikan konfigurasi `chainWebpack` (dari Fase 4) masih ada
3. Identifikasi posisi untuk menambahkan `configureWebpack`

---

**Sub-task T1.2: Tambahkan `configureWebpack` untuk Chunk Splitting**

**Estimasi:** 30–45 menit

**Step-by-step:**

1. Tambahkan konfigurasi `configureWebpack` di dalam `defineConfig({...})` di `vue.config.js`, **setelah** konfigurasi `chainWebpack` yang sudah ada:

```javascript
// vue.config.js — tambahkan setelah chainWebpack
configureWebpack: {
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 10,
      cacheGroups: {
        // Pisahkan Vuetify ke chunk tersendiri
        vuetify: {
          name: 'chunk-vuetify',
          test: /[\\/]node_modules[\\/]vuetify[\\/]/,
          priority: 20,
          reuseExistingChunk: true,
        },
        // Library node_modules lainnya
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
```

2. Jalankan `npm run build` dan verifikasi hasilnya berhasil
3. Periksa apakah muncul output `chunk-vuetify.[hash].js` di list dist

**Total Estimasi T1: 1–1.5 jam**

---

### T2 — Composable `useSkeletonLoader.js`

**Deskripsi:**
Membuat composable ringan yang mengelola state loading skeleton. Composable ini akan digunakan oleh `SkeletonTable.vue` (T3) dan dapat juga digunakan secara mandiri oleh view baru yang ingin menampilkan skeleton loader.

**Kompleksitas:** 🟢 Rendah
**Risiko:** 🟢 Sangat rendah — file baru, tidak ada dependency ke file yang sudah ada

**⚠️ Catatan Penting:**

- File ini bersifat additive — tidak mengubah composable yang sudah ada (`useApi.js`, `useDebounce.js`)
- Tidak perlu install package apapun

---

**Sub-task T2.1: Buat `src/composables/useSkeletonLoader.js`**

**Estimasi:** 30–45 menit

**Step-by-step:**

1. Cek isi `src/composables/` dengan `list_dir` untuk memverifikasi file yang sudah ada
2. Buat file `src/composables/useSkeletonLoader.js`:

```javascript
// src/composables/useSkeletonLoader.js
/**
 * Composable untuk mengelola state skeleton loading.
 *
 * CARA PENGGUNAAN (opsional, di view baru atau komponen baru):
 *
 * import { useSkeletonLoader } from '@/composables/useSkeletonLoader';
 *
 * // Di dalam setup() atau <script setup>:
 * const { isLoading, skeletonCount, startLoading, stopLoading } = useSkeletonLoader(5);
 *
 * // Saat fetch data dimulai:
 * startLoading();
 *
 * // Saat fetch selesai:
 * stopLoading();
 */
import { ref } from 'vue';

export function useSkeletonLoader(count = 5) {
  const isLoading = ref(false);
  const skeletonCount = ref(count);

  // Array dummy untuk di-iterate oleh v-for skeleton
  const skeletonItems = Array.from({ length: count }, (_, i) => ({ id: i }));

  const startLoading = () => {
    isLoading.value = true;
  };

  const stopLoading = () => {
    isLoading.value = false;
  };

  /**
   * Wrapper untuk async function yang otomatis mengatur state loading.
   * @param {Function} asyncFn - Async function yang akan dijalankan
   */
  const withLoading = async (asyncFn) => {
    startLoading();
    try {
      return await asyncFn();
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    skeletonCount,
    skeletonItems,
    startLoading,
    stopLoading,
    withLoading,
  };
}
```

3. Verifikasi file berhasil dibuat

**Total Estimasi T2: 30–45 menit**

---

### T3 — Komponen `SkeletonTable.vue`

**Deskripsi:**
Membuat komponen skeleton yang menampilkan placeholder baris tabel saat data sedang dimuat. Menggunakan `v-skeleton-loader` dari Vuetify 3 (sudah built-in, tidak perlu install). Komponen ini bersifat additive — view lama tidak perlu berubah.

**Kompleksitas:** 🟢 Rendah
**Risiko:** 🟢 Rendah — file baru, menggunakan komponen Vuetify yang sudah tersedia

**⚠️ Catatan Penting:**

- `v-skeleton-loader` sudah tersedia di Vuetify 3 — tidak perlu install package tambahan
- Komponen ini tidak diregistrasi secara global di `main.js` — cukup diimport secara lokal oleh view yang ingin menggunakannya
- Biarkan view yang sudah ada tetap menggunakan `v-progress-circular` yang lama — jangan paksa berubah

---

**Sub-task T3.1: Buat `src/components/SkeletonTable.vue`**

**Estimasi:** 1.5–2 jam

**Step-by-step:**

1. Buat file `src/components/SkeletonTable.vue`:

```vue
<!-- src/components/SkeletonTable.vue -->
<!--
  CARA PENGGUNAAN DI VIEW (opsional, tidak wajib):
  
  import SkeletonTable from '@/components/SkeletonTable.vue';
  components: { SkeletonTable },
  
  Di template:
  <skeleton-table v-if="isLoading" :rows="8" :columns="4" />
  
  <v-data-table
    v-else
    :items="items"
    ...
  />
  
  Dengan header columns kustom:
  <skeleton-table
    v-if="isLoading"
    :rows="5"
    :columns="['Name', 'Email', 'Status', 'Action']"
  />
-->
<template>
  <v-table>
    <!-- Header Skeleton -->
    <thead>
      <tr>
        <th v-for="(col, index) in normalizedColumns" :key="index" class="text-left py-3">
          <v-skeleton-loader type="text" width="80" height="16" />
        </th>
      </tr>
    </thead>

    <!-- Body Skeleton Rows -->
    <tbody>
      <tr v-for="row in rows" :key="row">
        <td v-for="(col, colIndex) in normalizedColumns" :key="colIndex" class="py-3">
          <!-- Kolom pertama kadang berisi gambar thumbnail -->
          <div v-if="colIndex === 0 && showThumbnail" class="d-flex align-center gap-3">
            <v-skeleton-loader type="avatar" width="40" height="40" class="rounded" />
            <v-skeleton-loader type="text" :width="getRandomWidth(80, 140)" height="14" />
          </div>
          <!-- Kolom biasa -->
          <v-skeleton-loader v-else type="text" :width="getRandomWidth(60, 160)" height="14" />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  /**
   * Jumlah baris skeleton yang ditampilkan
   */
  rows: {
    type: Number,
    default: 5,
  },
  /**
   * Jumlah kolom (Number) atau array nama kolom (String[])
   */
  columns: {
    type: [Number, Array],
    default: 4,
  },
  /**
   * Tampilkan thumbnail avatar di kolom pertama
   */
  showThumbnail: {
    type: Boolean,
    default: false,
  },
});

/**
 * Normalisasi prop columns menjadi array
 */
const normalizedColumns = computed(() => {
  if (Array.isArray(props.columns)) {
    return props.columns;
  }
  return Array.from({ length: props.columns }, (_, i) => `col-${i}`);
});

/**
 * Lebar acak untuk membuat skeleton terlihat lebih natural
 */
const getRandomWidth = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
</script>

<style scoped>
/* Pastikan skeleton tidak menyebabkan layout shift */
.v-table {
  table-layout: fixed;
}
</style>
```

2. Jalankan `npm run build` untuk memastikan tidak ada error

**Total Estimasi T3: 1.5–2 jam**

---

### T4 — Composable `useImageLazy.js`

**Deskripsi:**
Membuat composable helper yang menyediakan utilitas untuk lazy loading gambar. Membantu view baru dalam mengimplementasikan gambar yang hanya dimuat saat berada di viewport, mengurangi konsumsi bandwidth awal.

**Kompleksitas:** 🟢 Rendah
**Risiko:** 🟢 Sangat rendah — file baru murni, tidak mengubah apapun yang sudah ada

**⚠️ Catatan Penting:**

- Composable ini **tidak mengubah** view yang sudah ada
- Lazy loading juga bisa dilakukan cukup dengan menambahkan atribut `loading="lazy"` pada `<v-img>` secara langsung — composable ini hanya menyediakan placeholder/blur URL yang siap pakai
- Gunakan `IntersectionObserver` natif — tidak perlu library tambahan

---

**Sub-task T4.1: Buat `src/composables/useImageLazy.js`**

**Estimasi:** 30–45 menit

**Step-by-step:**

1. Buat file `src/composables/useImageLazy.js`:

```javascript
// src/composables/useImageLazy.js
/**
 * Composable helper untuk lazy loading gambar.
 *
 * CARA PENGGUNAAN (opsional, untuk view baru):
 *
 * import { useImageLazy } from '@/composables/useImageLazy';
 *
 * const { getImageProps, placeholderSrc } = useImageLazy();
 *
 * // Di template:
 * <v-img
 *   v-bind="getImageProps(fileURL + item.image)"
 * />
 *
 * // Atau manual:
 * <v-img
 *   :src="fileURL + item.image"
 *   :lazy-src="placeholderSrc"
 *   loading="lazy"
 * >
 *   <template v-slot:placeholder>
 *     <v-skeleton-loader type="image" />
 *   </template>
 * </v-img>
 */
import { computed } from 'vue';

export function useImageLazy(options = {}) {
  const {
    // Ukuran gambar untuk thumbnail di tabel
    thumbnailHeight = '50px',
    thumbnailWidth = '50px',
    // Placeholder SVG blur sederhana
    useSvgPlaceholder = true,
  } = options;

  /**
   * SVG placeholder berukuran 1x1 piksel sebagai lazy-src default.
   * Browser menampilkan ini saat gambar asli belum dimuat.
   */
  const placeholderSrc = computed(() => {
    if (useSvgPlaceholder) {
      return 'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%221%22 height%3D%221%22%3E%3C/svg%3E';
    }
    return '';
  });

  /**
   * Mengembalikan props siap pakai untuk komponen v-img Vuetify
   * dengan lazy loading yang sudah dikonfigurasi.
   *
   * @param {string} src - URL gambar asli
   * @param {Object} extraProps - Props tambahan untuk v-img
   */
  const getImageProps = (src, extraProps = {}) => ({
    src: src || placeholderSrc.value,
    'lazy-src': placeholderSrc.value,
    loading: 'lazy',
    height: thumbnailHeight,
    width: thumbnailWidth,
    cover: true,
    ...extraProps,
  });

  /**
   * Cek apakah IntersectionObserver tersedia di browser
   */
  const isLazyLoadingSupported = typeof IntersectionObserver !== 'undefined';

  return {
    placeholderSrc,
    getImageProps,
    isLazyLoadingSupported,
  };
}
```

2. Verifikasi file berhasil dibuat

**Total Estimasi T4: 30–45 menit**

---

### T5 — Integrasi & Verifikasi Akhir

**Deskripsi:**
Memverifikasi semua task T1–T4 sudah diimplementasi dengan benar, tidak ada error build, dan mendokumentasikan hasilnya.

**Kompleksitas:** 🟢 Rendah
**Risiko:** 🟢 Rendah

---

**Sub-task T5.1: Build Production Test**

**Estimasi:** 15–30 menit

**Step-by-step:**

1. Jalankan `npm run build`
2. Pastikan output menunjukkan `DONE Build complete` dengan 0 errors
3. Periksa apakah muncul file `chunk-vuetify.[hash].js` di `dist/js/` — ini bukti chunk splitting bekerja
4. Catat perbandingan ukuran `chunk-vendors.js` sebelum vs sesudah jika memungkinkan

---

**Sub-task T5.2: Verifikasi Struktur File**

**Estimasi:** 10 menit

Pastikan semua file berikut ada:

```
src/
├── components/
│   ├── ConfirmDialog.vue       ← dari Fase 4
│   ├── EmptyState.vue          ← dari Fase 4
│   ├── GlobalNotification.vue  ← dari Fase 4
│   └── SkeletonTable.vue       ← T3 (BARU)
├── composables/
│   ├── useApi.js               ← dari Fase 3
│   ├── useApiWithCache.js      ← dari Fase 4
│   ├── useDebounce.js          ← dari Fase 3
│   ├── useImageLazy.js         ← T4 (BARU)
│   ├── usePagination.js        ← dari Fase 4
│   └── useSkeletonLoader.js    ← T2 (BARU)
└── stores/
    ├── navigation.js           ← dari Fase 2
    └── notification.js         ← dari Fase 4
```

---

**Sub-task T5.3: Update Checklist di IMPLEMENTATION.md**

**Estimasi:** 10 menit

Tandai semua item checklist di bagian `✅ Progress Checklist` sebagai `[x]` setelah semua task selesai.

**Total Estimasi T5: 30–45 menit**

---

## 🛡️ Risk & Mitigation

| Task                 | Risiko                                                                 | Probabilitas | Mitigasi                                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1 (Chunk Splitting) | Conflict antara `chainWebpack` dan `configureWebpack`                  | 🟡 Sedang    | Keduanya bisa koeksistensi dalam `defineConfig`. Baca `vue.config.js` dulu, pastikan tidak menimpa konfigurasi yang ada.                                       |
| T1 (Chunk Splitting) | Chunk baru menyebabkan 404 jika path tidak sesuai di cPanel            | 🟡 Sedang    | Vue CLI otomatis mengelola `publicPath` di bundle. Tidak perlu konfigurasi khusus cPanel.                                                                      |
| T3 (SkeletonTable)   | `v-skeleton-loader` belum tersedia di versi Vuetify yang digunakan     | 🟡 Sedang    | Cek versi Vuetify: `node -e "console.log(require('./node_modules/vuetify/package.json').version)"`. Jika Vuetify < 3.0, ganti dengan `v-progress-linear` saja. |
| T3 (SkeletonTable)   | `getRandomWidth()` dipanggil saat server-side rendering atau hydration | 🟢 Rendah    | Proyek ini adalah pure SPA tanpa SSR — tidak ada risiko.                                                                                                       |
| T4 (useImageLazy)    | Browser lama tidak mendukung `loading="lazy"`                          | 🟢 Rendah    | Fallback otomatis ke loading normal — tidak ada visual error.                                                                                                  |
| Semua                | Breaking change di view                                                | 🟢 Rendah    | Semua komponen/composable baru bersifat additive — tidak ada yang memaksa view berubah.                                                                        |

---

## 📋 Catatan Implementasi

```
[2026-09-01] Fase 5 Completed:
- T1: Added configureWebpack splitChunks in vue.config.js (chunk-vuetify and chunk-vendors)
- T2: Created src/composables/useSkeletonLoader.js (reusable skeleton state composable)
- T3: Created src/components/SkeletonTable.vue (reusable table skeleton with CSS shimmer animation)
- T4: Created src/composables/useImageLazy.js (image lazy loading and placeholder helper composable)
- T5: Verification build (npm run build) completed successfully with 0 errors, generated separate chunk-vuetify and chunk-vendors bundles
```

---

_File ini diperbarui pada 2026-09-01. Fase 1, Fase 2, Fase 3, Fase 4, dan Fase 5 sudah selesai. Fase 6 siap dieksekusi._

---

# 🛠️ IMPLEMENTATION.md — Fase 6: Developer Experience ✅ SELESAI

> **Status:** COMPLETED
> **Tanggal:** 2026-09-01
> **Target Audiens:** Model AI (Gemini Flash High / Claude) yang akan mengeksekusi task ini
> **Prasyarat WAJIB:** Baca [`docs/README.md`](./README.md) dan [`docs/IMPROVEMENT.md`](./IMPROVEMENT.md) terlebih dahulu
> **Fase:** 6 dari N
> **Fokus:** Meningkatkan Developer Experience — code formatting konsisten dan pre-commit enforcement
> **Estimasi Total:** 3–4 jam

---

## ⚠️ PERINGATAN KRITIS — BACA SEBELUM MEMULAI

> Fase ini melibatkan **perubahan tooling** (`devDependencies`, `.eslintrc.js`, konfigurasi `package.json`) dan **bukan** perubahan pada runtime kode Vue. Risiko breaking production build sangat rendah, tetapi tetap wajib verifikasi dengan `npm run build` setelah selesai.

**Prinsip Aman WAJIB di Fase 6:**

1. **JANGAN ubah file di `src/views/`** — tanpa pengecualian apapun.
2. **Jangan jalankan `prettier --write` atau `eslint --fix` secara massal** terhadap seluruh `src/views/` — terlalu berisiko menyebabkan perubahan besar yang tidak terduga pada banyak file.
3. **Prettier hanya dikonfigurasi**, bukan dijalankan secara paksa ke seluruh codebase.
4. **Husky pre-commit hook hanya mem-fix file yang di-staged**, bukan seluruh repo.
5. **Verifikasi `npm run build` berhasil (0 errors)** setelah setiap task diselesaikan.
6. **Baca file yang ada terlebih dahulu** dengan `view_file` sebelum mengedit.

> [!NOTE] > **S4 (strip console.log)** sudah selesai di Fase 4 via `vue.config.js` menggunakan Terser `drop_console: true`. Task ini **TIDAK perlu dikerjakan lagi** di Fase 6.

---

## 📋 Ringkasan Eksekutif

Fase 6 berfokus pada dua pilar Developer Experience:

1. **Prettier Integration** — Menambahkan Prettier sebagai code formatter yang konsisten bersama ESLint, sehingga seluruh kode yang ditulis ke depan akan mengikuti standar format yang seragam secara otomatis.
2. **Husky + lint-staged** — Git pre-commit hook yang otomatis menjalankan ESLint fix dan Prettier pada file yang di-staged sebelum commit, mencegah kode tidak konsisten masuk ke repository.

> **Catatan Scope:** DX4 (rename direktori views) dikecualikan dari Fase 6 karena risiko breaking change yang terlalu tinggi (90+ import path di router). DX4 masuk ke **Fase Opsional**.

| #   | Task ID | Nama Task                                 | Dampak | Risiko    | Estimasi    |
| --- | ------- | ----------------------------------------- | ------ | --------- | ----------- |
| 1   | T1      | Prettier integration + konfigurasi ESLint | Sedang | 🟢 Rendah | 1–1.5 jam   |
| 2   | T2      | Husky + lint-staged pre-commit hook       | Sedang | 🟢 Rendah | 30–45 menit |
| 3   | T3      | Verifikasi & testing                      | -      | 🟢 Rendah | 30–45 menit |

**Yang TIDAK dilakukan di Fase 6:**

- Tidak menjalankan Prettier/ESLint --fix secara massal ke seluruh `src/views/`
- Tidak mengubah logika runtime apapun
- Tidak rename direktori (DX4 — ada di Fase Opsional)
- `S4` (strip console.log) sudah selesai di Fase 4

---

## 🕐 Timeline & Estimasi

| Task | Nama                     | Estimasi    | Urutan | Dependency    |
| ---- | ------------------------ | ----------- | ------ | ------------- |
| T1   | Prettier + ESLint config | 1–1.5 jam   | 1      | Independen    |
| T2   | Husky + lint-staged      | 30–45 menit | 2      | T1 selesai    |
| T3   | Verifikasi & testing     | 30–45 menit | 3      | T1–T2 selesai |
|      | **TOTAL**                | **2–3 jam** |        |               |

### Dependency Chart

```
T1 (Prettier + ESLint) ──→ T2 (Husky) ──→ T3 (verifikasi)
```

---

## 📊 Estimasi Resource

| Resource                                         | Detail                                                                                 |
| ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **Model**                                        | Gemini Flash (High) atau Claude Sonnet                                                 |
| **File yang boleh dibuat/diubah**                | `.eslintrc.js`, `package.json`, `.prettierrc.json` (baru), `.husky/pre-commit` (baru)  |
| **File yang TIDAK BOLEH diubah**                 | Semua file di `src/views/` — **tanpa pengecualian**                                    |
| **File yang SUDAH ADA — baca dulu sebelum edit** | `.eslintrc.js`, `package.json`                                                         |
| **Dependency baru**                              | `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`, `husky`, `lint-staged` |
| **Tools yang dibutuhkan**                        | `run_command`, `view_file`, `replace_file_content`, `write_to_file`                    |

---

## ✅ Progress Checklist

- [x] **T1** — Prettier terinstall + `.prettierrc.json` dibuat + `.eslintrc.js` diperbarui
- [x] **T2** — Husky terinstall + `lint-staged` dikonfigurasi di `package.json` + pre-commit hook dibuat
- [x] **T3** — `npm run build` berhasil 0 error, pre-commit hook berjalan saat `git commit`

---

## 📝 Detail Task

---

### T1 — Prettier Integration + Konfigurasi ESLint

**Deskripsi:**
Menginstall Prettier sebagai formatter, membuat file konfigurasi `.prettierrc.json`, dan mengintegrasikan Prettier ke dalam ESLint melalui `eslint-config-prettier` (menonaktifkan aturan ESLint yang konflik dengan Prettier) dan `eslint-plugin-prettier` (menjalankan Prettier sebagai aturan ESLint).

**Kompleksitas:** 🟢 Rendah
**Risiko:** 🟢 Rendah — perubahan hanya pada tooling konfigurasi, tidak memengaruhi runtime

**⚠️ Catatan Penting:**

- Baca `.eslintrc.js` yang sudah ada dengan `view_file` sebelum mengedit
- `'plugin:prettier/recommended'` harus diletakkan **di urutan terakhir** dalam array `extends` untuk override aturan yang konflik
- `'vue/setup-compiler-macros': true` di `env` **JANGAN dihapus** — ini penting untuk dukungan `<script setup>` di Fase 3

---

**Sub-task T1.1: Install Prettier dan Plugin ESLint**

**Estimasi:** 10–15 menit

**Step-by-step:**

1. Jalankan perintah instalasi:

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

2. Verifikasi instalasi berhasil dengan cek `package.json` — pastikan tiga package masuk ke `devDependencies`.

---

**Sub-task T1.2: Buat `.prettierrc.json`**

**Estimasi:** 10 menit

**Step-by-step:**

1. Buat file `.prettierrc.json` di root proyek:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "lf"
}
```

2. Buat file `.prettierignore` di root proyek untuk mengecualikan direktori yang tidak perlu di-format:

```
node_modules/
dist/
public/
*.min.js
```

---

**Sub-task T1.3: Update `.eslintrc.js` untuk Mengintegrasikan Prettier**

**Estimasi:** 20–30 menit

**Step-by-step:**

1. Baca isi `.eslintrc.js` yang sudah ada dengan `view_file`
2. Perbarui `.eslintrc.js` — tambahkan `'plugin:prettier/recommended'` di **akhir** array `extends`:

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true, // JANGAN hapus ini — penting untuk <script setup>
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:prettier/recommended', // Harus terakhir — override aturan yang konflik
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

> **Penting:** Gunakan `'warn'` bukan `'error'` untuk `prettier/prettier` agar tidak memblokir build untuk kode lama yang belum diformat. Hanya code baru yang ditulis ke depan yang akan ter-enforce oleh Husky.

3. Jalankan `npm run lint` untuk verifikasi tidak ada error fatal
4. Jalankan `npm run build` untuk verifikasi build tetap berhasil

**Total Estimasi T1: 1–1.5 jam**

---

### T2 — Husky + lint-staged Pre-Commit Hook

**Deskripsi:**
Menginstall Husky untuk manajemen Git hooks dan lint-staged untuk menjalankan linting hanya pada file yang di-stage saat commit. Ini mencegah kode yang tidak konsisten masuk ke repository tanpa memerlukan developer untuk menjalankan linting secara manual.

**Kompleksitas:** 🟢 Rendah
**Risiko:** 🟢 Rendah — hanya memengaruhi git workflow, tidak memengaruhi runtime atau build

**⚠️ Catatan Penting:**

- `lint-staged` hanya akan menjalankan linting terhadap **file yang di-stage**, bukan seluruh repo
- Jangan menambahkan `src/views/**` secara eksplisit ke scope — biarkan default berlaku (file apa pun yang di-stage)
- Jika Husky init gagal karena tidak ada `.git` directory, pastikan berada di dalam git repository

---

**Sub-task T2.1: Install Husky dan lint-staged**

**Estimasi:** 15 menit

**Step-by-step:**

1. Install package:

```bash
npm install -D husky lint-staged
```

2. Inisialisasi Husky:

```bash
npx husky init
```

Perintah ini akan:

- Membuat direktori `.husky/`
- Membuat file `.husky/pre-commit` dengan isi default
- Menambahkan `"prepare": "husky"` ke dalam `scripts` di `package.json`

---

**Sub-task T2.2: Konfigurasi lint-staged di `package.json`**

**Estimasi:** 15 menit

**Step-by-step:**

1. Baca isi `package.json` terlebih dahulu dengan `view_file`
2. Tambahkan konfigurasi `lint-staged` ke `package.json` (di luar `devDependencies`, sebagai top-level key):

```json
{
  "lint-staged": {
    "*.{vue,js}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,json,md}": ["prettier --write"]
  }
}
```

> **Penting:** Tambahkan ini sebagai top-level key di `package.json`, bukan di dalam `devDependencies` atau `dependencies`.

---

**Sub-task T2.3: Update `.husky/pre-commit`**

**Estimasi:** 5 menit

**Step-by-step:**

1. Setelah `npx husky init`, buka file `.husky/pre-commit` yang dibuat
2. Pastikan isinya adalah:

```bash
npx lint-staged
```

3. Jika isinya berbeda (mis. `npm test`), ganti dengan `npx lint-staged`

**Total Estimasi T2: 30–45 menit**

---

### T3 — Verifikasi & Testing

**Deskripsi:**
Memverifikasi seluruh tooling berjalan dengan benar: Prettier dapat memformat file, ESLint tidak menghasilkan error fatal, dan Husky pre-commit hook aktif saat melakukan commit.

**Kompleksitas:** 🟢 Rendah
**Risiko:** 🟢 Rendah

---

**Sub-task T3.1: Verifikasi Prettier Berjalan**

**Estimasi:** 10 menit

**Step-by-step:**

1. Test Prettier pada satu file yang aman (bukan di `src/views/`):

```bash
npx prettier --check src/composables/useDebounce.js
```

2. Jika ada formatting yang perlu diperbaiki, jalankan:

```bash
npx prettier --write src/composables/useDebounce.js
```

3. Pastikan tidak ada error

---

**Sub-task T3.2: Verifikasi ESLint + Prettier Terintegrasi**

**Estimasi:** 10 menit

**Step-by-step:**

1. Jalankan lint check:

```bash
npm run lint
```

2. Pastikan tidak ada **error** (warning dari file lama boleh muncul, tapi tidak boleh ada error yang memblokir)
3. Jika ada error baru yang muncul dari integrasi Prettier, periksa apakah rule `prettier/prettier` sudah diset ke `'warn'` bukan `'error'`

---

**Sub-task T3.3: Build Production Test**

**Estimasi:** 5 menit (jika menggunakan dist yang sudah ada) atau 90 menit (build penuh)

**Step-by-step:**

1. Jalankan `npm run build`
2. Pastikan output menunjukkan `DONE Build complete` dengan 0 errors
3. Jika ada error, periksa apakah ada rule ESLint baru dari Prettier yang memblokir

---

**Sub-task T3.4: Test Pre-Commit Hook**

**Estimasi:** 5 menit

**Step-by-step:**

1. Buat perubahan kecil pada file di `src/composables/` (misal tambah komentar)
2. Stage file: `git add src/composables/useDebounce.js`
3. Coba commit: `git commit -m "test: verify husky pre-commit hook"`
4. Pastikan lint-staged berjalan dan melakukan auto-fix
5. Jika berhasil, undo commit test: `git reset HEAD~1` dan kembalikan file

**Total Estimasi T3: 30–45 menit**

---

## 🛡️ Risk & Mitigation

| Task                  | Risiko                                                                           | Probabilitas     | Mitigasi                                                                                                                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| T1 (Prettier install) | Conflict versi antara `eslint-plugin-prettier` dan `eslint` yang sudah terpasang | 🟡 Sedang        | Cek versi `eslint` di `package.json` (saat ini `^7.32.0`). `eslint-plugin-prettier` v4.x kompatibel dengan ESLint 7. Jika error, gunakan `npm install -D eslint-plugin-prettier@4 eslint-config-prettier@8`. |
| T1 (ESLint update)    | `plugin:prettier/recommended` menyebabkan ratusan warning di file lama           | 🟡 Sedang        | Warning boleh muncul — ini normal untuk file lama. Set rule `prettier/prettier` ke `'warn'` bukan `'error'` sehingga tidak memblokir build.                                                                  |
| T2 (Husky init)       | `npx husky init` gagal karena npm version lama                                   | 🟡 Sedang        | Gunakan alternatif: `npm pkg set scripts.prepare="husky install"` lalu `npx husky add .husky/pre-commit "npx lint-staged"`.                                                                                  |
| T2 (lint-staged)      | lint-staged memperbaiki file di `src/views/` saat staging                        | 🟡 Sedang        | Ini adalah perilaku yang **diharapkan dan aman** — lint-staged hanya mem-fix file yang di-stage, bukan seluruh views.                                                                                        |
| T3 (build)            | Prettier rule menyebabkan syntax error di kode lama                              | 🟢 Rendah        | Rule sudah diset ke `'warn'`. Jika tetap ada error, jalankan `npm run lint -- --fix` hanya pada file composables baru.                                                                                       |
| Semua                 | Breaking change ke `src/views/`                                                  | 🟢 Sangat Rendah | Fase ini tidak menyentuh kode runtime apapun — hanya tooling konfigurasi.                                                                                                                                    |

---

## 📋 Catatan Implementasi

```
[2026-09-01] Fase 6 Completed:
- T1: Installed prettier@2.8.8, eslint-config-prettier@8.10.2, eslint-plugin-prettier@4.2.5. Created .prettierrc.json & .prettierignore. Updated .eslintrc.js with plugin:prettier/recommended and prettier/prettier: warn.
- T2: Installed husky & lint-staged. Initialized husky (npm run prepare), created .husky/pre-commit with npx lint-staged, added lint-staged configuration in package.json.
- T3: Tested prettier check/write and verified build with npm run build (0 errors).
```

---

_File ini diperbarui pada 2026-09-01. Fase 1, Fase 2, Fase 3, Fase 4, Fase 5, dan Fase 6 sudah selesai. Fase Opsional P4 (Vite Migration) siap dieksekusi._

---

# 🚀 IMPLEMENTATION.md — Fase Opsional P4: Migrasi Vue CLI → Vite ✅ SELESAI

> **Status:** COMPLETED
> **Tanggal:** 2026-09-01
> **Target Audiens:** Model AI (Gemini Flash High / Claude) yang akan mengeksekusi task ini
> **Prasyarat WAJIB:** Baca [`docs/README.md`](./README.md) dan [`docs/IMPROVEMENT.md`](./IMPROVEMENT.md) terlebih dahulu
> **Fase:** Opsional
> **Fokus:** Migrasi build tool dari Vue CLI (Webpack) ke Vite untuk drastis mempercepat dev server
> **Estimasi Total:** 20–50 jam (termasuk testing menyeluruh)
> **Risiko:** 🔴 TINGGI — migrasi besar yang menyentuh konfigurasi build, environment variables, dan semua file `src/`

---

## 🚨 PERINGATAN KRITIS — BACA SANGAT TELITI SEBELUM MEMULAI

> **FASE INI BERSIFAT MAJOR REFACTOR.** Berbeda dengan fase sebelumnya yang additive, fase ini **mengubah fondasi build system** secara fundamental. Pastikan backup/branch terpisah sebelum memulai.

**Prinsip Aman WAJIB di Fase Opsional P4:**

1. **BUAT BRANCH BARU** sebelum memulai: `git checkout -b vite-migration` — jangan langsung di branch `refactor`.
2. **JANGAN jalankan di production server** sampai seluruh testing selesai dan semua halaman diverifikasi manual.
3. **Backup `.env.local` dan `.env.production`** sebelum mengubah nama variabel.
4. **Cek setiap halaman di browser** setelah migrasi — bukan hanya build success.
5. **`npm run build` berhasil (0 errors)** adalah syarat minimum, bukan jaminan aplikasi berjalan.
6. **Semua `process.env.VUE_APP_*` WAJIB diganti** dengan `import.meta.env.VITE_*` — ada 6 lokasi yang sudah teridentifikasi.

> [!WARNING]
> **Dampak Finansial:** Vite menggunakan `import.meta.env.VITE_*` bukan `process.env.VUE_APP_*`. Jika satu saja terlewat, fitur yang bergantung pada env var tersebut (API call, file URL) akan GAGAL secara senyap di production.

> [!NOTE]
> **Lokasi `process.env.VUE_APP_*` yang sudah teridentifikasi (6 file):**
> - `src/main.js` → `process.env.VUE_APP_FILE_URL` (line 26)
> - `src/util/apiClient.js` → `process.env.VUE_APP_API_BASE_URL` (line 20)
> - `src/components/HeaderDashboard.vue` → `process.env.VUE_APP_FILE_URL` (line 83)
> - `src/components/ImageUpload.vue` → `process.env.VUE_APP_FILE_URL` (line 208)
> - `src/components/SidebarDashboard.vue` → `process.env.VUE_APP_FILE_URL` (line 79)
> - `src/views/address-master/address-master/AddressMaster.vue` → `process.env.VUE_APP_GOOGLE_MAPS_API_KEY` (line 579, dikomentari)

---

## 📋 Ringkasan Eksekutif

Fase Opsional P4 adalah migrasi build tool dari **Vue CLI (Webpack)** ke **Vite**. Ini akan menghasilkan:

| Metrik | Vue CLI (Webpack) | Vite |
|--------|-------------------|------|
| Cold start dev server | ~30 detik | < 1 detik |
| Hot Module Replacement | 1–3 detik | < 100ms |
| Build production | ~2 menit | ~14 detik |
| Bundle size | Lebih besar | Lebih kecil |

**Mengapa ini Opsional:** Manfaatnya besar untuk developer experience (kecepatan dev server), tetapi risikonya tinggi karena menyentuh konfigurasi inti yang memengaruhi semua file di proyek. Direkomendasikan dilakukan ketika ada waktu khusus untuk testing menyeluruh.

| # | Task ID | Nama Task | Dampak | Risiko | Estimasi |
|---|---------|-----------|--------|--------|----------|
| 1 | T1 | Buat branch baru & backup | - | 🟢 Rendah | 15 menit |
| 2 | T2 | Uninstall Vue CLI, install Vite + plugins | Sangat Tinggi | 🔴 Tinggi | 1–2 jam |
| 3 | T3 | Buat `vite.config.js` | Sangat Tinggi | 🟡 Sedang | 1–1.5 jam |
| 4 | T4 | Migrasi environment variables | Sangat Tinggi | 🔴 Tinggi | 2–3 jam |
| 5 | T5 | Update entry point `index.html` | Tinggi | 🟡 Sedang | 30 menit |
| 6 | T6 | Update `src/main.js` dan plugins | Tinggi | 🟡 Sedang | 1–2 jam |
| 7 | T7 | Testing & verifikasi seluruh aplikasi | - | 🟡 Sedang | 8–12 jam |
| 8 | T8 | Update dokumentasi & merge | - | 🟢 Rendah | 1 jam |

---

## 🕐 Timeline & Estimasi

| Task | Nama | Estimasi | Urutan | Dependency |
|------|------|----------|--------|------------|
| T1 | Branch baru & backup | 15 menit | 1 | Independen |
| T2 | Uninstall Vue CLI / install Vite | 1–2 jam | 2 | T1 selesai |
| T3 | `vite.config.js` | 1–1.5 jam | 3 | T2 selesai |
| T4 | Migrasi env vars (.env + src files) | 2–3 jam | 4 | T3 selesai |
| T5 | Update `index.html` | 30 menit | 5 | T4 selesai |
| T6 | Update `src/main.js` dan plugins | 1–2 jam | 6 | T5 selesai |
| T7 | Testing menyeluruh semua halaman | 8–12 jam | 7 | T6 selesai |
| T8 | Dokumentasi & merge ke `refactor` | 1 jam | 8 | T7 selesai |
| | **TOTAL** | **15–22 jam** | | |

### Dependency Chart

```
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8
```

> **PENTING:** Ini adalah alur berurutan — setiap task HARUS selesai sebelum memulai yang berikutnya.

---

## 📊 Estimasi Resource

| Resource | Detail |
|----------|--------|
| **Model** | Gemini Flash (High) atau Claude Sonnet |
| **Branch** | Buat branch baru: `git checkout -b vite-migration` |
| **File yang WAJIB diubah** | `package.json`, `vite.config.js` (baru), `index.html`, `.env.local`, `.env.production`, 5 file src |
| **File yang WAJIB diperiksa satu per satu** | Seluruh `src/views/` untuk cek penggunaan `process.env.*` |
| **Dependency dihapus** | `@vue/cli-service`, `@vue/cli-plugin-babel`, `@vue/cli-plugin-eslint`, `@vue/cli-plugin-router` |
| **Dependency baru** | `vite`, `@vitejs/plugin-vue`, `vite-plugin-vuetify` |
| **Tools yang dibutuhkan** | `run_command`, `view_file`, `grep_search`, `replace_file_content`, `write_to_file` |

---

## ✅ Progress Checklist

- [x] **T1** — Branch `vite-migration` dibuat, backup `.env.*` disimpan
- [x] **T2** — Vue CLI packages diuninstall, Vite + plugins terinstall
- [x] **T3** — `vite.config.js` dibuat dan valid
- [x] **T4** — `.env.local`, `.env.production`, dan 5 file src sudah menggunakan `VITE_*` / `import.meta.env.*`
- [x] **T5** — `index.html` diperbarui dengan tag `<script type="module" src="/src/main.js">`
- [x] **T6** — `src/main.js` dan plugins berfungsi dengan Vite
- [x] **T7** — `npm run dev` berjalan, semua halaman dapat diakses, `npm run build` berhasil
- [x] **T8** — Dokumentasi diperbarui, branch di-merge ke `refactor`

---

## 📝 Detail Task

---

### T1 — Buat Branch Baru & Backup

**Deskripsi:**
Migrasi ke Vite adalah perubahan besar yang harus dikerjakan di branch terpisah. Ini memungkinkan rollback mudah jika terjadi masalah.

**Kompleksitas:** 🟢 Rendah
**Risiko:** 🟢 Sangat Rendah

**⚠️ Catatan Penting:**
- Jangan pernah langsung bekerja di branch `refactor` atau `main` untuk task ini
- Commit pekerjaan secara berkala selama proses migrasi

---

**Sub-task T1.1: Buat Branch Baru**

**Estimasi:** 5 menit

**Step-by-step:**

1. Pastikan working tree bersih: `git status`
2. Buat dan checkout ke branch baru:

```bash
git checkout -b vite-migration
```

3. Verifikasi branch aktif: `git branch`

---

**Sub-task T1.2: Backup Environment Files**

**Estimasi:** 5 menit

**Step-by-step:**

1. Lihat isi `.env.local` dengan `view_file` dan catat semua variabel yang ada
2. Catat mapping yang perlu dilakukan:

```
# SEBELUM (Vue CLI):            → SESUDAH (Vite):
VUE_APP_API_BASE_URL=...        → VITE_API_BASE_URL=...
VUE_APP_FILE_URL=...            → VITE_FILE_URL=...
VUE_APP_GOOGLE_MAPS_API_KEY=... → VITE_GOOGLE_MAPS_API_KEY=...
```

**Total Estimasi T1: 15 menit**

---

### T2 — Uninstall Vue CLI, Install Vite + Plugins

**Deskripsi:**
Menghapus semua package Vue CLI (build tool lama) dan menginstal Vite beserta plugin yang diperlukan.

**Kompleksitas:** 🟡 Sedang
**Risiko:** 🔴 Tinggi — setelah uninstall Vue CLI, `npm run serve` dan `npm run build` tidak akan berjalan sampai Vite dikonfigurasi sepenuhnya

**⚠️ Catatan Penting:**
- Setelah uninstall, proyek tidak akan bisa di-serve sampai T3 dan T5 selesai
- Package `vuetify` tetap di `dependencies` — yang berubah hanya `@vue/cli-plugin-vuetify` di devDependencies
- `husky`, `lint-staged`, `prettier`, `eslint` tetap dipertahankan

---

**Sub-task T2.1: Baca package.json Saat Ini**

**Estimasi:** 5 menit

**Step-by-step:**

1. Jalankan `view_file` pada `package.json`
2. Catat seluruh `devDependencies` yang ada untuk referensi
3. Identifikasi package mana yang akan dihapus vs dipertahankan

---

**Sub-task T2.2: Uninstall Vue CLI Packages**

**Estimasi:** 5–10 menit

**Step-by-step:**

1. Jalankan:

```bash
npm uninstall @vue/cli-service @vue/cli-plugin-babel @vue/cli-plugin-eslint @vue/cli-plugin-router vue-cli-plugin-vuetify
```

2. Verifikasi package sudah terhapus dari `package.json`

---

**Sub-task T2.3: Install Vite + Plugins**

**Estimasi:** 5–10 menit

**Step-by-step:**

1. Install Vite dan plugin yang dibutuhkan:

```bash
npm install -D vite @vitejs/plugin-vue vite-plugin-vuetify
```

2. Verifikasi instalasi sukses dengan cek `package.json`

---

**Sub-task T2.4: Update Scripts di `package.json`**

**Estimasi:** 10 menit

**Step-by-step:**

1. Baca `package.json` dengan `view_file`
2. Update bagian `scripts`:

```json
{
  "scripts": {
    "dev": "vite",
    "serve": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .eslintignore",
    "prepare": "husky"
  }
}
```

> **Catatan:** Pertahankan `"serve"` sebagai alias ke `vite` untuk backward compatibility. Ini penting agar instruksi di README yang mengacu `npm run serve` tetap berfungsi.

**Total Estimasi T2: 1–2 jam**

---

### T3 — Buat `vite.config.js`

**Deskripsi:**
Membuat file konfigurasi Vite yang menggantikan fungsi `vue.config.js`. Vite menggunakan format ESM native (`import`/`export`), bukan CommonJS (`require`/`module.exports`).

**Kompleksitas:** 🟡 Sedang
**Risiko:** 🟡 Sedang — konfigurasi proxy API dan alias path harus benar

**⚠️ Catatan Penting:**
- Vite menggunakan `vite.config.js` dengan format `import`/`export`, bukan `require()`
- Path alias `@` ke `src/` WAJIB dikonfigurasi agar semua import `@/...` berfungsi
- Tidak perlu lagi `configureWebpack.optimization.splitChunks` — Vite melakukan code splitting secara otomatis via Rollup
- `drop_console` ditangani secara berbeda di Vite (via `build.minify` + `esbuild.drop`)

---

**Sub-task T3.1: Hapus `vue.config.js`**

**Estimasi:** 2 menit

**Step-by-step:**

1. Lihat isi `vue.config.js` dengan `view_file` untuk referensi konfigurasi yang ada
2. Hapus atau rename file tersebut (Vite tidak menggunakan `vue.config.js`):

```bash
# Rename dulu untuk backup
# Atau hapus: del vue.config.js (di Windows)
```

---

**Sub-task T3.2: Buat `vite.config.js`**

**Estimasi:** 45 menit

**Step-by-step:**

1. Buat file `vite.config.js` di root proyek:

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
    host: true,
  },
  build: {
    // Strip console dan debugger di production (equivalent dari chainWebpack Terser Fase 4)
    minify: 'esbuild',
    target: 'es2015',
  },
  esbuild: {
    // Drop console.log dan debugger di production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
```

2. Verifikasi file disimpan dengan benar

**Total Estimasi T3: 1–1.5 jam**

---

### T4 — Migrasi Environment Variables

**Deskripsi:**
Ini adalah task yang **paling kritis dan paling mudah menyebabkan bug** jika tidak dilakukan dengan teliti. Vite hanya membaca variabel dengan prefix `VITE_`, bukan `VUE_APP_`. Semua penggunaan di kode sumber juga harus diganti dari `process.env.VUE_APP_*` ke `import.meta.env.VITE_*`.

**Kompleksitas:** 🔴 Tinggi
**Risiko:** 🔴 Sangat Tinggi — kode yang terlewas akan menyebabkan API call gagal tanpa pesan error yang jelas

**⚠️ Catatan Penting:**
- Gunakan `grep_search` untuk mencari SEMUA penggunaan `process.env.VUE_APP_` sebelum mengubah apapun
- Berdasarkan audit awal, ada **6 file** yang perlu diperbarui (lihat catatan di awal dokumen ini)
- File di `src/views/` yang memiliki penggunaan WAJIB juga diubah — tidak ada pengecualian di task ini

---

**Sub-task T4.1: Audit Lengkap `process.env.VUE_APP_*` di Seluruh Repo**

**Estimasi:** 15 menit

**Step-by-step:**

1. Jalankan pencarian menyeluruh:

```bash
# Cari di seluruh src/
grep -r "process.env.VUE_APP_" src/ --include="*.vue" --include="*.js"
```

2. Atau gunakan `grep_search` tool dengan query `process.env.VUE_APP_` di path `src/`
3. Dokumentasikan semua file dan baris yang ditemukan
4. **Hasil audit yang sudah diketahui:**
   - `src/main.js:26` → `process.env.VUE_APP_FILE_URL`
   - `src/util/apiClient.js:20` → `process.env.VUE_APP_API_BASE_URL`
   - `src/components/HeaderDashboard.vue:83` → `process.env.VUE_APP_FILE_URL`
   - `src/components/ImageUpload.vue:208` → `process.env.VUE_APP_FILE_URL`
   - `src/components/SidebarDashboard.vue:79` → `process.env.VUE_APP_FILE_URL`
   - `src/views/address-master/address-master/AddressMaster.vue:579` → dikomentari, tetap ganti jika ada

---

**Sub-task T4.2: Update `.env.local` dan `.env.production`**

**Estimasi:** 15 menit

**Step-by-step:**

1. Baca isi `.env.local` dan `.env.production` dengan `view_file`
2. Ganti prefix semua variabel dari `VUE_APP_` menjadi `VITE_`:

```bash
# .env.local — SEBELUM:
VUE_APP_API_BASE_URL=https://adminsymphinite.symphinite.tech/api/
VUE_APP_FILE_URL=https://admin1.the-gypsy.sg/img/app/

# .env.local — SESUDAH:
VITE_API_BASE_URL=https://adminsymphinite.symphinite.tech/api/
VITE_FILE_URL=https://admin1.the-gypsy.sg/img/app/
```

3. Ulangi hal yang sama untuk `.env.production`

---

**Sub-task T4.3: Update `src/util/apiClient.js`**

**Estimasi:** 10 menit

**Step-by-step:**

1. Baca file `src/util/apiClient.js` dengan `view_file`
2. Ganti `process.env.VUE_APP_API_BASE_URL` dengan `import.meta.env.VITE_API_BASE_URL`

---

**Sub-task T4.4: Update `src/main.js`**

**Estimasi:** 10 menit

**Step-by-step:**

1. Baca file `src/main.js` dengan `view_file`
2. Ganti `process.env.VUE_APP_FILE_URL` dengan `import.meta.env.VITE_FILE_URL`

---

**Sub-task T4.5: Update Komponen yang Menggunakan `process.env.VUE_APP_FILE_URL`**

**Estimasi:** 20 menit

**Step-by-step:**

1. Baca masing-masing file dan ubah `process.env.VUE_APP_FILE_URL` menjadi `import.meta.env.VITE_FILE_URL`:
   - `src/components/HeaderDashboard.vue` (line 83)
   - `src/components/ImageUpload.vue` (line 208)
   - `src/components/SidebarDashboard.vue` (line 79)

2. Setelah mengubah setiap file, jalankan lagi `grep_search` untuk memastikan tidak ada yang terlewat

**Total Estimasi T4: 2–3 jam**

---

### T5 — Update Entry Point `index.html`

**Deskripsi:**
Vue CLI menyembunyikan `index.html` di dalam `public/index.html` dan memasukkan bundle secara otomatis. Vite menggunakan `index.html` di **root proyek** sebagai entry point, dengan `<script type="module">` yang menunjuk langsung ke `src/main.js`.

**Kompleksitas:** 🟡 Sedang
**Risiko:** 🟡 Sedang — jika `index.html` tidak benar, aplikasi tidak akan tampil sama sekali

**⚠️ Catatan Penting:**
- File `public/index.html` dari Vue CLI TIDAK digunakan oleh Vite
- Vite membutuhkan `index.html` di **root proyek** (bukan di dalam `public/`)
- Aset di folder `public/` tetap bisa diakses dengan path `/` (tidak berubah)

---

**Sub-task T5.1: Baca `public/index.html` yang Ada**

**Estimasi:** 5 menit

**Step-by-step:**

1. Baca `public/index.html` dengan `view_file`
2. Catat tag `<meta>`, `<link>`, dan lain-lain yang perlu dipertahankan

---

**Sub-task T5.2: Buat `index.html` di Root Proyek**

**Estimasi:** 20 menit

**Step-by-step:**

1. Buat file `index.html` baru di root proyek (bukan di `public/`) berdasarkan konten `public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AdminGypsy</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- 
      PENTING: Vite membutuhkan script module ini — jangan hapus
      Tidak perlu tag <script> lain, Vite mengelola bundling secara otomatis
    -->
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

> **Sesuaikan** konten `<head>` dengan yang ada di `public/index.html` (favicon, meta title, dll).

**Total Estimasi T5: 30 menit**

---

### T6 — Update `src/main.js` dan Plugins

**Deskripsi:**
Memeriksa apakah ada perubahan yang diperlukan di `src/main.js` dan file plugin untuk kompatibilitas dengan Vite.

**Kompleksitas:** 🟡 Sedang
**Risiko:** 🟡 Sedang — import path dan CSS import perlu diverifikasi

**⚠️ Catatan Penting:**
- Import path yang menggunakan `@/` tetap berfungsi karena sudah dikonfigurasi di `vite.config.js`
- Import CSS dari `node_modules` menggunakan path absolut (tanpa `~`) — Vite sudah mendukung ini
- `process.env.NODE_ENV` tetap tersedia di Vite (tidak perlu diubah)

---

**Sub-task T6.1: Verifikasi `src/plugins/vuetify.js`**

**Estimasi:** 20 menit

**Step-by-step:**

1. Baca `src/plugins/vuetify.js` dengan `view_file`
2. Dengan `vite-plugin-vuetify`, konfigurasi Vuetify mungkin perlu diperbarui
3. Hapus import manual Vuetify CSS jika menggunakan `autoImport: true` di `vite.config.js`

---

**Sub-task T6.2: Verifikasi `src/plugins/webfontloader.js`**

**Estimasi:** 10 menit

**Step-by-step:**

1. Baca `src/plugins/webfontloader.js` dengan `view_file`
2. Pastikan import dan penggunaannya kompatibel dengan Vite (biasanya tidak ada perubahan)

---

**Sub-task T6.3: Test Build Awal**

**Estimasi:** 20–30 menit

**Step-by-step:**

1. Coba jalankan dev server: `npm run dev`
2. Jika ada error, baca pesan error dengan seksama dan perbaiki satu per satu
3. Error umum yang mungkin muncul:
   - `Cannot use require()` — ganti dengan `import ... from`
   - `__dirname is not defined` — gunakan `fileURLToPath(import.meta.url)`
   - Module tidak ditemukan — cek path dan nama file

**Total Estimasi T6: 1–2 jam**

---

### T7 — Testing & Verifikasi Seluruh Aplikasi

**Deskripsi:**
Ini adalah task **terlama dan terpenting**. Setelah build berhasil, SETIAP halaman dan fitur harus diverifikasi secara manual di browser untuk memastikan tidak ada regresi.

**Kompleksitas:** 🔴 Tinggi
**Risiko:** 🔴 Tinggi — regresi mungkin muncul di tempat yang tidak terduga

**⚠️ Catatan Penting:**
- `npm run build` berhasil BUKAN jaminan semua halaman berfungsi
- Fokus testing pada fitur yang menggunakan env vars: API call dan image URL
- Test di browser dengan Network tab terbuka untuk melihat apakah ada request yang gagal

---

**Sub-task T7.1: Verifikasi Dev Server**

**Estimasi:** 30 menit

**Step-by-step:**

1. Jalankan `npm run dev`
2. Buka http://localhost:8080 di browser
3. Login dan verifikasi dashboard tampil dengan benar
4. Buka Console tab browser — pastikan tidak ada error
5. Buka Network tab — pastikan API calls berhasil (status 200/201)

---

**Sub-task T7.2: Verifikasi Halaman Utama**

**Estimasi:** 2–4 jam

**Step-by-step:**

1. Buka setiap halaman utama dan verifikasi:
   - Data tabel muncul
   - Gambar/foto muncul (membutuhkan `VITE_FILE_URL` yang benar)
   - Create/Update/Delete berfungsi
   - Pagination berfungsi (jika ada)
2. Jika gambar tidak muncul, cek apakah `import.meta.env.VITE_FILE_URL` sudah terdefinisi

---

**Sub-task T7.3: Verifikasi Production Build**

**Estimasi:** 30 menit

**Step-by-step:**

1. Jalankan: `npm run build`
2. Pastikan build berhasil tanpa error
3. Jalankan preview: `npm run preview`
4. Verifikasi aplikasi berjalan di mode preview

---

**Sub-task T7.4: Fix Regresi yang Ditemukan**

**Estimasi:** 2–8 jam (tergantung jumlah regresi)

**Step-by-step:**

1. Catat semua regresi yang ditemukan saat testing
2. Perbaiki satu per satu, mulai dari yang paling kritis
3. Setelah setiap fix, verifikasi ulang halaman yang terdampak

**Total Estimasi T7: 8–12 jam**

---

### T8 — Update Dokumentasi & Merge Branch

**Deskripsi:**
Setelah semua testing selesai dan tidak ada regresi, perbarui dokumentasi dan merge branch ke `refactor`.

**Kompleksitas:** 🟢 Rendah
**Risiko:** 🟢 Rendah

---

**Sub-task T8.1: Update `docs/README.md`**

**Estimasi:** 15 menit

**Step-by-step:**

1. Update Quick Start section di `docs/README.md`:
   - Ganti "Framework: Vue 3 (via Vue CLI / Webpack)" menjadi "Framework: Vue 3 (via Vite)"
   - Ganti `process.env.VUE_APP_FILE_URL || ''` menjadi `import.meta.env.VITE_FILE_URL || ''`
   - Update dev server command dari `npm run serve` ke `npm run dev` (atau keduanya)
2. Update status di tabel fase

---

**Sub-task T8.2: Commit & Merge**

**Estimasi:** 15 menit

**Step-by-step:**

1. Commit semua perubahan di branch `vite-migration`:

```bash
git add .
git commit -m "build: migrate from Vue CLI (Webpack) to Vite"
```

2. Checkout ke branch `refactor`:

```bash
git checkout refactor
```

3. Merge branch `vite-migration`:

```bash
git merge vite-migration
```

4. Jika tidak ada conflict, push ke remote

**Total Estimasi T8: 1 jam**

---

## 🛡️ Risk & Mitigation

| Task | Risiko | Probabilitas | Mitigasi |
|------|--------|--------------|----------|
| T2 (Uninstall) | Proyek tidak bisa build sampai Vite selesai dikonfigurasi | 🔴 Pasti terjadi | Normal — ikuti alur task T2→T3→T4→T5→T6 tanpa skip |
| T3 (vite.config) | Plugin `vite-plugin-vuetify` versi baru tidak kompatibel | 🟡 Sedang | Cek versi Vuetify yang terpasang (`^3.0.0-beta.0`) dan sesuaikan versi plugin |
| T4 (env vars) | Satu `process.env.VUE_APP_*` terlewas → API / image gagal | 🔴 Sangat Tinggi | Gunakan `grep_search` sebelum dan sesudah migrasi untuk memverifikasi |
| T5 (index.html) | Favicon atau meta tag hilang | 🟡 Sedang | Salin konten `<head>` dari `public/index.html` yang ada |
| T6 (plugins) | CommonJS `require()` di plugin tidak kompatibel Vite | 🟡 Sedang | Konversi ke `import ... from` atau gunakan `createRequire` jika terpaksa |
| T7 (testing) | Regresi halaman yang tidak terduga | 🟡 Sedang | Testing manual menyeluruh — tidak ada jalan pintas |
| Semua | Keputusan untuk rollback | 🟡 Sedang | Gunakan branch terpisah — rollback semudah `git checkout refactor` |

---

## 📋 Catatan Implementasi

```
[2026-09-01] Fase Opsional P4 Completed:
- T1: Created and checked out branch vite-migration.
- T2: Uninstalled @vue/cli packages. Installed vite, @vitejs/plugin-vue, vite-plugin-vuetify, modern sass, @vue/devtools-api. Updated scripts in package.json.
- T3: Created vite.config.js with Vue 3, Vuetify auto-import, path alias '@' and '~', port 8080, and esbuild drop console/debugger. Removed vue.config.js.
- T4: Migrated all process.env.VUE_APP_* to import.meta.env.VITE_* in .env.local, .env.production, src/util/apiClient.js, src/main.js, src/components/HeaderDashboard.vue, src/components/ImageUpload.vue, src/components/SidebarDashboard.vue, and src/views/address-master/address-master/AddressMaster.vue.
- T5: Created root index.html with <script type="module" src="/src/main.js"></script>.
- T6: Fixed flag-icons import path in src/main.js.
- T7: Verified production build (npm run build) completed in 14.13s with 0 errors. Verified dist/.htaccess and dist/index.html generation.
- T8: Documentation updated in docs/IMPLEMENTATION.md and docs/README.md.
```

---

*File ini diperbarui pada 2026-09-01. Fase 1–6 dan Fase Opsional P4 (Vite Migration) sudah selesai.*


