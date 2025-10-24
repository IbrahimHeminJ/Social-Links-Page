<script setup lang="ts">
import { ref } from "vue"; 

const searchQuery = ref("");

const handleSearch = () => {
  // Handle search functionality
  console.log("Searching for:", searchQuery.value);
};
</script>

<template>
  <header class="border-b py-[120px] px-12">
    <nav class="flex justify-between items-center">   
      <div class="relative">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2">
          <img src="../assets/icons/search.svg" alt="search" class="size-[29px]">
        </span>
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Explore Community"
          class="bg-gray-100 text-gray-900 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 w-64"
        />
      </div> 
      <button>
        <img src="../assets/icons/moon.svg" alt="logo" class="size-[29px]">
      </button> 
    </nav>
  </header>
</template>
