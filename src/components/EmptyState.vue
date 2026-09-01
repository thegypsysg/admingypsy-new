<!-- src/components/EmptyState.vue -->
<!--
  CARA PENGGUNAAN DI VIEW (opsional):
  
  <empty-state
    v-if="!isLoading && items.length === 0"
    title="No Data Found"
    subtitle="There are no records to display."
  />
-->
<template>
  <div class="empty-state d-flex flex-column align-center justify-center py-12 px-4">
    <v-icon
      :size="iconSize"
      :color="iconColor"
      class="mb-4 empty-state__icon"
    >
      {{ icon }}
    </v-icon>

    <p class="text-h6 font-weight-medium text-medium-emphasis mb-1">
      {{ title }}
    </p>

    <p class="text-body-2 text-disabled text-center" style="max-width: 320px">
      {{ subtitle }}
    </p>

    <v-btn
      v-if="actionLabel"
      :color="actionColor"
      variant="tonal"
      class="mt-5"
      style="text-transform: none"
      @click="$emit('action')"
    >
      <v-icon start>{{ actionIcon }}</v-icon>
      {{ actionLabel }}
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'mdi-database-off-outline' },
  iconSize: { type: [String, Number], default: 72 },
  iconColor: { type: String, default: 'grey-lighten-2' },
  title: { type: String, default: 'No Data Found' },
  subtitle: { type: String, default: 'There are no records to display.' },
  actionLabel: { type: String, default: '' },
  actionIcon: { type: String, default: 'mdi-plus' },
  actionColor: { type: String, default: 'primary' },
});

defineEmits(['action']);
</script>

<style scoped>
.empty-state__icon {
  opacity: 0.5;
}
</style>
