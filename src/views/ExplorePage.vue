<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchBar from '../components/inputs/searchBar.vue';
import Icon from '../assets/icons/icon.svg';
import ExploreCategories from '../views/ExploreCategories.vue';
import SearchTags from './SearchTags.vue';
import UserCard from '../components/userCard.vue';
import api from '../services/api';

const route = useRoute();
const router = useRouter();
const searchQuery = ref((route.query.q as string) ?? '');
const searchMode = ref(false);
const searchResults = ref<TagCategory[]>([]);
const isSearching = ref(false);
const searchError = ref<string | null>(null);
const hasSearched = ref(false);

interface TagCategory {
  title: string;
  users: Array<{
    id: number;
    name: string;
    role: string;
    avatar: string;
  }>;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  profile_image: string;
  phone_no: string;
  role: string;
}

const handleSearch = async (value: string) => {
  if (!value.trim()) {
    hasSearched.value = false;
    searchResults.value = [];
    return;
  }

  try {
    isSearching.value = true;
    searchError.value = null;
    hasSearched.value = true;
    
    console.log('Searching for:', value);
    
    // Call search API - public endpoint
    const response = await api.get('/users', {
      params: { search: value.trim() }
    });
    
    console.log('Search response:', response.data);
    
    // Handle response - same structure as /users endpoint (tags grouped)
    const tagsData = response.data.data || {};
    
    // Format tag name function (same as ExploreCategories)
    const formatTagName = (tagName: string): string => {
      return tagName
        .split('_')
        .map(word => word.replace(/\d+/g, ''))
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };
    
    // Convert to categories array (same structure as explore page)
    const categoriesList: TagCategory[] = [];
    
    // Loop through each tag in the response
    Object.keys(tagsData).forEach((tagKey) => {
      const tagArray = tagsData[tagKey];
      
      // Get users from the first item in the array
      if (tagArray && tagArray.length > 0 && tagArray[0].users && tagArray[0].users.length > 0) {
        // Get ALL users (no limit for search results)
        const users = tagArray[0].users;
        
        // Format tag name for display
        const formattedTagName = formatTagName(tagKey);
        
        categoriesList.push({
          title: formattedTagName,
          users: users.map((user: User) => ({
            id: user.id,
            name: user.name,
            role: formattedTagName,
            avatar: user.profile_image || '/src/assets/images/user.jpg',
          })),
        });
      }
    });
    
    searchResults.value = categoriesList;
    console.log('Search results grouped by tags:', searchResults.value);
    
  } catch (err: any) {
    console.error('Search error:', err);
    searchError.value = err.response?.data?.message || 'Failed to search users';
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

const goToHome = () => {
  router.push({ name: 'home' });
};

const goToAllUsers = (category: string) => {
  router.push({ name: 'allUsers', query: { category } });
};

const clearSearch = () => {
  searchQuery.value = '';
  hasSearched.value = false;
  searchResults.value = [];
  searchError.value = null;
};


</script>
<template>
  <main class="min-h-screen bg-white text-[#111111] max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-10">
    <!-- Top logo bar -->
    <header class="pt-6 pb-4 border-b border-gray-200 flex items-center justify-between" >
      <img :src="Icon" alt="Social Links Logo" class="w-25 h-auto cursor-pointer" @click="goToHome"/>
      <button
        @click="goToHome"
        class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
      >
        Back to Home
      </button>
    </header>

    <!-- Search -->
    <section class="mt-6" >
      <div class="flex items-center gap-2">
        <div class="flex-1">
          <SearchBar 
            v-model="searchQuery" 
            placeholder="Explore Community" 
            @focus="searchMode = true"
            @blur="searchMode = false"
            @search="handleSearch" 
          />
        </div>
        <button
          v-if="hasSearched"
          @click="clearSearch"
          class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Clear
        </button>
      </div>
    </section>

    <!-- Search Results -->
    <section v-if="hasSearched" class="mt-6">
      <h2 class="text-xl font-semibold mb-4">Search Results for "{{ searchQuery }}"</h2>
      
      <!-- Loading state -->
      <div v-if="isSearching" class="text-center py-12">
        <p class="text-gray-600">Searching...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="searchError" class="text-center py-12">
        <p class="text-red-600">{{ searchError }}</p>
      </div>

      <!-- No results -->
      <div v-else-if="searchResults.length === 0" class="text-center py-12">
        <p class="text-gray-600">No users found matching your search</p>
      </div>

      <!-- Results grouped by tags -->
      <div v-else class="space-y-8">
        <section v-for="category in searchResults" :key="category.title">
          <div class="flex items-center mb-4">
            <h3 class="text-xl font-semibold">{{ category.title }}</h3>
            <button
              v-if="category.users.length > 5"
              class="mt-auto mx-2 px-2 py-2 rounded-xl bg-[#3d4f5d] text-white font-semibold text-[10px] shadow-sm
                     hover:brightness-110 transition"
              @click="goToAllUsers(category.title)"
            >
              View All
            </button>
          </div>

          <div class="-mx-4 px-4 overflow-x-auto">
            <div class="flex gap-4 pb-4">
              <UserCard
                v-for="user in category.users"
                :key="user.id"
                :id="user.id"
                :name="user.name"
                :role="user.role"
                :avatar="user.avatar"
              />
            </div>
          </div>
        </section>
      </div>
    </section>

    <!-- Explore Categories (show when not searching) -->
    <ExploreCategories v-if="!hasSearched && !searchMode" @search="handleSearch" />
    <SearchTags v-if="searchMode && !hasSearched" v-model="searchQuery" @selectTag="(tag) => { searchQuery = tag; handleSearch(tag); }"
      @back="searchMode = false" />


  </main>

</template>