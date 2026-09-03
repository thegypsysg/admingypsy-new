# 📖 AdminGypsy — Agent Reference Guide (docs/README.md)

> **Untuk:** Model AI (Gemini / Claude) yang akan bekerja di proyek ini.
> **Update terakhir:** 2026-09-03 (Fase Opsional S5 & S3 ditambahkan sebagai rencana berikutnya; Fase 7 UX7 & semua fase sebelumnya sudah selesai)

---

## 🗺️ Status Proyek Saat Ini

| Fase                 | Nama                               | Status                         |
| -------------------- | ---------------------------------- | ------------------------------ |
| Fase 1               | Security Hardening                 | ✅ SELESAI (commit `39ce7f1d`) |
| Fase 2               | Architecture Upgrade               | ✅ SELESAI                     |
| Fase 3               | Code Quality & Performance         | ✅ SELESAI                     |
| Fase 4               | UX & Security Polish               | ✅ SELESAI                     |
| Fase 5               | Performance Optimization           | ✅ SELESAI                     |
| Fase 6               | Developer Experience               | ✅ SELESAI                     |
| Fase Opsional P4     | Migrasi Vue CLI → Vite             | ✅ SELESAI                     |
| Fase Opsional DX4    | Rename Direktori Views             | ✅ SELESAI                     |
| Fase Opsional P3     | API Caching Layer                  | ✅ SELESAI                     |
| Fase Opsional DX1    | TypeScript Migration (Gradual)     | ✅ SELESAI                     |
| Fase 7 UX7           | View Modernization                 | ✅ SELESAI                     |
| **Fase Opsional S5** | **HTTPS Enforcement & HSTS**       | **✅ SELESAI**                 |
| **Fase Opsional S3** | **Input Sanitization (DOMPurify)** | **✅ SELESAI**                 |

Semua fase perbaikan (Fase 1–6, Fase Opsional P4, DX4, P3, DX1, Fase 7 UX7, serta Fase Opsional S5 dan S3) telah berhasil diimplementasikan dan diverifikasi via `npm run type-check` (0 error) dan `npm run build` (0 error).

---

## ⚡ Quick Start — Baca Ini Sebelum Melakukan Apapun

**Proyek ini adalah Admin Dashboard berbasis:**

- **Framework:** Vue 3 (via Vite)
- **UI Library:** Vuetify 3 (dengan `vite-plugin-vuetify` auto-import)
- **State Management:** Pinia (migrasi dari Vuex selesai di Fase 2)
- **Event Bus:** `mitt` (migrasi dari Vue 2-style eventBus selesai di Fase 2)
- **Routing:** Vue Router 4 (global `router.beforeEach` guard)
- **HTTP:** Axios tersentralisasi di `src/util/apiClient.js` dan `src/util/axios.js` (wrapper)
- **Auth Storage:** `sessionStorage` via `src/util/tokenStorage.js`
- **Hosting:** cPanel shared hosting — `npm run build` menghasilkan `dist/` yang diupload ke server

**Branch aktif:** `refactor` (hasil migrasi Vite sudah di-merge; cek dengan `git branch`)

**Dev server:** `npm run dev` → http://localhost:5173 (port default Vite)

---

## ⛔ ATURAN PALING PENTING — JANGAN DILANGGAR

1. **Jangan ubah file di `src/views/`** kecuali ada instruksi eksplisit di IMPLEMENTATION.md
2. **Jangan uninstall package** tanpa memverifikasi bahwa package tersebut tidak digunakan (gunakan `grep_search`)
3. **Verifikasi `npm run build` tidak error** setelah setiap batch perubahan
4. **Baca file lengkap sebelum mengedit** — jangan asumsi isi file berdasarkan namanya
5. **Jangan modifikasi logic bisnis** — hanya ubah konfigurasi, utility, atau boilerplate UI
6. **Untuk Fase S5:** KONFIRMASI SSL aktif di server sebelum mengaktifkan HSTS — salah langkah bisa membuat domain tidak bisa diakses
7. **Untuk Fase S3:** Buat `src/util/sanitize.js` TERLEBIH DAHULU sebelum mengubah view apapun

