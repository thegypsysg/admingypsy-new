<!-- src/components/SkeletonTable.vue -->
<!--
  CARA PENGGUNAAN DI VIEW (opsional, tidak wajib):
  
  import SkeletonTable from '@/components/SkeletonTable.vue';
  components: { SkeletonTable },
  
  Di template:
  <skeleton-table v-if="isLoading" :rows="8" :columns="4" />
  
  <v-data-table
    v-else
    :items="items"
    ...
  />
-->
<template>
  <v-table class="skeleton-table">
    <!-- Header Skeleton -->
    <thead>
      <tr>
        <th
          v-for="(col, index) in normalizedColumns"
          :key="index"
          class="text-left py-3"
        >
          <div class="skeleton-shimmer skeleton-header" />
        </th>
      </tr>
    </thead>

    <!-- Body Skeleton Rows -->
    <tbody>
      <tr v-for="row in rows" :key="row">
        <td
          v-for="(col, colIndex) in normalizedColumns"
          :key="colIndex"
          class="py-3"
        >
          <!-- Kolom pertama opsional thumbnail -->
          <div v-if="colIndex === 0 && showThumbnail" class="d-flex align-center">
            <div class="skeleton-shimmer skeleton-avatar mr-3" />
            <div
              class="skeleton-shimmer skeleton-text"
              :style="{ width: `${getRandomWidth(80, 140)}px` }"
            />
          </div>
          <!-- Kolom teks biasa -->
          <div
            v-else
            class="skeleton-shimmer skeleton-text"
            :style="{ width: `${getRandomWidth(60, 160)}px` }"
          />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  /**
   * Jumlah baris skeleton yang ditampilkan
   */
  rows: {
    type: Number,
    default: 5,
  },
  /**
   * Jumlah kolom (Number) atau array nama kolom (String[])
   */
  columns: {
    type: [Number, Array],
    default: 4,
  },
  /**
   * Tampilkan thumbnail avatar di kolom pertama
   */
  showThumbnail: {
    type: Boolean,
    default: false,
  },
});

/**
 * Normalisasi prop columns menjadi array
 */
const normalizedColumns = computed(() => {
  if (Array.isArray(props.columns)) {
    return props.columns;
  }
  return Array.from({ length: props.columns }, (_, i) => `col-${i}`);
});

/**
 * Lebar acak untuk membuat skeleton terlihat lebih natural
 */
const getRandomWidth = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
</script>

<style scoped>
.skeleton-table {
  table-layout: fixed;
  width: 100%;
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.12) 37%,
    rgba(0, 0, 0, 0.06) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

.skeleton-text {
  height: 14px;
  max-width: 100%;
}

.skeleton-header {
  width: 80px;
  height: 16px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  flex-shrink: 0;
}
</style>
