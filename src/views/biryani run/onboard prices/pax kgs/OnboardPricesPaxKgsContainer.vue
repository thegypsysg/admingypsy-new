<template>
  <v-app id="inspire">
    <sidebar-dashboard :drawer-open="drawer" />
    <header-dashboard @toggle-drawer="toggleDrawer" />
    <v-main>
      <OnboardPricesPaxKgs />
    </v-main>
  </v-app>
</template>

<script>
import HeaderDashboard from '@/components/HeaderDashboard.vue';
import SidebarDashboard from '@/components/SidebarDashboard.vue';
import OnboardPricesPaxKgs from './OnboardPricesPaxKgs.vue';

export default {
  name: 'OnboardPricesPaxKgsContainer',
  components: { SidebarDashboard, HeaderDashboard, OnboardPricesPaxKgs },
  data: () => ({
    drawer: true,
  }),
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