---

## 📁 Struktur Direktori Penting (State Terkini)

```
admingypsy-new/
├── public/
│   └── .htaccess           ← ✅ SPA routing + security headers (Fase 1)
├── src/
│   ├── components/
│   │   ├── AdminDashboard.vue    ← Layout utama
│   │   ├── SidebarDashboard.vue  ← Sidebar navigasi (Pinia + mitt + script setup)
│   │   ├── HeaderDashboard.vue   ← Header (script setup)
│   │   ├── Dropdown.vue
│   │   ├── ImageUpload.vue       ← Komponen upload gambar (single, script setup)
│   │   ├── ImageMultiUpload.vue  ← Komponen upload multi gambar
│   │   ├── VideoUpload.vue       ← Komponen upload video
│   │   ├── GlobalNotification.vue ← ✅ Toast global (Fase 4)
│   │   ├── ConfirmDialog.vue     ← ✅ Dialog konfirmasi reusable (Fase 4)
│   │   ├── EmptyState.vue        ← ✅ Empty state reusable (Fase 4)
│   │   └── SkeletonTable.vue     ← ✅ Table skeleton loader (Fase 5)
│   ├── composables/        ← ✅ Reusable composables (Fase 3, 4, 5)
│   │   ├── useDebounce.js        ← ✅ Reusable debounce utility
│   │   ├── useApi.js             ← ✅ Reactive API wrapper
│   │   ├── usePagination.js      ← ✅ Server pagination composable
│   │   ├── useApiWithCache.js    ← ✅ In-memory API cache composable (Fase P3 — integrasi ke views)
│   │   ├── useSkeletonLoader.js  ← ✅ Skeleton loading state composable
│   │   └── useImageLazy.js       ← ✅ Image lazy loading helper composable
│   ├── router/
│   │   └── index.js        ← ~750 baris. Global beforeEach guard sudah ada (Fase 1)
│   ├── stores/             ← ✅ Pinia stores
│   │   ├── navigation.js   ← ✅ Navigation store (Fase 2)
│   │   └── notification.js ← ✅ Toast notification store (Fase 4)
│   ├── util/
│   │   ├── apiClient.js    ← ✅ Satu Axios instance terpusat (Fase 1)
│   │   ├── axios.js        ← ✅ Backward compat wrapper → apiClient (Fase 1)
│   │   ├── tokenStorage.js ← ✅ Abstraksi sessionStorage auth (Fase 1)
│   │   └── eventBus.js     ← ✅ Global event bus via `mitt` (Fase 2)
│   ├── views/              ← ⚠️ Hati-hati saat memodifikasi. Semua folder sudah kebab-case (DX4 selesai)
│   │   ├── login/
│   │   │   └── LoginComponent.vue ← ✅ Sudah pakai tokenStorage
│   │   └── [35+ direktori view lain — semua sudah kebab-case tanpa spasi]
│   ├── App.vue             ← ✅ Periodic token expiry check (Fase 1)
│   └── main.js             ← ✅ Centralized setup [$api, $fileURL, Pinia] (Fase 1 & 2)
├── docs/
│   ├── README.md           ← File ini
│   ├── IMPLEMENTATION.md   ← Rencana implementasi detail per fase (Fase 1–5)
│   └── IMPROVEMENT.md      ← ✅ Daftar semua improvement yang bisa diterapkan
├── ANALYSIS.md             ← Analisis lengkap proyek (referensi sumber kebenaran)
├── .env.local              ← ✅ Environment variables (TIDAK di-commit)
└── .env.production         ← ✅ Environment variables prod (TIDAK di-commit)
```

---

## ✅ Yang Sudah Selesai (Fase 1 – 3)

### Fase 1 — Security Hardening

