<template>
  <div>
    <router-link to="/employers">back</router-link>
    <h1>{{ 'This is Main Info of id ' + $route.params.id }}</h1>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
