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
      <v-list max-height="300">
        <v-list-item
          link
          :to="item.path"
          v-for="(item, index) in items"
          :key="index"
          :value="index"
        >
          <v-list-item-title :style="{ fontWeight: 500 }">
            <div class="d-flex align-center" style="gap: 10px">
              <div class="img-cont">
                <v-img cover :src="item.image"
                  ><template #placeholder> <div class="skeleton" /> </template
                ></v-img>
              </div>
              <div style="font-size: 12px !important">
                <p>
                  App id: <span class="text-blue-darken-4">{{ item.id }}</span>
                </p>
                <p class="text-blue-darken-4">{{ item.title }}</p>
              </div>
            </div>
          </v-list-item-title>
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

    <v-btn
      class="img-app-cont"
      width="40"
      height="40"
      rounded
      icon
      @click="toggleDrawer"
    >
      <v-img
        cover
        min-width="40"
        min-height="40"
        class="img-app"
        :src="image"
      />
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from '@/util/axios';
import eventBus from '@/util/eventBus';
import { tokenStorage } from '@/util/tokenStorage';

const emit = defineEmits(['toggle-drawer']);

const fileURL = import.meta.env.VITE_FILE_URL || '';
const linksNavBar = ref(['Chat', 'Calendar', 'Notes']);
const items = ref([]);
const image = ref('');

const toggleDrawer = () => {
  emit('toggle-drawer');
};

const updateImage = (dataItems) => {
  const id = parseInt(tokenStorage.getId());
  const matched = Array.isArray(dataItems)
    ? dataItems.find((data) => data.id === id)
    : null;
  if (matched && matched.image) {
    tokenStorage.setImage(matched.image);
  }
  const getImg = tokenStorage.getImage();
  image.value =
    !getImg || getImg === 'null'
      ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
      : fileURL + getImg;
};

const getAppActive = () => {
  axios
    .get('/app/active')
    .then((response) => {
      const data = response.data.data;
      items.value = data
        .sort((a, b) => a.app_id < b.app_id)
        .map((app) => {
          return {
            id: app.app_id || 1,
            title: app.app_name || '',
            path:
              app.app_name === 'The Syringe'
                ? '/healthcare-settings'
                : app.app_name === 'Mall-e'
                ? '/mall_master'
                : app.app_name === '4 Walls'
                ? '/walls_master'
                : app.app_name === 'Biryani Run'
                ? '/biryani-home/main-categories'
                : app.app_name === 'i-Study'
                ? '/course_master'
                : '',
            image: app.app_main_image ? fileURL + app.app_main_image : null,
          };
        });
    })
    .catch((error) => {
      console.error(error);
    });
};

onMounted(() => {
  eventBus.on('update-image', updateImage);
  getAppActive();
  const getImg = tokenStorage.getImage();
  image.value =
    !getImg || getImg === 'null'
      ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
      : fileURL + getImg;
});

onBeforeUnmount(() => {
  eventBus.off('update-image', updateImage);
});
</script>

<style lang="scss" scoped>
.img-app-cont {
  overflow: hidden !important;
}

.img-cont {
  height: 40px !important;
  width: 60px !important;
}

.img-app {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center !important;
  border-radius: 50%;
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
