<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchBar from '../components/inputs/searchBar.vue';
import Icon from '../assets/icons/icon.svg';
import ExploreCategories from '../views/ExploreCategories.vue';
import SearchTags from './SearchTags.vue';

const route = useRoute();
const router = useRouter();
const searchQuery = ref((route.query.q as string) ?? '');
const searchMode = ref(false);

const handleSearch = (value: string) => {
  // later: call backend / filter categories
  console.log('Explore search:', value);
};
const goToHome = () => {
  router.push({ name: 'home' });
};


</script>
<template>
  <main class="min-h-screen bg-white text-[#111111] max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-10">
    <!-- Top logo bar -->
    <header class="pt-6 pb-4 border-b border-gray-200 flex items-center" >
      <img :src="Icon" alt="Social Links Logo" class="w-25 h-auto" @click="goToHome"/>
    </header>

    <!-- Search -->
    <section class="mt-6" >
      <SearchBar v-model="searchQuery" placeholder="Explore Community" 
        @focus="searchMode = true"
        @blur="searchMode = false" />
    </section>

    <ExploreCategories v-if="!searchMode" @search="handleSearch" />
    <SearchTags v-else v-model="searchQuery" @selectTag="(tag) => { searchQuery = tag; handleSearch(tag); }"
      @back="searchMode = false" />


  </main>

</template>