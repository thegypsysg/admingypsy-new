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