| File                                  | Perubahan                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------- |
| `src/util/apiClient.js`               | **[BARU]** Satu Axios instance dengan request/response interceptors       |
| `src/util/tokenStorage.js`            | **[BARU]** Abstraksi sessionStorage untuk token auth                      |
| `src/main.js`                         | Hapus `axiosAbsensi`, tambah `$api` global property, global error handler |
| `src/App.vue`                         | Token expiry check + redirect ke login                                    |
| `src/router/index.js`                 | Hapus ~90 `beforeEnter` duplikat, tambah global `router.beforeEach`       |
| `src/components/SidebarDashboard.vue` | Migrasi dari `localStorage` ke `tokenStorage`, script setup               |
| `src/views/login/LoginComponent.vue`  | Migrasi dari `localStorage` ke `tokenStorage`                             |
| `src/util/axios.js`                   | Diubah menjadi re-export wrapper ke `apiClient`                           |
| `public/.htaccess`                    | **[BARU]** SPA routing, CSP, cache control, Gzip                          |

### Fase 2 — Architecture Upgrade

| Perubahan         | Detail                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Vuex → Pinia      | `src/stores/navigation.js` dibuat. Vuex diuninstall.                                         |
| eventBus → mitt   | `src/util/eventBus.js` diperbarui ke `mitt`.                                                 |
| Komponen diupdate | `SidebarDashboard.vue`, `AdminDashboard.vue`, `HeaderDashboard.vue` sudah pakai Pinia & mitt |

### Fase 3 — Code Quality & Performance

| Perubahan            | Detail                                                                             |
| -------------------- | ---------------------------------------------------------------------------------- |
| Dead code cleanup    | `ImageUpload.vue`, `ImageMultiUpload.vue`, `VideoUpload.vue`, `AdminDashboard.vue` |
| Dependency cleanup   | Uninstall: `flag-icon-css`, `handy-uploader`, `buffer-es6`, `roboto-fontface`      |
| Route names verified | 112 route, 0 duplikat                                                              |
| Global error handler | `app.config.errorHandler` + `unhandledrejection` di `main.js`                      |
| Composables baru     | `src/composables/useDebounce.js`, `src/composables/useApi.js`                      |
| ImageUpload.vue      | Template disimplifikasi + migrasi ke `<script setup>` + bug preview fix            |
| HeaderDashboard.vue  | Migrasi ke `<script setup>` Composition API                                        |
| SidebarDashboard.vue | Migrasi ke `<script setup>` Composition API                                        |
| ESLint               | `vue/setup-compiler-macros: true` ditambahkan                                      |

---

## ⚠️ Hal Kritis yang Harus Diketahui

### 1. Token Storage — Gunakan `tokenStorage`, Bukan `localStorage`

```javascript
import { tokenStorage } from '@/util/tokenStorage';
tokenStorage.getToken(); // ambil token (dari sessionStorage)
tokenStorage.setToken(value); // simpan token
tokenStorage.clearAll(); // hapus semua data auth
```

### 2. HTTP Request — Gunakan `axios` dari `@/util/axios`, Bukan Raw Axios

```javascript
import axios from '@/util/axios'; // ← ini adalah wrapper ke apiClient
// JANGAN: import axios from 'axios' — ini raw axios tanpa base URL / auth header
```

### 3. Event Bus — Gunakan API `mitt`

```javascript
import eventBus from '@/util/eventBus';
eventBus.emit('event-name', payload); // kirim event
eventBus.on('event-name', handler); // subscribe event
eventBus.off('event-name', handler); // unsubscribe event
// JANGAN pakai: eventBus.$emit / eventBus.$on — itu API Vue 2
```

### 4. Navigation Store — Gunakan Pinia

```javascript
import { useNavigationStore } from '@/stores/navigation';
// Di dalam Options API (created/mounted):
this.navStore = useNavigationStore();
const nav = this.navStore.navigation;
```

