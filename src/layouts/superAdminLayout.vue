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
  <div class="min-h-screen w-full flex flex-col bg-white">
    <!-- Header at the top with same styling as home/explore -->
    <div class="w-full px-4 sm:px-6 lg:px-10 pt-4">
      <Header :toggleSidebar="toggleSidebar" />
    </div>

    <!-- Content area with sidebar and main content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Desktop sidebar - always visible on md+ screens, full height -->
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
        <AdminSidebar 
          v-if="!isAuthenticated && isSidebarOpen" 
          class="md:hidden fixed z-40 top-0" 
          :toggleSidebar="toggleSidebar"
        />
      </Transition>

      <!-- Main content area -->
      <main class="flex-1 overflow-y-auto bg-white">
        <div class="p-6">
          <router-view />
        </div>
      </main>
    </div>
  </div>
  <Footer v-if="isAuthenticated" />
</template>

