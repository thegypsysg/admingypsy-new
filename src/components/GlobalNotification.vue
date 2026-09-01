<template>
  <v-snackbar
    v-model="notification.show"
    :color="notification.color"
    :timeout="notification.timeout"
    location="top right"
    rounded="lg"
    elevation="4"
    min-width="280"
  >
    <div class="d-flex align-center gap-2">
      <v-icon v-if="snackbarIcon" size="20" class="mr-2">{{ snackbarIcon }}</v-icon>
      <span>{{ notification.message }}</span>
    </div>

    <template v-slot:actions>
      <v-btn
        icon
        variant="text"
        size="small"
        @click="notification.hide()"
      >
        <v-icon size="18">mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue';
import { useNotificationStore } from '@/stores/notification';

const notification = useNotificationStore();

const snackbarIcon = computed(() => {
  const icons = {
    success: 'mdi-check-circle-outline',
    error: 'mdi-alert-circle-outline',
    warning: 'mdi-alert-outline',
    info: 'mdi-information-outline',
  };
  return icons[notification.color] || null;
});
</script>
