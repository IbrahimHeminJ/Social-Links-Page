<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import Icon from '../assets/icons/icon.svg';
import SearchBar from '../components/inputs/searchBar.vue';

const router = useRouter();

// search text
const searchQuery = ref('');

// Dynamic categories (replace with API later)
const categories = ref([
  "Designers",
  "Software Engineer",
  "Youtuber",
]);

const goToCategory = (cat: string) => {
  router.push({
    name: "explore",
    query: { tag: cat }
  });
};

const goToSearch = () => {
  router.push({
    name: "explore",
    query: searchQuery.value ? { q: searchQuery.value } : {}
  });
};
</script>

<template>
  <main class="min-h-screen bg-white text-[#111] max-w-5xl mx-auto px-5 pt-6 pb-10">

    <!-- Logo -->
    <header class="pb-4 border-b border-gray-200">
      <img :src="Icon" class="w-25 h-auto" alt="Logo" />
    </header>

    <!-- Search Input -->
    <section class="mt-6">
      <SearchBar
        v-model="searchQuery"
        placeholder="Enter a tag"
        @search="goToSearch"
      />
    </section>

    <!-- Divider text -->
    <p class="mt-6 text-lg font-medium">
      or Choose from here:
    </p>

    <!-- Dynamic categories -->
    <section class="mt-4 flex flex-col gap-4">
      <button
        v-for="cat in categories"
        :key="cat"
        class="w-full text-left text-lg rounded-2xl px-5 py-4 bg-[#f2f2f2] border border-[#0094ff] font-medium"
        @click="goToCategory(cat)"
      >
        {{ cat }}
      </button> 
    </section>

  </main>
</template>
