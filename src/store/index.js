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
              { title: 'Transitions' },
              { title: 'Components' },
              { title: 'Slots' },
            ],
          },
          {
            title: 'Manage Countries',
            open: false,
            subnav: [{ title: 'Nesting' }, { title: 'Mixins' }],
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
