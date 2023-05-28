<template>
  <div class="d-flex align-center" :class="{ 'login-container': !isSmall }">
    <v-container fluid>
      <v-row class="d-flex align-center justify-end">
        <v-col :cols="isSmall ? '12' : '6'">
          <v-card
            :elevation="!isSmall ? 1 : 0"
            :max-width="isSmall ? `${screenWidth - 30}px` : '450'"
            class="mx-auto"
            :class="{ 'py-4 px-12': !isSmall, 'py-10 px-2': isSmall }"
          >
            <h1 class="mb-4">Welcome</h1>

            <v-form @submit.prevent="doLogin">
              <v-text-field
                class="login-input mb-2"
                v-model="input.email"
                label="Email"
                type="email"
                variant="outlined"
                placeholder="John@example.com"
                :persistent-hint="true"
                :rules="emailRules"
              ></v-text-field>

              <v-text-field
                v-model="input.password"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                class="my-2"
                :rules="passwordRules"
                label="Password"
                @click:append-inner="showPassword = !showPassword"
              ></v-text-field>
              <div class="d-flex align-center mt-n4">
                <v-checkbox v-model="rememberMe" class="black--text">
                  <template v-slot:label>
                    <span
                      style="
                        font-weight: 400;
                        font-size: 14px;
                        color: #000 !important;
                      "
                      >Remember this Device</span
                    >
                  </template>
                </v-checkbox>
                <a
                  href="#"
                  class="text-body-2 mt-n6 font-weight-regular"
                  style="
                    text-decoration: none;
                    color: #4b80b1;
                    font-weight: 400;
                    font-size: 12px;
                  "
                  >Forgot Password?</a
                >
              </div>

              <v-btn
                type="submit"
                variant="outlined"
                block
                :disabled="!isValid"
                class="login-btn mt-n5"
              >
                <span v-if="!isLoggingIn">Sign In</span>
                <i v-if="isLoggingIn" class="fa fa-circle-o-notch fa-spin" />
              </v-btn>
              <div class="login-footer mt-8">
                <div class="d-flex justify-center" style="gap: 25px">
                  <div class="login-line"></div>
                  <span class="mt-n3">OR</span>
                  <div class="login-line"></div>
                </div>
              </div>
              <div
                v-if="isSmall"
                class="d-flex flex-column justify-center text-center mt-5"
                style="gap: 20px"
              >
                <h2>Social Media</h2>
                <p>please select anyone from below</p>
              </div>
              <div
                class="login-footer-btn d-flex justify-center mt-5"
                style="gap: 20px"
              >
                <div class="login-footer-icon">
                  <img :src="require('@/assets/tiktok.png')" alt="logo" />
                </div>
                <div class="login-footer-icon">
                  <img :src="require('@/assets/facebook.png')" alt="logo" />
                </div>
                <div class="login-footer-icon">
                  <img :src="require('@/assets/instagram.png')" alt="logo" />
                </div>
                <div class="login-footer-icon">
                  <img :src="require('@/assets/google.png')" alt="logo" />
                </div>
                <div class="login-footer-icon">
                  <img :src="require('@/assets/linkedin.png')" alt="logo" />
                </div>
              </div>
            </v-form>
          </v-card>

          <v-snackbar
            location="top"
            color="red"
            v-model="isError"
            :timeout="1000"
          >
            {{ errorMessage }}

            <template v-slot:actions>
              <v-btn color="white" variant="text" @click="isError = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-snackbar>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
// import { router } from '@/router';

// const baseUrl = `https://admin1.the-gypsy.sg/api/`;

export default {
  data() {
    return {
      rememberMe: false,
      showPassword: false,
      screenWidth: window.innerWidth,
      input: {
        email: '',
        password: '',
      },

      isError: false,
      isLoggingIn: false,
      errorMessage: '',
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
    emailRules() {
      return [
        (v) => !!v || 'Email is required', // Aturan: Email wajib diisi
        (v) => this.validateEmail(v) || 'Invalid email format', // Aturan: Format email harus valid
      ];
    },
    passwordRules() {
      return [
        (v) => !!v || 'Password is required', // Aturan: Password wajib diisi
        (v) =>
          (v && v.length >= 6) || 'Password should be at least 6 characters', // Aturan: Password minimal 6 karakter
      ];
    },
    isValid() {
      return (
        this.validateEmail(this.input.email) && this.input.password.length >= 6
      );
    },
  },
  created() {
    // this.$router.onError((error) => {
    //   if (error.message.includes('404')) {
    //     this.$router.replace('/');
    //   }
    // });

    if (localStorage.getItem('token') != null) {
      this.$router.replace('/');
    } else {
      window.addEventListener('resize', this.handleResize);
      if (this.$route.query.error) {
        alert(this, 'You already login in another Device');
      }
    }
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    validateEmail(email) {
      // Fungsi untuk memvalidasi email menggunakan ekspresi reguler
      // Anda dapat mengganti atau memperluas validasi ini sesuai dengan kebutuhan Anda
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    async doLogin() {
      this.isLoggingIn = true;
      this.errorMessage = '';
      try {
        const response = await axios.post(
          `/login`,
          {
            email: this.input.email,
            password: this.input.password,
          },
          {
            headers: {
              'Access-Control-Allow-Origin': 'http://localhost:8080',
              'Content-Type': 'application/json',
            },
          }
        );
        // eslint-disable-next-line no-unused-vars

        localStorage.setItem(
          'token',
          JSON.stringify(response.data.access_token)
        );
        setAuthHeader(response.data.access_token);
        // localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('name', JSON.stringify(response.data.user.name));
        localStorage.setItem('role', JSON.stringify(response.data.user.role));
        localStorage.setItem('image', JSON.stringify(response.data.user.image));
        localStorage.setItem('id', JSON.stringify(response.data.user.id));

        const loginTime = new Date().getTime();
        localStorage.setItem('loginTime', loginTime);

        // this.$axios.defaults.headers.common['Authorization'] =
        //   localStorage.getItem('token');
        this.$router.push('/');
      } catch (error) {
        if (error.response.status == 401) {
          this.isError = true;
          this.errorMessage = 'Email/Password is incorrect!';
        } else {
          this.isError = true;
          this.errorMessage = error.response.data.error;
        }
        // console.log(error);
      } finally {
        this.isLoggingIn = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  background-image: url('@/assets/banner-img.png');
  background-position: center;
  background-size: cover;
  background-color: #cccccc;
  min-height: 85vh;
}

.login-input .v-text-field input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px #f5f5f5 inset !important;
  -webkit-text-fill-color: #333 !important;
}

/* Firefox */
.login-input .v-text-field input:-moz-autofill {
  -moz-box-shadow: 0 0 0 30px #f5f5f5 inset !important;
  -moz-text-fill-color: #333 !important;
}

.login-btn {
  width: 400px;
  height: 50px;

  background: #5d87ff;
  border-radius: 10px;
  color: white !important;
  font-weight: 500;
  font-size: 14px;
  text-transform: unset;
}

.login-line {
  width: 70px;
  height: 1px;
  background: #bababa;
}
</style>
