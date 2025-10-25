<script setup lang="ts">
import { ref } from "vue";

interface Props {
  toggleSidebar?: () => void;
}

const props = defineProps<Props>();

const searchQuery = ref("");

const handleSearch = () => {
  // Handle search functionality
  console.log("Searching for:", searchQuery.value);
};

const handleMenuClick = () => {
  // Only toggle on mobile screens
  if (window.innerWidth < 768) {
    props.toggleSidebar?.();
  }
};
</script>

<template>
  <header class="border-b border-[#9F9F9F] md:h-[95px] h-[57px] px-8">
    <nav class="flex justify-between items-center h-full">
      <div class="md:hidden flex items-center gap-x-5">
        <img
          src="../assets/icons/menu.svg"
          alt="menu"
          class="size-[19px] cursor-pointer"
          @click="handleMenuClick"
        />
        <img
          src="../assets/icons/icon.svg"
          alt="logo"
          class="w-[87.44px] h-[30.31px]"
        />
      </div>
      <div class="md:hidden">
        <img
          src="../assets/icons/search.svg"
          alt="search"
          class="size-[19px]"
        />
      </div>
      <div class="relative max-md:hidden h-16 w-[388px]">
        <span class="absolute left-5 top-1/2 transform -translate-y-1/2">
          <img
            src="../assets/icons/search.svg"
            alt="search"
            class="size-[21px]"
          />
        </span>
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Explore Community"
          class="bg-gray-100 text-gray-900 placeholder-gray-500 pl-13 pr-4 py-2 rounded-[60px] border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 w-[388px] h-16"
        />
      </div>
      <img
        src="../assets/icons/moon.svg"
        alt="logo"
        class="size-[21px] max-md:hidden"
      />
    </nav>
  </header>
</template>
