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
