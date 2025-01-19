<template>
  <v-app id="inspire">
    <sidebar-dashboard :drawer-open="drawer" />
    <header-dashboard @toggle-drawer="toggleDrawer" />
    <v-main>
      <AgentMaster />
    </v-main>
  </v-app>
</template>

<script>
import HeaderDashboard from '@/components/HeaderDashboard.vue';
import SidebarDashboard from '@/components/SidebarDashboard.vue';
import AgentMaster from './AgentMaster.vue';

export default {
  name: 'AgentMasterContainer',
  components: { SidebarDashboard, HeaderDashboard, AgentMaster },
  data: () => ({
    drawer: true,
  }),
  // created() {
  //   // Cek keberadaan data pengguna di localStorage
  //   // const CountryData = localStorage.getItem('token') == null ? false : true;
  //   if (localStorage.getItem('token') != null) {
  //     this.$router.replace('/Country'); // Alihkan ke halaman dashboard jika pengguna sudah masuk dan terdapat data pengguna di localStorage
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
./AgentMaster.vue./AgentMaster.vue