### 5. Global Properties

Tersedia di semua komponen:

- `this.$api` → Axios instance (`apiClient.js`)
- `this.$fileURL` → URL base untuk gambar (`https://admin1.the-gypsy.sg/img/app/`)

### 6. Direktori Views Menggunakan Format Kebab-Case (Tanpa Spasi)

Seluruh subfolder di `src/views/` telah di-rename menjadi format kebab-case (`-`) pada **Fase Opsional DX4** (contoh: `walls-master`, `menu-management`, `app-country-city`). Jangan membuat direktori baru dengan spasi untuk menjaga kompatibilitas environment Linux dan Vite resolver.

### 7. API Caching — Gunakan `useApiWithCache` HANYA di `<script setup>`

Composable `useApiWithCache` tersedia di `src/composables/useApiWithCache.js` dan hanya boleh digunakan di view yang sudah menggunakan `<script setup>`. **Jangan panggil di Options API** (`created()`, `mounted()` tanpa `setup()`) karena akan menyebabkan Vue runtime error `getCurrentInstance`.

```javascript
// Contoh BENAR — di dalam <script setup>
import { onMounted } from 'vue';
import { useApiWithCache } from '@/composables/useApiWithCache';

const { data, isLoading, fetch, invalidate } = useApiWithCache('/industry-master', {
  ttlMs: 5 * 60 * 1000, // 5 menit
});
onMounted(() => fetch());

// Setelah CUD — selalu invalidate sebelum re-fetch:
// invalidate(); fetch();
```

### 8. TypeScript — Gunakan Hanya untuk File BARU (`*.ts`), JANGAN Ubah File Lama

Proyek sedang dalam proses **migrasi gradual ke TypeScript** (Fase Opsional DX1). Aturan yang WAJIB diikuti:

- **JANGAN** tambahkan `lang="ts"` ke `<script setup>` di file `*.vue` yang sudah ada.
- **JANGAN** ubah file `*.js` yang sudah ada menjadi `*.ts` tanpa instruksi eksplisit.
- File TypeScript baru ditulis di `src/types/` (type definitions) dan `src/composables/useTypedApi.ts`.
- Import types menggunakan `import type { ... } from '@/types'`.

```typescript
// Contoh penggunaan type dari src/types/
import type { ApiResponse, AppItem } from '@/types';

// Contoh composable TypeScript (hanya untuk file baru)
import { useTypedApi } from '@/composables/useTypedApi';
const { data, isLoading, execute } = useTypedApi<ApiResponse<AppItem[]>>();
```

> **Penting:** `tsconfig.json` sudah dikonfigurasi dengan `strict: false` dan `checkJs: false` agar file JS lama tidak error. Jalankan `npm run type-check` untuk verifikasi file TypeScript baru.

### 9. Komponen Reusable yang Sudah Siap Pakai (Fase 7 UX7)

Semua komponen ini sudah terpasang dan siap digunakan di view mana pun:

#### `GlobalNotification.vue` — Notifikasi Global

Sudah terpasang di `App.vue`. **Tidak perlu ditambahkan ke view** — langsung gunakan store-nya:

```javascript
// Di dalam <script> Options API:
import { useNotificationStore } from '@/stores/notification';

export default {
  // Wajib: inisialisasi via setup() agar bisa diakses via this.notification
  setup() {
    const notification = useNotificationStore();
    return { notification };
  },
  methods: {
    onSuccess() {
      this.notification.success('Data saved successfully!');
    },
    onError(error) {
      const message = error?.response?.data?.message || 'Something went wrong!';
      this.notification.error(message);
    },
  },
};
```

#### `ConfirmDialog.vue` — Dialog Konfirmasi Delete

