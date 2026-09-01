<!-- src/components/ConfirmDialog.vue -->
<!-- 
  CARA PENGGUNAAN DI VIEW (opsional):
  
  <confirm-dialog
    v-model="isDeleteOpen"
    title="Delete Item"
    message="Are you sure you want to delete this item?"
    confirm-text="Delete"
    confirm-color="error"
    @confirm="handleDelete"
  />
-->
<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
    :width="width"
  >
    <v-card rounded="lg">
      <v-card-title class="text-h6 pt-5 px-6">
        <v-icon v-if="icon" :color="confirmColor" class="mr-2">{{ icon }}</v-icon>
        {{ title }}
      </v-card-title>

      <v-card-text class="px-6 pb-2 text-body-2">
        {{ message }}
      </v-card-text>

      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn
          variant="text"
          style="text-transform: none"
          @click="onCancel"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="confirmColor"
          variant="flat"
          style="text-transform: none"
          :loading="loading"
          @click="onConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Confirmation' },
  message: { type: String, default: 'Are you sure you want to proceed?' },
  confirmText: { type: String, default: 'Yes' },
  cancelText: { type: String, default: 'Cancel' },
  confirmColor: { type: String, default: 'error' },
  icon: { type: String, default: 'mdi-alert-circle-outline' },
  width: { type: [String, Number], default: 420 },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const onConfirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};

const onCancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};
</script>
