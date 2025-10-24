<script setup lang="ts">
import { ref } from "vue"; 

const searchQuery = ref("");

const handleSearch = () => {
  // Handle search functionality
  console.log("Searching for:", searchQuery.value);
};
</script>

<template>
  <header class="border-b py-[0px] h-[100px] px-12 pt-5">
    <nav class="flex justify-between items-center">   
      <div class="relative">
        <span class="absolute left-4 top-1/2 transform -translate-y-1/2">
          <img src="../assets/icons/search.svg" alt="search" class="size-[29px]">
        </span>
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Explore Community"
          class="bg-gray-100 text-gray-900 placeholder-gray-500 pl-12 pr-6 py-4 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 w-full text-lg"
        />
      </div> 
      <button>
        <img src="../assets/icons/moon.svg" alt="logo" class="size-[29px]">
      </button> 
    </nav>
  </header>
</template>