```javascript
// Import dan registrasi:
import ConfirmDialog from '@/components/ConfirmDialog.vue';
export default {
  components: { ConfirmDialog },
  data: () => ({ isDelete: false, idToDelete: null, isDeleteLoading: false }),
  methods: {
    openDelete(id) {
      this.idToDelete = id;
      this.isDelete = true;
    },
    async handleDelete() {
      this.isDeleteLoading = true;
      try {
        await axios.delete(`/endpoint/${this.idToDelete}`);
        this.notification.success('Deleted successfully!');
        this.fetchData();
      } catch (e) {
        this.notification.error(e?.response?.data?.message || 'Delete failed.');
      } finally {
        this.isDeleteLoading = false;
        this.idToDelete = null;
        // isDelete TIDAK perlu direset — ConfirmDialog auto-close
      }
    },
  },
};
```

```html
<!-- Di template: -->
<confirm-dialog
  v-model="isDelete"
  title="Delete Item"
  message="Are you sure? This action cannot be undone."
  :loading="isDeleteLoading"
  @confirm="handleDelete"
/>
```

#### `EmptyState.vue` — State Data Kosong

```javascript
import EmptyState from '@/components/EmptyState.vue';
export default { components: { EmptyState } };
```

```html
<!-- Letakkan di luar v-table, setelah penutup </v-sheet> atau </v-col> -->
<empty-state
  v-if="!isLoading && (!filteredItems || filteredItems.length === 0)"
  title="No Data Found"
  subtitle="There are no records to display."
/>
```

#### `SkeletonTable.vue` — Loading Skeleton

```javascript
import SkeletonTable from '@/components/SkeletonTable.vue';
export default { components: { SkeletonTable } };
```

```html
<!-- Letakkan tepat sebelum v-table, gantikan v-progress-circular -->
<skeleton-table v-if="isLoading" :rows="5" :columns="6" />
<v-table v-if="!isLoading">
  <!-- ... -->
</v-table>
```

## 🔎 Cara Mencari Sesuatu di Proyek

| Butuh                                              | Command                                                                                            |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Cari semua `localStorage` yang tersisa             | `grep_search "localStorage" SearchPath: src/ MatchPerLine: true`                                   |
| Cari komponen yang masih pakai Vuex                | `grep_search "$store" SearchPath: src/ MatchPerLine: true`                                         |
| Cari semua import raw axios                        | `grep_search "import http from 'axios'" SearchPath: src/ MatchPerLine: true`                       |
| Cari semua eventBus usage                          | `grep_search "eventBus" SearchPath: src/ MatchPerLine: true`                                       |
| **Cari view yang masih pakai v-snackbar**          | `grep_search "v-snackbar" SearchPath: src/views/ Includes: ["*.vue"] MatchPerLine: false`          |
| **Cari view yang masih pakai v-progress-circular** | `grep_search "v-progress-circular" SearchPath: src/views/ Includes: ["*.vue"] MatchPerLine: false` |
| **Cari view yang masih pakai isDelete**            | `grep_search "isDelete" SearchPath: src/views/ Includes: ["*.vue"] MatchPerLine: false`            |
| Hitung baris sebuah file                           | `(Get-Content "src/path/file.vue").Count`                                                          |
| Cek apakah package terinstall                      | `node -e "require('mitt'); console.log('ok')"`                                                     |
| Lihat perubahan git yang belum di-commit           | `git diff` atau `git status`                                                                       |

---

## 🛠️ Commands Berguna

```powershell
# Jalankan dev server
npm run serve

# Build untuk production (upload ke cPanel)
npm run build

# Cek semua dependency terinstall
npm list --depth=0

# Cek git history (baca log tanpa pager)
git log --oneline -20

# Kembalikan file ke kondisi terakhir commit (rollback satu file)
git checkout src/components/SidebarDashboard.vue
```

---

## ⚙️ Konfigurasi Environment

File `.env.local` (tidak di-commit) berisi:

```
VITE_API_BASE_URL=https://admin1.the-gypsy.sg/api/
VITE_FILE_URL=https://admin1.the-gypsy.sg/img/app/
```

