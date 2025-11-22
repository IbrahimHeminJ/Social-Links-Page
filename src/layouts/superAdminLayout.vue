<script setup lang="ts">
import Header from "../components/header.vue";
import Footer from "../components/footer.vue";
import AdminSidebar from "../components/sidebar/adminSidebar.vue";
import { isAuthenticated } from "../store/isAuth";
import { ref } from "vue";

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>
<template>
  <div class="h-screen w-full flex">
    <!-- Desktop sidebar - always visible on md+ screens -->
    <AdminSidebar v-if="!isAuthenticated" class="hidden md:flex" />

    <!-- Mobile sidebar - toggleable with animation -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-in-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in-out"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <AdminSidebar v-if="!isAuthenticated && isSidebarOpen" class="md:hidden" />
    </Transition>

    <div class="md:ml-[263px] flex flex-col w-full">
      <Header :toggleSidebar="toggleSidebar" />
      <main class="min-h-[calc(100vh-120px)]">
        <router-view />
      </main>
    </div>
  </div>
  <Footer v-if="isAuthenticated" />
</template>

