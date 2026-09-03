/**
 * src/util/sanitize.js
 *
 * Utility untuk sanitasi konten HTML sebelum di-render via v-html.
 * Menggunakan DOMPurify untuk mencegah XSS (Cross-Site Scripting).
 *
 * CARA PENGGUNAAN:
 *   import { sanitizeHtml } from '@/util/sanitize';
 *
 *   // Di method yang mengembalikan HTML untuk v-html:
 *   someMethod(rawValue) {
 *     const processed = rawValue.replace(/\n/g, '<br>');
 *     return sanitizeHtml(processed);
 *   }
 */

import DOMPurify from 'dompurify';

/**
 * Konfigurasi DOMPurify:
 * - ALLOWED_TAGS: Tag HTML yang boleh dipertahankan setelah sanitasi
 *   (hanya tag presentasional yang aman — tidak ada tag yang bisa eksekusi script)
 * - ALLOWED_ATTR: Atribut HTML yang boleh dipertahankan
 *   (kosong = tidak ada atribut yang diizinkan, termasuk 'style' dan event handler)
 * - FORCE_BODY: Pastikan output selalu dalam konteks body element
 *
 * Tag yang SELALU diblok DOMPurify meski tidak disebutkan:
 *   <script>, <iframe>, <object>, <embed>, <form>, event handler (onclick, onload, dll.)
 */
const PURIFY_CONFIG = {
  ALLOWED_TAGS: ['br', 'b', 'i', 'em', 'strong', 'span', 'p', 'u'],
  ALLOWED_ATTR: [],
  FORCE_BODY: true,
};

/**
 * Sanitasi string HTML untuk digunakan bersama v-html directive.
 * Memblok semua tag dan atribut berbahaya (XSS vectors).
 *
 * @param {string|null|undefined} html - String HTML mentah (bisa dari API/user input)
 * @returns {string} String HTML yang sudah aman dari XSS
 *
 * @example
 * sanitizeHtml('<b>Hello</b><script>alert("xss")</script>')
 * // Returns: '<b>Hello</b>'
 *
 * sanitizeHtml('<br>Line 2')
 * // Returns: '<br>Line 2'  (br dipertahankan karena ada di ALLOWED_TAGS)
 *
 * sanitizeHtml(null)
 * // Returns: ''
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  return DOMPurify.sanitize(String(html), PURIFY_CONFIG);
}
