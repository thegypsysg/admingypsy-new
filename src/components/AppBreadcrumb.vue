<template>
  <v-breadcrumbs :items="formattedItems" class="px-0 py-1 mb-2" density="compact">
    <template v-slot:divider>
      <v-icon size="small">mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: 'AppBreadcrumb',
  props: {
    items: {
      type: Array,
      required: true,
      // Format: [{ title: 'Dashboard', to: '/' }, { title: 'Cart Master', to: null }]
    },
  },
  computed: {
    formattedItems() {
      if (!Array.isArray(this.items)) return [];
      return this.items.map((item, index) => {
        const isLast = index === this.items.length - 1;
        return {
          title: item.title,
          to: isLast ? undefined : item.to || undefined,
          disabled: isLast,
        };
      });
    },
  },
};
</script>

<style scoped>
:deep(.v-breadcrumbs-item--link) {
  color: #1976d2 !important;
  font-weight: 500;
}
:deep(.v-breadcrumbs-item--disabled) {
  color: rgba(0, 0, 0, 0.75) !important;
  font-weight: 500;
  opacity: 1 !important;
}
</style>
