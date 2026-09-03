import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'maz-ui/css/main.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import 'flag-icons/css/flag-icons.min.css';

import { createPinia } from 'pinia';
import apiClient from './util/apiClient';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import AppBreadcrumb from './components/AppBreadcrumb.vue';

loadFonts();

const app = createApp(App);
const pinia = createPinia();

// Global properties
app.config.globalProperties.$api = apiClient;
app.config.globalProperties.$fileURL = import.meta.env.VITE_FILE_URL;

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error]', err);
  console.error('[Vue Error Info]', info);
  console.error('[Vue Error Component]', instance?.$options?.name || 'Unknown');
};

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason);
});

app.component('VueDatePicker', VueDatePicker);
app.component('AppBreadcrumb', AppBreadcrumb);
app.use(router).use(pinia).use(vuetify).mount('#app');
