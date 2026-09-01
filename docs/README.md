# 📖 AdminGypsy — Agent Reference Guide (docs/README.md)

> **Untuk:** Model AI (Gemini / Claude) yang akan bekerja di proyek ini.
> **Update terakhir:** 2026-09-01 (Fase 4 ditambahkan)

---

## 🗺️ Status Proyek Saat Ini

| Fase | Nama | Status |
|------|------|--------|
| Fase 1 | Security Hardening | ✅ SELESAI (commit `39ce7f1d`) |
| Fase 2 | Architecture Upgrade | ✅ SELESAI |
| Fase 3 | Code Quality & Performance | ✅ SELESAI |
| Fase 4 | UX & Security Polish | ✅ SELESAI |

Semua fase perbaikan (Fase 1, 2, 3, dan 4) telah berhasil diimplementasikan dan diverifikasi via production build (0 error).


---

## ⚡ Quick Start — Baca Ini Sebelum Melakukan Apapun

**Proyek ini adalah Admin Dashboard berbasis:**
- **Framework:** Vue 3 (via Vue CLI / Webpack) — **BUKAN Vite**
- **UI Library:** Vuetify 3
- **State Management:** Pinia (migrasi dari Vuex selesai di Fase 2)
- **Event Bus:** `mitt` (migrasi dari Vue 2-style eventBus selesai di Fase 2)
- **Routing:** Vue Router 4 (global `router.beforeEach` guard)
- **HTTP:** Axios tersentralisasi di `src/util/apiClient.js` dan `src/util/axios.js` (wrapper)
- **Auth Storage:** `sessionStorage` via `src/util/tokenStorage.js`
- **Hosting:** cPanel shared hosting — `npm run build` menghasilkan `dist/` yang diupload ke server

**Branch aktif:** `dev` (atau `refactor` — cek dengan `git branch`)

**Dev server:** `npm run serve` → http://localhost:8080

---

## ⛔ ATURAN PALING PENTING — JANGAN DILANGGAR

1. **Jangan ubah file di `src/views/`** kecuali ada instruksi eksplisit di IMPLEMENTATION.md
2. **Jangan uninstall package** tanpa memverifikasi bahwa package tersebut tidak digunakan (gunakan `grep_search`)
3. **Verifikasi `npm run serve` tidak error** setelah SETIAP perubahan
4. **Baca file lengkap sebelum mengedit** — jangan asumsi isi file berdasarkan namanya

---

## 📁 Struktur Direktori Penting (State Terkini)

```
admingypsy-new/
├── public/
│   └── .htaccess           ← ✅ SPA routing + security headers (Fase 1)
├── src/
│   ├── components/
│   │   ├── AdminDashboard.vue    ← Layout utama (sudah pakai Pinia)
│   │   ├── SidebarDashboard.vue  ← Sidebar navigasi (sudah pakai Pinia + mitt)
│   │   ├── HeaderDashboard.vue   ← Header (sudah pakai mitt)
│   │   ├── Dropdown.vue
│   │   ├── ImageUpload.vue       ← Komponen upload gambar (single)
│   │   ├── ImageMultiUpload.vue  ← Komponen upload multi gambar
│   │   └── VideoUpload.vue       ← Komponen upload video
│   ├── composables/        ← ✅ Sudah ada (dibuat di Fase 3)
│   │   ├── useDebounce.js  ← ✅ Reusable debounce utility
│   │   ├── useApi.js       ← ✅ Reactive API wrapper
│   │   ├── usePagination.js       ← [AKAN DIBUAT] Fase 4 T7
│   │   └── useApiWithCache.js     ← [AKAN DIBUAT] Fase 4 T8
│   ├── router/
│   │   └── index.js        ← ~750 baris. Global beforeEach guard sudah ada (Fase 1)
│   ├── stores/             ← ✅ Pinia stores (dibuat Fase 2)
│   │   ├── navigation.js   ← ✅ Navigation store
│   │   └── notification.js ← [AKAN DIBUAT] Fase 4 T3
│   ├── util/
│   │   ├── apiClient.js    ← ✅ Satu Axios instance terpusat (Fase 1)
│   │   ├── axios.js        ← ✅ Backward compat wrapper → apiClient (Fase 1)
│   │   ├── tokenStorage.js ← ✅ Abstraksi sessionStorage auth (Fase 1)
│   │   └── eventBus.js     ← ✅ Global event bus via `mitt` (Fase 2)
│   ├── views/              ← ⚠️ JANGAN UBAH kecuali instruksi eksplisit
│   │   ├── login/
│   │   │   └── LoginComponent.vue ← ✅ Sudah pakai tokenStorage
│   │   └── [35+ direktori view lain — banyak yang namanya mengandung spasi]
│   ├── App.vue             ← ✅ Periodic token expiry check (Fase 1)
│   └── main.js             ← ✅ Centralized setup [$api, $fileURL, Pinia] (Fase 1 & 2)
├── docs/
│   ├── README.md           ← File ini
│   ├── IMPLEMENTATION.md   ← Rencana implementasi detail per fase (Fase 1–4)
│   └── IMPROVEMENT.md      ← ✅ Daftar semua improvement yang bisa diterapkan
├── ANALYSIS.md             ← Analisis lengkap proyek (referensi sumber kebenaran)
├── .env.local              ← ✅ Environment variables (TIDAK di-commit)
└── .env.production         ← ✅ Environment variables prod (TIDAK di-commit)
```

