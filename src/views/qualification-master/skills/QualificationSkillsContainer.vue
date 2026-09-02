<template>
  <v-app id="inspire">
    <sidebar-dashboard :drawer-open="drawer" />
    <header-dashboard @toggle-drawer="toggleDrawer" />
    <v-main>
      <QualificationSkills />
    </v-main>
  </v-app>
</template>

<script>
import HeaderDashboard from '@/components/HeaderDashboard.vue';
import SidebarDashboard from '@/components/SidebarDashboard.vue';
import QualificationSkills from './QualificationSkills.vue';

export default {
  name: 'QualificationSkillsContainer',
  components: { SidebarDashboard, HeaderDashboard, QualificationSkills },
  data: () => ({
    drawer: true,
  }),
  // created() {
  //   // Cek keberadaan data pengguna di localStorage
  //   // const ZoneData = localStorage.getItem('token') == null ? false : true;
  //   if (localStorage.getItem('token') != null) {
  //     this.$router.replace('/Zone'); // Alihkan ke halaman dashboard jika pengguna sudah masuk dan terdapat data pengguna di localStorage
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
