import { createRouter, createWebHistory } from 'vue-router';

// Cek keberadaan data pengguna di localStorage
// const userData = localStorage.getItem('token') == null ? false : true;

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/dashboard/AdminContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'login',
    path: '/auth/login',
    component: () => import('@/views/login/AdminPage.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman login
      if (localStorage.getItem('token') != null) {
        next('/'); // Alihkan ke halaman beranda jika sudah masuk
      } else {
        next(); // Lanjutkan ke halaman login jika belum masuk
      }
    },
  },
  {
    name: 'user master',
    path: '/users',
    component: () => import('@/views/users/UsersContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'app new',
    path: '/app-new',
    component: () => import('@/views/app master/app new/AppNewContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'industry master',
    path: '/industry_master',
    component: () =>
      import('@/views/industry master/industry/IndustryMasterContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'sub industry master',
    path: '/sub_industry_master',
    component: () =>
      import(
        '@/views/industry master/sub industry/SubIndustryMasterContainer.vue'
      ),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'position master',
    path: '/position_master',
    component: () =>
      import('@/views/position master/PositionMasterContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'city master',
    path: '/city-master',
    component: () =>
      import('@/views/manage countries/city master/CityMasterContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'town master',
    path: '/town-master',
    component: () =>
      import('@/views/manage countries/town master/TownMasterContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'country master',
    path: '/country-master',
    component: () =>
      import(
        '@/views/manage countries/country master/CountryMasterContainer.vue'
      ),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'zone master',
    path: '/zone-master',
    component: () =>
      import('@/views/manage countries/zone master/ZoneMasterContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'healthcare settings',
    path: '/healthcare-settings',
    component: () =>
      import(
        '@/views/the syringe/healthcare settings/HealthcareSettingsContainer.vue'
      ),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'skills group',
    path: '/skills-group',
    component: () =>
      import('@/views/skills master/skills group/SkillsGroupContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'primary skills',
    path: '/primary-skills',
    component: () =>
      import('@/views/skills master/primary skills/PrimarySkillsContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'jobs master',
    path: '/jobs-master',
    component: () => import('@/views/job master/JobMasterContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'partner master',
    path: '/partner_master',
    component: () =>
      import('@/views/partner master/PartnerMasterContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'partner master main info',
    path: '/partner_master/main-info/:id',
    component: () =>
      import('@/views/partner master/main info/MainInfoContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'partner master contacts',
    path: '/partner_master/contacts/:id',
    component: () =>
      import('@/views/partner master/contacts/ContactsContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'partner master socials',
    path: '/partner_master/socials/:id',
    component: () =>
      import('@/views/partner master/socials/SocialsContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'partner master locations',
    path: '/partner_master/locations/:id',
    component: () =>
      import('@/views/partner master/locations/LocationsContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },

  {
    name: 'category master',
    path: '/category_master',
    component: () =>
      import('@/views/category master/CategoryMasterContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },
  {
    name: 'brands master',
    path: '/brands_master',
    component: () =>
      import('@/views/category master/brands master/BrandsMasterContainer.vue'),
    beforeEnter: (to, from, next) => {
      // Pengecekan status login sebelum masuk ke halaman beranda
      if (localStorage.getItem('token') == null) {
        next('/auth/login'); // Alihkan ke halaman login jika belum masuk
      } else {
        next(); // Lanjutkan ke halaman beranda jika sudah masuk
      }
    },
  },

  {
    path: '/*', // Rute ini akan menangkap semua rute yang tidak cocok dengan rute lainnya
    redirect: '/', // Alihkan ke halaman dashboard
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
