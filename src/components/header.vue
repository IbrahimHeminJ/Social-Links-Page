<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import SearchBar from "./inputs/searchBar.vue";

interface Props {
  toggleSidebar?: () => void;
}
const router = useRouter();
const goToExplore = () => {
  router.push({ name: 'explore' });
};
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
  <header class="border-b border-[#9F9F9F] px-8 md:py-0 py-5 min-md:h-[95px] h-[57px]">
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
      
        <SearchBar
        v-model="searchQuery"
        placeholder="Explore Community"
        class="w-full md:max-w-md mt-3"
        @click="goToExplore" />
git
      <img
        src="../assets/icons/moon.svg"
        alt="logo"
        class="size-[21px] max-md:hidden"
      />
    </nav>
  </header>
</template>