Semua variabel Vite **wajib diawali** `VITE_` agar bisa dibaca via `import.meta.env.VITE_*`.

---

## 📂 File yang TIDAK BOLEH Diubah (kecuali ada instruksi eksplisit di IMPLEMENTATION.md)

- `src/views/**/*` — semua file view, tanpa pengecualian
- `vite.config.mjs` — konfigurasi Vite build tool
- `.husky/**/*` — pre-commit git hooks

---

## 🚦 Decision Log (Keputusan Arsitektur)

| Keputusan                                                            | Alasan                                                                            |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Gunakan `sessionStorage` bukan `localStorage` untuk token            | Lebih aman dari XSS — data hilang saat browser/tab ditutup                        |
| Pertahankan `src/util/axios.js` sebagai wrapper                      | Backward compatibility — ratusan file masih import dari sini                      |
| Tidak rename direktori dengan spasi di Fase 2, 3, & 4                | Risiko breaking change pada 90+ import path — defer ke masa mendatang             |
| Jalankan Pinia & Vuex paralel sebelum uninstall                      | Mencegah error komponen saat migrasi bertahap                                     |
| Tidak migrasi semua views ke Composition API                         | Terlalu berisiko — cukup komponen shared di Fase 3                                |
| Gunakan `mitt` bukan custom Vue app untuk eventBus                   | mitt lebih ringan, API lebih standar, tidak ada anti-pattern                      |
| Fase 4 komponen baru bersifat additive                               | Tidak memaksa view lama berubah — risiko breaking change nol                      |
| Pertahankan `font-awesome` meski ada `@fortawesome/fontawesome-free` | 170+ `Container.vue` di views masih import `~font-awesome/scss/font-awesome.scss` |

---

## 🚀 Fase Berikutnya yang Harus Dikerjakan

Jika kamu (model AI) diminta untuk melanjutkan proyek ini, fase berikutnya yang tersedia adalah:

### 1. Fase Opsional S5 — HTTPS Enforcement & HSTS (30 menit)

- **File yang diubah:** hanya `public/.htaccess`
- **Tidak ada `npm install`** — murni konfigurasi Apache
- **Prasyarat WAJIB:** Konfirmasi SSL sudah aktif di `https://admin1.the-gypsy.sg` (cek ikon gembok di browser)
- **Instruksi lengkap:** Cari section `# 🔒 IMPLEMENTATION.md — Fase Opsional S5` di `docs/IMPLEMENTATION.md`
- **Urutan task:** S5-T1 → S5-T2 → S5-T3 → S5-T4 → S5-T5

### 2. Fase Opsional S3 — Input Sanitization DOMPurify (45 menit)

- **Files yang dibuat:** `src/util/sanitize.js` (BARU)
- **Files yang diubah:** `src/views/cart-master/CartMaster.vue` (hanya method `formatInfo()`)
- **`npm install` diperlukan:** `npm install dompurify`
- **Instruksi lengkap:** Cari section `# 🛡️ IMPLEMENTATION.md — Fase Opsional S3` di `docs/IMPLEMENTATION.md`
- **Urutan task:** S3-T1 → S3-T2 → S3-T3 → S3-T4 → S3-T5

> **Rekomendasi urutan:** Kerjakan S3 terlebih dahulu (murni kode, tidak bergantung pada kondisi server), lalu S5 setelah SSL dikonfirmasi aktif.

---

## 📚 Referensi Dokumen

| Dokumen                                         | Tujuan                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------ |
| [`ANALYSIS.md`](../ANALYSIS.md)                 | Audit lengkap codebase — sumber kebenaran untuk semua keputusan                |
| [`docs/IMPLEMENTATION.md`](./IMPLEMENTATION.md) | Rencana implementasi per fase dengan step-by-step execution (termasuk S5 & S3) |
| [`docs/IMPROVEMENT.md`](./IMPROVEMENT.md)       | Daftar semua improvement yang bisa diterapkan (roadmap jangka panjang)         |
