/**
 * navigation.js — Pinia Store
 *
 * Menggantikan Vuex navigation state.
 * Digunakan oleh SidebarDashboard.vue dan AdminDashboard.vue
 * untuk mendapatkan daftar menu navigasi sidebar.
 */

import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    navigation: [
      {
        title: 'Masters',
        open: false,
        subnav: [
          { title: 'Users', path: '/users' },
          {
            title: 'Gypsy Registrations',
            open: false,
            subnav: [
              { title: 'Invite Users', path: '/invite_users' },
              { title: 'Registered Users', path: '/registered_users' },
            ],
          },
          {
            title: 'App Master',
            open: false,
            subnav: [
              { title: 'App - New', path: '/app-new' },
              { title: 'App - Country & City', path: '/app-country' },
              { title: 'App - Socials', path: '/app-socials' },
            ],
          },
          {
            title: 'Partner Master',
            path: '/partner_master',
          },
          {
            title: 'Inquiry Master',
            path: '/inquiry-master',
          },
          {
            title: 'On-Board Merchants',
            path: '/onboard-merchant',
          },
          {
            title: 'Restaurant Master',
            path: '/restaurant-master',
          },
          {
            title: 'Menu Management',
            path: '/menu-management',
          },
          {
            title: 'Dish Master',
            path: '/dish-master',
          },
          {
            title: 'Industry Master',
            path: '/industry_master',
          },
          {
            title: 'Position Master',
            path: '/position_master',
          },
          {
            title: 'Skills Master',
            path: '/skills-group',
          },
          {
            title: 'Category Master',
            path: '/category_master',
          },
          {
            title: 'Product Master',
            path: '/product_master',
          },
          {
            title: 'Cart Master',
            path: '/cart_master',
          },
          {
            title: 'Price List Master',
            path: '/price_list_master',
          },
          {
            title: 'Jobs Master',
            path: '/jobs-master',
          },
          {
            title: 'Application Master',
            path: '/application-master',
          },
          {
            title: 'Applicant Master',
            path: '/applicant-master',
          },
          {
            title: 'Qualification Master',
            path: '/qualification_master',
          },
          {
            title: 'Manage Countries',
            path: '/country-master',
          },
          {
            title: 'Manage Emails',
            path: '/email-master',
          },
          {
            title: 'Address Master',
            path: '/address-master',
          },
          {
            title: 'Platform Fee',
            path: '/platform-fee',
          },
          {
            title: 'GST',
            path: '/gst-master',
          },
          {
            title: 'Delivery Charges',
            path: '/delivery-charges',
          },
        ],
      },
      {
        title: 'Inquiries',
        open: false,
        subnav: [{ title: 'Websites' }, { title: 'Open Source' }],
      },
    ],
  }),

  getters: {
    getNavigation: (state) => state.navigation,
  },
});
