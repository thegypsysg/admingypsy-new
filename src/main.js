import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'maz-ui/css/main.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import '/node_modules/flag-icons/css/flag-icons.min.css';

import store from './store';
import apiClient from './util/apiClient';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

loadFonts();

const app = createApp(App);

// Global properties
app.config.globalProperties.$api = apiClient;
app.config.globalProperties.$fileURL = process.env.VUE_APP_FILE_URL;

app.component('VueDatePicker', VueDatePicker);
app.use(router).use(store).use(vuetify).mount('#app');
