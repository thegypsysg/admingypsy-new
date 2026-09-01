import { ref, computed } from 'vue';

export function usePagination(fetchFn, options = {}) {
  const {
    initialPageSize = 10,
    initialPage = 1,
    immediate = false,
  } = options;

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
    page.value = 1;
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
