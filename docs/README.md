# 📖 AdminGypsy — Project Documentation for AI Agent

> **Dokumen ini ditujukan untuk:** Model AI (Gemini) yang akan mengerjakan task di proyek ini.
> **Baca dokumen ini sebelum menyentuh kode apapun.**

---

## 🗂️ Daftar Dokumen Penting

| File | Lokasi | Isi |
|------|--------|-----|
| `ANALYSIS.md` | `/ANALYSIS.md` | Analisis lengkap masalah & rekomendasi |
| `IMPLEMENTATION.md` | `/docs/IMPLEMENTATION.md` | Rencana implementasi detail Fase 1 |
| `README.md` (ini) | `/docs/README.md` | Panduan umum untuk AI agent |

---

## 🏗️ Overview Proyek

**AdminGypsy** adalah aplikasi **admin panel** untuk platform The Gypsy SG. Dashboard ini mengelola berbagai entitas bisnis: restoran, menu, pesanan, merchant, properti, dan lainnya.

### Informasi Teknis

| Aspek | Detail |
|-------|--------|
| **Framework** | Vue 3 (Options API) |
| **Build Tool** | Vue CLI 5 (Webpack) |
| **UI Library** | Vuetify 3 |
| **State Management** | Vuex 4 |
| **Router** | Vue Router 4 |
| **HTTP Client** | Axios |
| **Deployment** | cPanel Shared Hosting |
| **Auth** | JWT Token |

---

## 📁 Struktur Proyek

```
admingypsy-new/
├── src/
│   ├── App.vue                    # Root component — token expiry check
│   ├── main.js                    # Entry point — Axios config (BERMASALAH, lihat ANALYSIS.md)
│   ├── assets/                    # Static assets (logo, gambar)
│   ├── components/                # Shared components
│   │   ├── AdminDashboard.vue     # Layout wrapper utama
│   │   ├── Dropdown.vue           # Dropdown navigasi sidebar
│   │   ├── HeaderDashboard.vue    # Header bar
│   │   ├── HeaderWallMaster.vue   # Header alternatif
│   │   ├── ImageCropper.vue       # Cropper gambar
│   │   ├── ImageMultiUpload.vue   # Upload multi gambar
│   │   ├── ImageUpload.vue        # Upload single gambar (ada BUG)
│   │   ├── SidebarDashboard.vue   # Sidebar navigasi
│   │   └── VideoUpload.vue        # Upload video
│   ├── plugins/
│   │   ├── vuetify.js             # Konfigurasi Vuetify
│   │   └── webfontloader.js       # Load Google Fonts
│   ├── router/
│   │   └── index.js               # Router (1.635 baris — PERLU REFACTOR)
│   ├── store/
│   │   └── index.js               # Vuex store (tidak dimanfaatkan optimal)
│   ├── util/
│   │   ├── axios.js               # Axios instance KEDUA (akan DIHAPUS)
│   │   └── eventBus.js            # Event bus (anti-pattern, akan DIGANTI)
│   └── views/                     # 35+ direktori view (nama ada spasi — bermasalah)
│       ├── dashboard/
│       ├── login/
│       ├── users/
│       ├── menu management/       # ← spasi di nama direktori
│       ├── restaurant master/     # ← spasi di nama direktori
│       └── ... (35+ direktori)
├── public/
│   └── index.html
├── docs/
│   ├── README.md                  # File ini
│   └── IMPLEMENTATION.md          # Rencana implementasi Fase 1
├── ANALYSIS.md                    # Analisis masalah
├── package.json
├── vue.config.js
└── .eslintrc.js
```

---

## ⚠️ Masalah Utama yang Sudah Diidentifikasi

> Baca `ANALYSIS.md` untuk detail lengkap. Berikut ringkasan cepat:

### 🔴 Kritikal (Segera Tangani)

1. **Dua Axios instance** berjalan paralel dengan URL berbeda:
   - `main.js` baris 22–60 → instance `axiosAbsensi`
   - `src/util/axios.js` → instance kedua
   - **Solusi:** Hapus keduanya, buat satu `src/util/apiClient.js`

2. **Token disimpan di `localStorage`** — rentan XSS.
   - **Solusi:** Migrasi ke `sessionStorage` + buat abstraksi `tokenStorage.js`

3. **Route guard copy-paste 90+ kali** di `router/index.js`:
   - Setiap route punya `beforeEnter` identik
   - **Solusi:** Gunakan satu global `router.beforeEach()`

4. **Token expiry check di `App.vue` tidak redirect** ke login setelah clear localStorage.

### 🟠 Tinggi (Setelah Fase 1 Selesai)

5. Vuex tidak dimanfaatkan → semua state user dibaca dari localStorage di tiap komponen
6. EventBus menggunakan `createApp({})` kedua (anti-pattern)
7. Nama direktori view menggunakan spasi (35+ direktori)

---

