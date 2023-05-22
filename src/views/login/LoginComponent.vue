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
              ></v-text-field>

              <v-text-field
                v-model="input.password"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
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
import axios from 'axios';
// import { router } from '@/router';

const baseUrl = `https://admin.the-gypsy.sg/api/`;

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
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    if (this.$route.query.error) {
      this.$helper.toastError(this, 'Anda sudah login di device lain');
    }
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    doLogin() {
      this.isLoggingIn = true;
      this.errorMessage = '';
      axios
        .post(`${baseUrl}auth/login`, {
          email: this.input.email,
          password: this.input.password,
        })
        // eslint-disable-next-line no-unused-vars
        .then((data) => {
          localStorage.setItem('token', JSON.stringify(data.data.access_token));
          localStorage.setItem('user', JSON.stringify(data.data.user));

          this.$axios.defaults.headers.common['Authorization'] =
            localStorage.getItem('token');
          this.$router.push('/');
        })
        .catch((error) => {
          // if (error.response.status == 401) {
          //   this.isError = true;
          //   this.errorMessage = 'Error when login!';
          // } else {
          //   this.isError = true;
          //   this.errorMessage = 'Email/Password is incorrect!';
          // }
          if (error) {
            this.isError = true;
            this.errorMessage = 'Email/Password is incorrect!';
          }
        })
        .finally(() => {
          this.isLoggingIn = false;
        });
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