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
