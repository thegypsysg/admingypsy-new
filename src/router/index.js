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
    name: 'invite users',
    path: '/invite_users',
    component: () => import('@/views/registration/invite/InviteContainer.vue'),
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
    name: 'registered users',
    path: '/registered_users',
    component: () =>
      import('@/views/registration/registered/RegisteredContainer.vue'),
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
    name: 'primary skills regurable association',
    path: '/primary-skills/regu-assoc/:id',
    component: () =>
      import(
        '@/views/skills master/primary skills/regu assoc/ReguAssocContainer.vue'
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
    name: 'primary skills regurable association',
    path: '/primary-skills/country/:id',
    component: () =>
      import(
        '@/views/skills master/primary skills/country/CountryContainer.vue'
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
    name: 'jobs master detail',
    path: '/jobs-master/:id',
    component: () =>
      import('@/views/job master/detail/JobMasterDetailContainer.vue'),
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
    name: 'jobs master description',
    path: '/jobs-master/desc/:id',
    component: () =>
      import('@/views/job master/description/JobMasterDescContainer.vue'),
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
    name: 'jobs master country',
    path: '/jobs-master/show-in-country/:id',
    component: () => import('@/views/job master/country/CountryContainer.vue'),
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
    name: 'Application master',
    path: '/application-master',
    component: () => import('@/views/application master/ApplicationMasterContainer.vue'),
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
    name: 'Applicant master',
    path: '/applicant-master',
    component: () => import('@/views/applicant master/ApplicantMasterContainer.vue'),
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
    name: 'product master',
    path: '/product_master',
    component: () =>
      import('@/views/product master/ProductMasterContainer.vue'),
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
    name: 'product range',
    path: '/product_range/:id',
    component: () =>
      import('@/views/product master/range/ProductRangeContainer.vue'),
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
    name: 'quantity master',
    path: '/quantity_master',
    component: () =>
      import('@/views/quantity master/QuantityMasterContainer.vue'),
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
    name: 'qualification master',
    path: '/qualification_master',
    component: () =>
      import('@/views/qualification master/QualificationMasterContainer.vue'),
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
    name: 'qualification master skills',
    path: '/qualification_master/skills/:id',
    component: () =>
      import(
        '@/views/qualification master/skills/QualificationSkillsContainer.vue'
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
    name: 'course master',
    path: '/course_master',
    component: () => import('@/views/course master/CourseMasterContainer.vue'),
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
    name: 'university master',
    path: '/university_master',
    component: () => import('@/views/course master/university/UniversityMasterContainer.vue'),
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
    name: 'course master registrable',
    path: '/course_master/registrable/:id',
    component: () =>
      import(
        '@/views/course master/registrable/CourseRegistrableContainer.vue'
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
    name: 'mall master',
    path: '/mall_master',
    component: () => import('@/views/mall master/MallMasterContainer.vue'),
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
    name: 'merchants master',
    path: '/merchants_master',
    component: () =>
      import('@/views/mall master/merchants/MerchantsMasterContainer.vue'),
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
