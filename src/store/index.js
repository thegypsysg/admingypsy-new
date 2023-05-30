import { createStore } from 'vuex';

export default createStore({
  state: {
    navigation: [
      {
        title: 'Masters',
        open: false,
        subnav: [
          { title: 'Users', path: '/users' },
          {
            title: 'App Master',
            open: false,
            subnav: [
              { title: 'App - New', path: '/app-new' },
              { title: 'App - Country', path: '/app-country' },
              { title: 'App - City', path: '/app-city' },
              { title: 'App - Socials', path: '/app-socials' },
            ],
          },
          {
            title: 'Manage Countries',
            path: '/country-master',
          },
        ],
      },
      {
        title: 'Inquiries',
        open: false,
        subnav: [{ title: 'Websites' }, { title: 'Open Source' }],
      },
    ],
  },
  getters: {
    navigation: (state) => {
      return state.navigation;
    },
  },
  mutations: {},
  actions: {},
  modules: {},
});
