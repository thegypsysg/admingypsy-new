# 📖 AdminGypsy — Agent Reference Guide (docs/README.md)

> **Untuk:** Model AI (Gemini / Claude) yang akan bekerja di proyek ini.
> **Update terakhir:** 2026-08-05

---

## 🗺️ Status Proyek Saat Ini

| Fase | Nama | Status |
|------|------|--------|
| Fase 1 | Security Hardening | ✅ SELESAI (commit `39ce7f1d`) |
| Fase 2 | Architecture Upgrade | ✅ SELESAI |
| Fase 3 | Performance & Modernization | ⏳ BELUM DIMULAI |

---

## ⚡ Quick Start (Baca Ini Dulu)

**Proyek ini adalah Admin Dashboard berbasis:**
- **Framework:** Vue 3 (via Vue CLI / Webpack) — BUKAN Vite
- **UI Library:** Vuetify 3
- **State:** Vuex 4 (saat ini) → akan migrasi ke Pinia di Fase 2
- **Routing:** Vue Router 4
- **HTTP:** Axios (centralized di `src/util/apiClient.js`)
- **Hosting:** cPanel shared hosting — `npm run build` menghasilkan `dist/` yang diupload ke server

**Branch aktif:** `refactor`

---

## 📁 Struktur Direktori Penting

```
admingypsy-new/
├── public/
│   └── .htaccess          ← SPA routing + security headers (dibuat Fase 1)
├── src/
│   ├── components/
│   │   ├── AdminDashboard.vue   ← Layout utama (menggunakan $store.navigation)
│   │   ├── SidebarDashboard.vue ← Sidebar navigasi (menggunakan $store.navigation)
│   │   ├── Dropdown.vue
│   │   └── ImageUpload.vue
│   ├── router/
│   │   └── index.js       ← ~750 baris. Global beforeEach guard sudah ada
│   ├── store/
│   │   └── index.js       ← Vuex store (AKAN dihapus di Fase 2)
│   ├── stores/             ← [BELUM ADA] Akan dibuat untuk Pinia (Fase 2)
│   ├── util/
│   │   ├── apiClient.js    ← ✅ Satu Axios instance terpusat [dibuat Fase 1]
│   │   ├── axios.js        ← ✅ Backward compat wrapper → apiClient [diubah Fase 1]
│   │   ├── tokenStorage.js ← ✅ Abstraksi sessionStorage auth [dibuat Fase 1]
│   │   └── eventBus.js     ← Custom event bus (AKAN diganti mitt di Fase 2)
│   ├── views/              ← Banyak subdirektori dengan nama mengandung spasi
│   │   └── login/
│   │       └── LoginComponent.vue  ← ✅ Sudah pakai tokenStorage
│   ├── App.vue             ← ✅ Periodic token expiry check [diubah Fase 1]
│   └── main.js             ← ✅ Centralized setup [$api, $fileURL] [diubah Fase 1]
├── docs/
│   ├── README.md           ← File ini
│   └── IMPLEMENTATION.md  ← Rencana implementasi fase-per-fase
├── ANALYSIS.md             ← Analisis lengkap proyek
├── .env.local              ← ✅ Environment variables (TIDAK di-commit)
└── .env.production         ← ✅ Environment variables prod (TIDAK di-commit)
```

---

## 🔐 Yang Sudah Dikerjakan di Fase 1

### Perubahan File:

| File | Perubahan |
|------|-----------|
| `src/util/apiClient.js` | **[BARU]** Satu Axios instance dengan interceptors |
| `src/util/tokenStorage.js` | **[BARU]** Abstraksi sessionStorage untuk token auth |
| `src/main.js` | Hapus `axiosAbsensi`, tambah `$api` global property |
| `src/App.vue` | Tambah periodic token expiry check setiap 1 menit |
| `src/router/index.js` | Hapus ~90 `beforeEnter` duplikat, tambah global `router.beforeEach` |
| `src/components/SidebarDashboard.vue` | Migrasi dari `localStorage` ke `tokenStorage` |
| `src/views/login/LoginComponent.vue` | Migrasi dari `localStorage` ke `tokenStorage` |
| `src/util/axios.js` | Diubah menjadi re-export wrapper ke `apiClient` |
| `public/.htaccess` | **[BARU]** SPA routing, CSP, cache control, Gzip |
| `.env.local`, `.env.production` | **[BARU]** Environment variables |

