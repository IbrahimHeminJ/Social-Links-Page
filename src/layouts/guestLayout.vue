<script setup lang="ts">
import Header from "../components/header.vue";
import Footer from "../components/footer.vue";
</script>
<template>
  <Header />
  <main class="min-h-[calc(100vh-120px)]">
    <router-view />
  </main>
  <Footer />
</template>
