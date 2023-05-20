<template>
  <header class="d-flex" style="border-bottom: 1px solid #bababa; height: 15vh">
    <div class="d-flex align-center">
      <img
        :src="require('../assets/logo-img.png')"
        alt="logo"
        :class="{
          'logo-image-mobile': isSmall,
          'logo-image-desktop': !isSmall,
        }"
      />
    </div>
    <div
      class="ml-6 d-flex flex-row header-info"
      :class="{ 'header-info-mobile': isSmall }"
    >
      <div class="divider"></div>
      <span>Admin Dashboard</span>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      screenWidth: window.innerWidth,
      he: null,
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
  },
};
</script>

<style scoped>
.divider {
  border: 1px solid #a2a2a2;
  width: 1px;
  height: 70px;
}

.header-info {
  align-items: center;
  gap: 40px;
  font-weight: 600;
  font-size: 50px;
  color: #000;
}

.header-info-mobile {
  font-size: 20px !important;
  color: #737373 !important;
}

.logo-image-desktop {
  height: 70px;
  width: 100%;
}
.logo-image-mobile {
  height: 50px;
  width: 100%;
}
</style>