## 🔑 Hal Penting yang Harus Diketahui

### 1. Cara Kerja Auth Saat Ini

```
User login → API response (token + user data)
           → Token disimpan di localStorage['token']
           → Data user disimpan di localStorage (name, role, image, loginTime)
           → Header Authorization diset SEKALI di main.js saat load
           → SidebarDashboard.vue membaca langsung dari localStorage
```

**Yang salah:** Token diset ke Axios header hanya sekali saat `main.js` diload, bukan per-request.

### 2. URL API yang Digunakan

Proyek ini memiliki **dua URL API** yang berbeda — ini adalah bug:
- `main.js` line 20: `https://adminsymphinite.symphinite.tech/api/`
- `util/axios.js` line 5: `https://admin1.the-gypsy.sg/api`

**Setelah perbaikan:** Hanya ada satu URL dari environment variable.

### 3. Deployment ke cPanel

- Build Vue CLI menggunakan `npm run build` → folder `dist/`
- Upload folder `dist/` ke `public_html` di cPanel
- File `.env.production` diproses **saat build** (bukan runtime)
- Server cPanel tidak perlu dikonfigurasi apapun untuk env variable
- Pastikan ada `.htaccess` di server untuk SPA routing

### 4. File yang TIDAK Boleh Diubah Saat Fase 1

Kecuali disebutkan di `IMPLEMENTATION.md`, **jangan ubah** file-file berikut:
- Semua file di `src/views/` (views individual)
- `src/components/ImageUpload.vue` (bugfix di Fase 3)
- `src/store/index.js` (migrasi ke Pinia di Fase 2)
- `src/plugins/`

---

## 📋 Status Pekerjaan

### ✅ Sudah Selesai
- Analisis kode (`ANALYSIS.md`)
- Dokumentasi proyek (`docs/README.md`)
- Rencana implementasi Fase 1 (`docs/IMPLEMENTATION.md`)

### 🔄 Sedang Dikerjakan
- Fase 1: Security Hardening (lihat `docs/IMPLEMENTATION.md`)

### ⏳ Antrian
- Fase 2: Architecture Upgrade
- Fase 3: Code Quality & Performance

---

## 🚦 Panduan untuk AI Agent

### Sebelum Mulai Mengerjakan Task

1. **Baca `IMPLEMENTATION.md`** secara lengkap untuk memahami task yang diminta
2. **Cek status task** di bagian checklist `IMPLEMENTATION.md` — lihat mana yang sudah `[x]` (selesai) dan mana yang masih `[ ]`
3. **Jangan skip task** — task diurutkan berdasarkan dependency (task 1 adalah fondasi untuk task berikutnya)
4. **Verifikasi sebelum edit** — baca file yang akan diubah terlebih dahulu menggunakan tool `view_file`

### Konvensi Kode Proyek

- **Bahasa variabel/komentar:** Campuran (ada Indonesia, ada Inggris) — ikuti konteks file yang sedang diedit
- **Style:** Mengikuti Vue Options API (sampai Fase 2 selesai)
- **Indentasi:** 2 spasi
- **Quotes:** Single quotes untuk JavaScript
- **ESLint:** Konfigurasi di `.eslintrc.js` — ikuti aturannya

### Pola Import yang Digunakan

```javascript
// Alias @ merujuk ke src/
import Something from '@/components/Something.vue';
import { tokenStorage } from '@/util/tokenStorage';

// Path relatif juga valid untuk file dalam folder yang sama
import Dropdown from './Dropdown.vue';
```

### Cara Test Perubahan

1. Server dev sudah berjalan: `npm run serve` (port default 8080)
2. Buka browser ke `http://localhost:8080`
3. Cek console browser untuk error
4. Test login, navigasi, dan logout
5. **Jangan jalankan** `npm run build` kecuali diminta — gunakan `npm run serve` untuk development

### Jika Menemukan Masalah

- Jika menemukan kode yang tidak sesuai dengan deskripsi di `IMPLEMENTATION.md`, **prioritaskan kode aktual** di file
- Jika ada dependency yang hilang, cek `package.json` dan install jika diperlukan
- Jika ada konflik, **tanyakan ke user** jangan asumsikan

---

## 🔗 Referensi Cepat

| Topik | Lokasi |
|-------|--------|
| Konfigurasi Axios saat ini | `src/main.js` baris 22–60 |
| Instance Axios kedua | `src/util/axios.js` |
| Router (1.635 baris) | `src/router/index.js` |
| Vuex Store | `src/store/index.js` |
| Sidebar (baca localStorage) | `src/components/SidebarDashboard.vue` |
| Token check (tidak complete) | `src/App.vue` baris 18–41 |
| Login view | `src/views/login/AdminPage.vue` |
| Dashboard container | `src/views/dashboard/AdminContainer.vue` |

---

*Dokumen ini adalah panduan hidup — perbarui jika ada perubahan signifikan pada struktur proyek.*
