<template>
  <v-container>
    <h1>My Dasboard</h1>
    <div class="card-container d-flex flex-wrap mb-8">
      <v-card
        v-for="(item, index) in cardItem"
        :key="index"
        :width="!isSmall ? '15%' : '100%'"
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
</template>

<script>
export default {
  data: () => ({
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
    screenWidth: window.innerWidth,
  }),
  created() {
    if (localStorage.getItem('token') == null) {
      this.$router.replace('/auth/login');
    } else {
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
    }
  },

  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    navigation() {
      return this.$store.getters.navigation;
    },
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/auth/login');
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
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
