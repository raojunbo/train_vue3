<script setup>
import { RouterLink, RouterView } from 'vue-router'
import KLineTrendView from './views/KLineTrendView.vue'
import KLineOXView from './views/KLineOXView.vue'
</script>

<template>
  <nav>
    <!-- <RouterLink to="/">Home</RouterLink> -->
    <!-- <RouterLink to="/about">About</RouterLink> -->
    <RouterLink to="/trend">趋势图</RouterLink>
    <RouterLink to="/OX">点数图</RouterLink>
    <RouterLink to="/train">训练图</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>


nav {
  width: 100px;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
}

@media (min-width: 1024px) {
  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
