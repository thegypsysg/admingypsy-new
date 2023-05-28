<template>
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
        <v-list-item v-for="(item, index) in items" :key="index" :value="index">
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

    <v-btn size="40" rounded icon @click="toggleDrawer">
      <img class="img-app" :src="image" />
    </v-btn>
  </v-app-bar>
</template>

<script>
import app from '@/util/eventBus';

export default {
  data() {
    return {
      fileURL: 'https://admin1.the-gypsy.sg',
      linksNavBar: ['Chat', 'Calendar', 'Notes'],
      items: [
        { title: 'Home', path: '/home', icon: 'home' },
        { title: 'Sign Up', path: '/signup', icon: 'face' },
        { title: 'Sign In', path: '/signin', icon: 'lock_open' },
      ],
      image: '',
    };
  },
  created() {
    app.config.globalProperties.$eventBus.$on('update-image', this.updateImage);
  },
  beforeUnmount() {
    app.config.globalProperties.$eventBus.$off(
      'update-image',
      this.updateImage
    );
  },
  mounted() {
    const getImg = localStorage.getItem('image');
    this.image =
      getImg == 'null'
        ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
        : this.fileURL + getImg.split('"')[1];
  },
  methods: {
    toggleDrawer() {
      this.$emit('toggle-drawer');
    },
    updateImage(dataItems) {
      const id = parseInt(localStorage.getItem('id'));
      console.log(id);
      const image = dataItems
        .filter((data) => data.id === id)
        .map((item) => item.image);
      console.log(image);
      localStorage.setItem('image', image[0]);
      const getImg = localStorage.getItem('image');
      this.image =
        getImg == 'null'
          ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
          : this.fileURL + getImg;
    },
  },
};
</script>

<style lang="scss" scoped>
.img-app {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
