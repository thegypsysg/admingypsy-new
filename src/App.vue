<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import jwtDecode from 'jwt-decode';

export default {
  name: 'App',

  data: () => ({
    //
  }),
  mounted() {
    // if (localStorage.getItem('token') == null) {
    //   this.$router.replace('/auth/login');
    // } else {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        localStorage.clear();
        // console.log(decodedToken.exp, currentTime);
        // console.log(decodedToken.exp < currentTime);
        // console.log('TOKEN EXPIRED');
      }
      // else {
      // console.log(decodedToken.exp, currentTime);
      // console.log(decodedToken.exp < currentTime);
      // console.log('TOKEN TIDAK EXPIRED');
      // }
    }
  },
};
</script>

<style lang="scss">
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome.scss';

.image-upload-cont {
  width: 70px;
  height: 40px;
  overflow: hidden;
  border: 1px solid grey;
}

.image-upload-item {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
