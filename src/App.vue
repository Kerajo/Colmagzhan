<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <AppHeader />
  <main class="main">
    <div class="wrapper" v-auto-animate="{ duration: 150 }">
      <RouterView />
    </div>
  </main>
  <AppFooter />
</template>

<style scoped></style>
