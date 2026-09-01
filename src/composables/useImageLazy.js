import { computed } from 'vue';

export function useImageLazy(options = {}) {
  const {
    thumbnailHeight = '50px',
    thumbnailWidth = '50px',
    useSvgPlaceholder = true,
  } = options;

  /**
   * SVG placeholder berukuran 1x1 piksel sebagai lazy-src default.
   */
  const placeholderSrc = computed(() => {
    if (useSvgPlaceholder) {
      return (
        'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%221%22 height%3D%221%22%3E%3C/svg%3E'
      );
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