---

## ✅ Yang Sudah Selesai (Fase 1 – 3)

### Fase 1 — Security Hardening

| File | Perubahan |
|------|-----------|
| `src/util/apiClient.js` | **[BARU]** Satu Axios instance dengan request/response interceptors |
| `src/util/tokenStorage.js` | **[BARU]** Abstraksi sessionStorage untuk token auth |
| `src/main.js` | Hapus `axiosAbsensi`, tambah `$api` global property, global error handler |
| `src/App.vue` | Token expiry check + redirect ke login |
| `src/router/index.js` | Hapus ~90 `beforeEnter` duplikat, tambah global `router.beforeEach` |
| `src/components/SidebarDashboard.vue` | Migrasi dari `localStorage` ke `tokenStorage`, script setup |
| `src/views/login/LoginComponent.vue` | Migrasi dari `localStorage` ke `tokenStorage` |
| `src/util/axios.js` | Diubah menjadi re-export wrapper ke `apiClient` |
| `public/.htaccess` | **[BARU]** SPA routing, CSP, cache control, Gzip |

### Fase 2 — Architecture Upgrade

| Perubahan | Detail |
|-----------|--------|
| Vuex → Pinia | `src/stores/navigation.js` dibuat. Vuex diuninstall. |
| eventBus → mitt | `src/util/eventBus.js` diperbarui ke `mitt`. |
| Komponen diupdate | `SidebarDashboard.vue`, `AdminDashboard.vue`, `HeaderDashboard.vue` sudah pakai Pinia & mitt |

### Fase 3 — Code Quality & Performance

| Perubahan | Detail |
|-----------|--------|
| Dead code cleanup | `ImageUpload.vue`, `ImageMultiUpload.vue`, `VideoUpload.vue`, `AdminDashboard.vue` |
| Dependency cleanup | Uninstall: `flag-icon-css`, `handy-uploader`, `buffer-es6`, `roboto-fontface` |
| Route names verified | 112 route, 0 duplikat |
| Global error handler | `app.config.errorHandler` + `unhandledrejection` di `main.js` |
| Composables baru | `src/composables/useDebounce.js`, `src/composables/useApi.js` |
| ImageUpload.vue | Template disimplifikasi + migrasi ke `<script setup>` + bug preview fix |
| HeaderDashboard.vue | Migrasi ke `<script setup>` Composition API |
| SidebarDashboard.vue | Migrasi ke `<script setup>` Composition API |
| ESLint | `vue/setup-compiler-macros: true` ditambahkan |

---

## ⚠️ Hal Kritis yang Harus Diketahui

### 1. Token Storage — Gunakan `tokenStorage`, Bukan `localStorage`
```javascript
import { tokenStorage } from '@/util/tokenStorage';
tokenStorage.getToken()       // ambil token (dari sessionStorage)
tokenStorage.setToken(value)  // simpan token
tokenStorage.clearAll()       // hapus semua data auth
```

