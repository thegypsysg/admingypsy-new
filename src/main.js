import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import "maz-ui/css/main.css";
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import "/node_modules/flag-icons/css/flag-icons.min.css";

import store from './store';
import axios from 'axios';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

/// ===== LOCAL DEV
const BASE_API_PATH = 'https://adminsymphinite.symphinite.tech/api/';

var axiosAbsensi = axios.create({
  baseURL: BASE_API_PATH,
});

axiosAbsensi.defaults.baseURL = BASE_API_PATH;
axiosAbsensi.defaults.timeout = 180000;
axiosAbsensi.defaults.headers.post['Accept'] = 'application/json';
axiosAbsensi.defaults.headers.common['Authorization'] =
  localStorage.getItem('token') || '';
axiosAbsensi.defaults.headers.common['LoginTime'] =
  localStorage.getItem('loginTime') || '';

axiosAbsensi.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // console.log(error.response);

    if (error.response && error.response.status == 401) {
      axiosAbsensi.defaults.headers.common['Authorization'] = '';
      // var version = localStorage.getItem('version');
      localStorage.clear();
      // localStorage.setItem('version', version);

      router.push('/auth/login');
    }
    // else if (error.response && error.response.status == 402) {
    //   axiosAbsensi.defaults.headers.common['Authorization'] = '';
    //   // version = localStorage.getItem('version');
    //   localStorage.clear();
    //   // localStorage.setItem('version', version);

    //   router.push('/login?error=true');
    // }

    return Promise.reject(error);
  }
);

// Vue.prototype.$axios = axiosAbsensi;

loadFonts();

const app = createApp(App);
app.config.globalProperties.$fileURL = 'https://admin1.the-gypsy.sg/img/app/';
app.use(router).use(store).use(vuetify).mount('#app');
