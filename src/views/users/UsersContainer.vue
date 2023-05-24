<template>
  <v-app id="inspire">
    <sidebar-dashboard :drawer-open="drawer" />
    <header-dashboard @toggle-drawer="toggleDrawer" />
    <v-main>
      <UserMaster />
    </v-main>
  </v-app>
</template>

<script>
import HeaderDashboard from '@/components/HeaderDashboard.vue';
import SidebarDashboard from '@/components/SidebarDashboard.vue';
import UserMaster from './UserMaster.vue';

export default {
  name: 'UsersContainer',
  components: { SidebarDashboard, HeaderDashboard, UserMaster },
  data: () => ({
    drawer: true,
  }),
  // created() {
  //   // Cek keberadaan data pengguna di localStorage
  //   // const userData = localStorage.getItem('token') == null ? false : true;
  //   if (localStorage.getItem('token') != null) {
  //     this.$router.replace('/user'); // Alihkan ke halaman dashboard jika pengguna sudah masuk dan terdapat data pengguna di localStorage
  //   } else {
  //     this.$router.replace('/auth/login');
  //   }
  // },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style lang="scss">
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome.scss';
</style>
