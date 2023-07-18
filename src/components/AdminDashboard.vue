<template>
  <v-container>
    <h1>My Dasboard</h1>
    <div class="card-container d-flex flex-wrap mb-8">
      <v-card
        :to="item.path"
        v-for="(item, index) in cardItem"
        :key="index"
        :width="!isSmall ? '15%' : '100%'"
        height="150"
        :color="item.color"
        class="my-4 text-center mx-3 card-item"
        elevation="0"
        style="border-radius: 12px"
        @click="toggle"
      >
        <div :width="!isSmall ? '15%' : '100%'" class="img-cont">
          <div class="overlay"></div>
          <v-img width="100%" height="150" cover :src="item.image"
            ><template #placeholder> <div class="skeleton" /> </template
          ></v-img>
        </div>
        <p class="card-title text-white">{{ item.title }}</p>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import axios from '@/util/axios';

export default {
  data: () => ({
    cardItem: [],
    screenWidth: window.innerWidth,
  }),
  created() {
    window.addEventListener('resize', this.handleResize);
    this.name = localStorage.getItem('name')
      ? localStorage.getItem('name').slice(1, -1)
      : '';
    this.role = localStorage.getItem('role')
      ? localStorage.getItem('role').slice(1, -1)
      : '';
    this.image =
      localStorage.getItem('image') == 'null'
        ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
        : localStorage.getItem('image');

    const storedLoginTime = localStorage.getItem('loginTime');
    const time = new Date(parseInt(storedLoginTime));
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    this.loginTime = time.toLocaleDateString('en-GB', options);
  },
  mounted() {
    this.getAppActive();
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    navigation() {
      return this.$store.getters.navigation;
    },
    isSmall() {
      return this.screenWidth < 840;
    },
  },
  methods: {
    getAppActive() {
      axios
        .get(`/app/active`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.cardItem = data
            .sort((a, b) => a.app_id < b.app_id)
            .map((app) => {
              return {
                id: app.app_id || 1,
                title: app.app_name || '',
                path:
                  app.app_name == 'The Syringe'
                    ? '/healthcare-settings'
                    : app.app_name == 'Boozards'
                    ? '/booze_category'
                    : '',
                image: this.$fileURL + app.app_main_image || null,
              };
            });
          // console.log(this.items);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    logout() {
      localStorage.clear();
      this.$router.push('/auth/login');
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    // checkTokenExpired() {
    //   const token = localStorage.getItem('token');

    //   if (token) {
    //     const decodedToken = jwtDecode(token);
    //     const currentTime = Date.now() / 1000;

    //     if (decodedToken.exp < currentTime) {
    //       localStorage.removeItem('token');
    //       localStorage.clear();
    //       console.log('TOKEN EXPIRED');
    //     } else {
    //       ('TOKEN TIDAK EXPIRED');
    //     }
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.img-cont {
  width: 100%;
  height: 150px !important;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 9;
}

.card-item:hover .overlay {
  opacity: 1;
}
.login span {
  font-size: 12px;
}

.img-app {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.card-container {
  width: 100%;
}

.card-item {
  position: relative;
}

.card-title {
  width: 100%;
  position: absolute;
  bottom: 20px;
  margin-top: 80px;
  font-size: 13px;
  font-weight: 600;
  z-index: 10;
  margin: 0 auto;
}

#navigation {
  list-style: none;
  border: none;

  li {
    position: relative;
    color: #555;
    font-size: 12px;
    border: none;
    cursor: pointer;

    .title {
      padding: 10px 0;
      text-indent: 20px;
    }

    i {
      position: absolute;
      top: 12px;
      right: 10px;
    }
  }
}

.skeleton {
  width: 100%;
  height: 100%;
  border-radius: 0;

  background: linear-gradient(-90deg, #f2f2f2 0%, #e1e1e1 50%, #f2f2f2 100%);
  background-size: 400% 400%;
  animation: skeleton 1.6s ease infinite;
  margin: 0 auto;
}
</style>