### 2. HTTP Request — Gunakan `axios` dari `@/util/axios`, Bukan Raw Axios
```javascript
import axios from '@/util/axios'; // ← ini adalah wrapper ke apiClient
// JANGAN: import axios from 'axios' — ini raw axios tanpa base URL / auth header
```

### 3. Event Bus — Gunakan API `mitt`
```javascript
import eventBus from '@/util/eventBus';
eventBus.emit('event-name', payload)   // kirim event
eventBus.on('event-name', handler)     // subscribe event
eventBus.off('event-name', handler)    // unsubscribe event
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

### 6. Direktori Views Mengandung Spasi
Banyak folder di `src/views/` mengandung spasi (contoh: `walls master`, `menu management`). Ini adalah technical debt yang **belum** diselesaikan. Jangan ubah nama direktori ini — bisa menyebabkan breaking import di 90+ route.

---

## 🔎 Cara Mencari Sesuatu di Proyek

| Butuh | Command |
|-------|---------|
| Cari semua `localStorage` yang tersisa | `grep_search "localStorage" SearchPath: src/ MatchPerLine: true` |
| Cari komponen yang masih pakai Vuex | `grep_search "$store" SearchPath: src/ MatchPerLine: true` |
| Cari semua import raw axios | `grep_search "import http from 'axios'" SearchPath: src/ MatchPerLine: true` |
| Cari semua eventBus usage | `grep_search "eventBus" SearchPath: src/ MatchPerLine: true` |
| Hitung baris sebuah file | `(Get-Content "src/path/file.vue").Count` |
| Cek apakah package terinstall | `node -e "require('mitt'); console.log('ok')"` |
| Lihat perubahan git yang belum di-commit | `git diff` atau `git status` |

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
VUE_APP_API_BASE_URL=https://adminsymphinite.symphinite.tech/api/
VUE_APP_FILE_URL=https://admin1.the-gypsy.sg/img/app/
```

Semua variabel Vue CLI **wajib diawali** `VUE_APP_` agar bisa dibaca via `process.env.VUE_APP_*`.

---

## 📂 File yang TIDAK BOLEH Diubah (kecuali ada instruksi eksplisit di IMPLEMENTATION.md)

- `src/views/**/*` — semua file view, tanpa pengecualian
- `src/plugins/vuetify.js` — konfigurasi Vuetify
- `src/plugins/webfontloader.js`
- `vue.config.js`
- `babel.config.js`

---

## 🚦 Decision Log (Keputusan Arsitektur)

| Keputusan | Alasan |
|-----------|--------|
| Gunakan `sessionStorage` bukan `localStorage` untuk token | Lebih aman dari XSS — data hilang saat browser/tab ditutup |
| Pertahankan `src/util/axios.js` sebagai wrapper | Backward compatibility — ratusan file masih import dari sini |
| Tidak rename direktori dengan spasi di Fase 2, 3, & 4 | Risiko breaking change pada 90+ import path — defer ke masa mendatang |
| Jalankan Pinia & Vuex paralel sebelum uninstall | Mencegah error komponen saat migrasi bertahap |
| Tidak migrasi semua views ke Composition API | Terlalu berisiko — cukup komponen shared di Fase 3 |
| Gunakan `mitt` bukan custom Vue app untuk eventBus | mitt lebih ringan, API lebih standar, tidak ada anti-pattern |
| Fase 4 komponen baru bersifat additive | Tidak memaksa view lama berubah — risiko breaking change nol |
| Pertahankan `font-awesome` meski ada `@fortawesome/fontawesome-free` | 170+ `Container.vue` di views masih import `~font-awesome/scss/font-awesome.scss` |

---

## 📚 Referensi Dokumen

| Dokumen | Tujuan |
|---------|--------|
| [`ANALYSIS.md`](../ANALYSIS.md) | Audit lengkap codebase — sumber kebenaran untuk semua keputusan |
| [`docs/IMPLEMENTATION.md`](./IMPLEMENTATION.md) | Rencana implementasi per fase dengan step-by-step execution |
| [`docs/IMPROVEMENT.md`](./IMPROVEMENT.md) | Daftar semua improvement yang bisa diterapkan (roadmap jangka panjang) |

