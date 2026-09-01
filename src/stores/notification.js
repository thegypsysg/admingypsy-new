import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    show: false,
    message: '',
    color: 'success',
    timeout: 3000,
  }),

  actions: {
    _show(message, color, timeout = 3000) {
      this.message = message;
      this.color = color;
      this.timeout = timeout;
      this.show = true;
    },

    success(message, timeout = 3000) {
      this._show(message, 'success', timeout);
    },

    error(message, timeout = 4000) {
      this._show(message, 'error', timeout);
    },

    warning(message, timeout = 3500) {
      this._show(message, 'warning', timeout);
    },

    info(message, timeout = 3000) {
      this._show(message, 'info', timeout);
    },

    hide() {
      this.show = false;
    },
  },
});
