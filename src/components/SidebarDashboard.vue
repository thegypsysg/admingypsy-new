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

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import Dropdown from './Dropdown.vue';
import eventBus from '@/util/eventBus';
import { tokenStorage } from '@/util/tokenStorage';
import { useNavigationStore } from '@/stores/navigation';

const props = defineProps({
  drawerOpen: {
    type: Boolean,
    required: true,
  },
});

const router = useRouter();
const navStore = useNavigationStore();
const fileURL = import.meta.env.VITE_FILE_URL || '';

const rail = ref(false);
const image = ref('');
const name = ref('');
const role = ref('');
const loginTime = ref(null);
const localDrawerOpen = ref(props.drawerOpen);

watch(
  () => props.drawerOpen,
  (newVal) => {
    localDrawerOpen.value = newVal;
  }
);

const navigation = computed(() => {
  return navStore ? navStore.navigation : [];
});

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

const logout = () => {
  tokenStorage.clearAll();
  router.push('/auth/login');
};

onMounted(() => {
  name.value = tokenStorage.getName() || '';
  const getRole = tokenStorage.getRole();
  role.value = getRole === 'S' ? 'Superadmin' : getRole === 'A' ? 'Admin' : '';
  const getImg = tokenStorage.getImage();
  image.value =
    !getImg || getImg === 'null'
      ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
      : fileURL + getImg;

  const storedLoginTime = tokenStorage.getLoginTime();
  if (storedLoginTime) {
    const time = new Date(parseInt(storedLoginTime));
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    loginTime.value = time.toLocaleDateString('en-GB', options);
  }

  eventBus.on('update-image', updateImage);
});

onBeforeUnmount(() => {
  eventBus.off('update-image', updateImage);
});
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
