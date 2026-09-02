<template>
  <v-app id="inspire">
    <sidebar-dashboard :drawer-open="drawer" />
    <header-dashboard @toggle-drawer="toggleDrawer" />
    <v-main>
      <TownMaster />
    </v-main>
  </v-app>
</template>

<script>
import HeaderDashboard from '@/components/HeaderDashboard.vue';
import SidebarDashboard from '@/components/SidebarDashboard.vue';
import TownMaster from './TownMaster.vue';

export default {
  name: 'TownMasterContainer',
  components: { SidebarDashboard, HeaderDashboard, TownMaster },
  data: () => ({
    drawer: true,
  }),
  // created() {
  //   // Cek keberadaan data pengguna di localStorage
  //   // const TownData = localStorage.getItem('token') == null ? false : true;
  //   if (localStorage.getItem('token') != null) {
  //     this.$router.replace('/Town'); // Alihkan ke halaman dashboard jika pengguna sudah masuk dan terdapat data pengguna di localStorage
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