### Aturan penting dari Fase 1:
- **Token** sekarang disimpan di `sessionStorage`, bukan `localStorage`
- **Semua request HTTP** harus menggunakan `apiClient` atau `$api`, bukan `axios` langsung
- **Auth header** otomatis diisi oleh request interceptor di `apiClient`
- **Route protection** dilakukan oleh satu `router.beforeEach` di `router/index.js`

---

## ⚠️ Hal Kritis yang Harus Diketahui

### 1. Jangan Langsung Uninstall Vuex
Vuex masih digunakan oleh `SidebarDashboard.vue` dan `AdminDashboard.vue` via `$store.getters.navigation`. Jangan uninstall Vuex sampai kedua komponen ini sudah dimigrasi ke Pinia.

### 2. eventBus Menggunakan Custom Implementation
`src/util/eventBus.js` saat ini menggunakan anti-pattern (membuat Vue app kedua). Yang **aktif** menggunakan eventBus:
- `SidebarDashboard.vue` — `$on`/`$off` untuk `update-image` event
- `UserMaster.vue` — `$emit` untuk `update-image` event
- Banyak file lain sudah mengkomentari import eventBus (tidak aktif)

### 3. Nama Direktori Mengandung Spasi
Banyak folder di `src/views/` mengandung spasi, misalnya: `walls master`, `menu management`, dll. Ini adalah teknikal debt yang akan dirapikan di Fase 3. **Jangan ubah** nama direktori di Fase 2.

### 4. Global Properties
Tersedia di semua komponen:
- `this.$api` → Axios instance (`apiClient.js`)
- `this.$fileURL` → URL base untuk gambar (`https://admin1.the-gypsy.sg/img/app/`)

### 5. Token Storage API
Gunakan `tokenStorage` (dari `@/util/tokenStorage`) bukan `localStorage`/`sessionStorage` langsung:
```javascript
import { tokenStorage } from '@/util/tokenStorage';
tokenStorage.getToken()        // ambil token
tokenStorage.setToken(value)   // simpan token
tokenStorage.clearAll()        // hapus semua data auth
tokenStorage.isAuthenticated() // cek apakah sudah login
```

---

## 📋 Yang Perlu Dikerjakan di Fase 2

Lihat detail lengkap di [IMPLEMENTATION.md](./IMPLEMENTATION.md).

**Ringkasan singkat Fase 2 (urutan penting):**
1. Install Pinia (JANGAN uninstall Vuex dulu)
2. Buat `src/stores/navigation.js`
3. Migrate `SidebarDashboard.vue` ke Pinia
4. Migrate `AdminDashboard.vue` ke Pinia
5. **Setelah itu baru** uninstall Vuex
6. Install `mitt`, update `eventBus.js`
7. Update `SidebarDashboard.vue` eventBus calls
8. Update `UserMaster.vue` eventBus calls

---

## 🔎 Cara Mencari Sesuatu di Proyek

| Butuh | Command |
|-------|---------|
| Cari semua `$store` | `grep_search "$store" SearchPath: src/` |
| Cari semua `localStorage` | `grep_search "localStorage" SearchPath: src/` |
| Cari semua import `eventBus` | `grep_search "eventBus" SearchPath: src/ MatchPerLine: true` |
| Cek berapa baris sebuah file | `(Get-Content "path").Count` |
| Cek apakah package sudah install | `node -e "require('pinia'); console.log('ok')"` |

---

## 🛠️ Commands Berguna

```powershell
# Jalankan dev server
npm run serve

# Build untuk production (upload ke cPanel)
npm run build

# Install package baru
npm install <nama-package>

# Uninstall package
npm uninstall <nama-package>

# Cek semua dependency
npm list --depth=0
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

## 📂 File yang TIDAK BOLEH Diubah (kecuali ada instruksi eksplisit)

- `src/views/**/*` (semua file view) — kecuali file yang disebutkan di IMPLEMENTATION.md
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
| Tidak rename direktori dengan spasi di Fase 2 | Risiko breaking change pada ratusan import path, defer ke Fase 3 |
| Jalankan Pinia & Vuex paralel sebelum uninstall | Mencegah error komponen saat migrasi bertahap |
| Gunakan Option API bukan Composition API | Project sudah established dengan Options API, migrasi di Fase 3 |
