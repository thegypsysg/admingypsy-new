<template>
  <v-navigation-drawer
    class="pa-4"
    v-model="localDrawerOpen"
    :rail="rail"
    permanent
  >
    <div class="img-cont">
      <router-link to="/">
        <v-img src="@/assets/logo-img.png" class="mx-auto" height="70"></v-img>
      </router-link>
    </div>
    <v-list-item
      class="mt-8"
      style="background-color: #e8f6ff"
      :prepend-avatar="image"
      nav
    >
      <v-list-item-content>
        <v-list-item-title>{{ name }}</v-list-item-title>
        <v-list-item-subtitle>{{ role }}</v-list-item-subtitle>
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
      <span>{{ loginTime }}</span>
    </div>

    <div class="nav-link mt-8 mx-2">
      <p style="font-size: 13px">HOME</p>
    </div>

    <ul id="navigation">
      <li v-for="(item, index) in navigation" :key="'item' + index">
        <i
          v-if="item.subnav"
          class="far"
          :class="{
            'fa fa-chevron-down': !item.open,
            'fa fa-chevron-up': item.open,
          }"
        ></i>
        <div class="title" @click="item.open = !item.open">
          {{ item.title }}
        </div>
        <Dropdown v-if="item.subnav" :list="item" />
      </li>
    </ul>

    <!-- <v-divider></v-divider> -->
  </v-navigation-drawer>
</template>

<script>
import Dropdown from './Dropdown.vue';

export default {
  components: { Dropdown },
  data() {
    return {
      fileURL: 'https://admin1.the-gypsy.sg',
      rail: false,
      image: '',
      imagetoShow: '',
      name: '',
      role: '',
      loginTime: null,
      localDrawerOpen: true,
    };
  },
  props: {
    drawerOpen: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    drawerOpen(newVal) {
      this.localDrawerOpen = newVal;
    },
  },
  mounted() {
    this.name = localStorage.getItem('name')
      ? localStorage.getItem('name').slice(1, -1)
      : '';
    this.role = localStorage.getItem('role')
      ? localStorage.getItem('role').slice(1, -1)
      : '';
    const getImg = localStorage.getItem('image');
    this.image =
      getImg == 'null'
        ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
        : this.fileURL + getImg.split('"')[1];
    const storedLoginTime = localStorage.getItem('loginTime');
    const time = new Date(parseInt(storedLoginTime));
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    this.loginTime = time.toLocaleDateString('en-GB', options);
  },
  // mounted() {
  //   this.image = localStorage.getItem('image') == 'null'
  // },
  computed: {
    navigation() {
      return this.$store.getters.navigation;
    },
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/auth/login');
    },
  },
};
</script>

<style lang="scss" scoped>
.img-cont {
  width: 100%;
}

.login span {
  font-size: 12px;
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
</style>
