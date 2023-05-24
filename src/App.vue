<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
  created() {
    // Cek keberadaan data pengguna di localStorage
    // const userData = localStorage.getItem('token') == null ? false : true;
    if (localStorage.getItem('token') != null) {
      this.$router.replace('/'); // Alihkan ke halaman dashboard jika pengguna sudah masuk dan terdapat data pengguna di localStorage
    } else {
      this.$router.replace('/auth/login');
    }
  },
};
</script>

<style lang="scss">
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome.scss';
</style>
