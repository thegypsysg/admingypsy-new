<template>
  <v-app id="inspire">
    <v-navigation-drawer class="pa-4" v-model="drawer" :rail="rail" permanent>
      <div class="img-cont">
        <v-img src="@/assets/logo-img.png" class="mx-auto" height="70"></v-img>
      </div>
      <v-list-item
        class="mt-8"
        style="background-color: #e8f6ff"
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        nav
      >
        <v-list-item-content>
          <v-list-item-title>Mathew</v-list-item-title>
          <v-list-item-subtitle>Designer</v-list-item-subtitle>
        </v-list-item-content>
        <template v-slot:append>
          <v-btn
            @click="logout"
            color="#6583C8"
            variant="text"
            icon="mdi-power"
          ></v-btn>
        </template>
      </v-list-item>
      <div class="login">
        <span class="mr-4">Last Login: </span>
        <span>15th May 2023</span>
      </div>

      <div class="nav-link mt-8 mx-2">
        <p style="font-size: 13px">HOME</p>
      </div>

      <!-- <v-divider></v-divider> -->
    </v-navigation-drawer>
    <v-app-bar absolute="" color="white" elevation="0">
      <!-- <template v-slot:prepend>
        <v-app-bar-nav-icon @click="rail = !rail"></v-app-bar-nav-icon>
      </template> -->

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            style="font-size: 12px; color: #494949; text-transform: none"
            v-bind="props"
            variant="text"
          >
            Apps
            <v-icon right dark> mdi-chevron-down </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :value="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        style="font-size: 12px; color: #494949; text-transform: none"
        v-for="link in linksNavBar"
        :key="link"
        variant="text"
      >
        {{ link }}
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn size="40" rounded icon @click="drawer = !drawer">
        <img
          class="img-app"
          src="https://randomuser.me/api/portraits/men/85.jpg"
        />
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <h1>My Dasboard</h1>
        <div class="card-container d-flex flex-wrap mb-8">
          <v-card
            v-for="(item, index) in cardItem"
            :key="index"
            width="15%"
            height="150"
            :color="item.color"
            class="my-4 text-center mx-3 card-item"
            elevation="0"
            style="border-radius: 12px; padding: 20px"
            @click="toggle"
          >
            <p class="card-title">{{ item.title }}</p>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    linksNavBar: ['Chat', 'Calendar', 'Notes'],
    drawer: true,
    items: [
      { title: 'Home', path: '/home', icon: 'home' },
      { title: 'Sign Up', path: '/signup', icon: 'face' },
      { title: 'Sign In', path: '/signin', icon: 'lock_open' },
    ],
    cardItem: [
      {
        color: '#ECF2FF',
        title: 'Mall-e',
      },
      {
        color: '#E6FFFB',
        title: 'Flea',
      },
      {
        color: '#FEF5E4',
        title: 'the-syringe',
      },
      {
        color: '#E8F6FF',
        title: 'Symphinite',
      },
      {
        color: '#E6FFFB',
        title: 'I-hired',
      },
      {
        color: '#FCEDE8',
        title: 'Biryani Run',
      },
      {
        color: '#E6FFFB',
        title: 'Cake Run',
      },
      {
        color: '#E8F6FF',
        title: 'Pizza  Run',
      },
      {
        color: '#FCEDE8',
        title: 'Astalavista',
      },
      {
        color: '#E6FFFB',
        title: 'Staycacy',
      },
    ],

    rail: false,
  }),
  // created() {
  //   if (localStorage.getItem('token') == null) {
  //     this.$router.push('/auth/login');
  //   }
  // },
  methods: {
    logout() {
      localStorage.clear();

      this.$router.push('/auth/login');
    },
  },
};
</script>

<style scoped>
.img-cont {
  width: 100%;
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
  margin-top: 80px;
  font-size: 13px;
  font-weight: 600;
}
</style>
