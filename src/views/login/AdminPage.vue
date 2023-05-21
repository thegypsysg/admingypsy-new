<template>
  <HeaderAdmin />
  <LoginComponent />
</template>

<script>
import HeaderAdmin from './HeaderAdmin.vue';
import LoginComponent from './LoginComponent.vue';

export default {
  components: { HeaderAdmin, LoginComponent },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', sans-serif;
}
</style>
