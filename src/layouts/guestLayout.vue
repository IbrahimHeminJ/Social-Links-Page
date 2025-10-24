<script setup lang="ts">
import Header from "../components/header.vue";
import Footer from "../components/footer.vue";
import Sidebar from "../components/sidebar/sidebar.vue";
import { isAuthenticated } from "../store/isAuth";
</script>
<template> 
<div class="h-screen w-full flex">
  <Sidebar v-if="!isAuthenticated" />
  <div class="ml-[263px] flex flex-col w-full">
    <Header />
    <main class="min-h-[calc(100vh-120px)]">
      <router-view />
    </main>
  </div>
</div>
  <Footer v-if="isAuthenticated" />
</template>