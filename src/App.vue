<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <global-notification />
  </v-app>
</template>

<script>
import jwtDecode from 'jwt-decode';
import { tokenStorage } from '@/util/tokenStorage';
import GlobalNotification from '@/components/GlobalNotification.vue';

export default {
  name: 'App',

  components: {
    GlobalNotification,
  },

  data: () => ({
    tokenCheckInterval: null,
  }),

  mounted() {
    // Cek token saat pertama kali load
    this.checkTokenExpiry();

    // Cek token setiap 1 menit (60.000 ms)
    // Ini mendeteksi token yang expired saat user sedang aktif
    this.tokenCheckInterval = setInterval(this.checkTokenExpiry, 60 * 1000);
  },

  beforeUnmount() {
    // Bersihkan interval saat komponen di-unmount untuk mencegah memory leak
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  },

  methods: {
    checkTokenExpiry() {
      const token = tokenStorage.getToken();

      // Jika tidak ada token, tidak perlu dicek
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token expired — bersihkan semua data dan redirect ke login
          tokenStorage.clearAll();

          // Redirect hanya jika belum di halaman login
          if (this.$route && this.$route.name !== 'login') {
            this.$router.push({ name: 'login' });
          }
        }
      } catch {
        // Token malformed atau tidak bisa di-decode
        // Anggap tidak valid — clear dan redirect
        tokenStorage.clearAll();

        if (this.$route && this.$route.name !== 'login') {
          this.$router.push({ name: 'login' });
        }
      }
    },
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
