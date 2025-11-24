<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import SearchBar from '../components/inputs/searchBar.vue';
import Icon from '../assets/icons/icon.svg';
import ExploreCategories from '../views/ExploreCategories.vue';
import UserCard from '../components/userCard.vue';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import api from '../services/api';

const { t } = useI18n()

const route = useRoute();
const router = useRouter();
const searchQuery = ref((route.query.q as string) ?? '');
const searchMode = ref(false);
const searchResults = ref<TagCategory[]>([]);
const isSearching = ref(false);
const searchError = ref<string | null>(null);
const hasSearched = ref(false);
const availableTags = ref<string[]>([]);
const isLoadingTags = ref(false);
const isTagClicking = ref(false);

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

// Format tag name function (same as ExploreCategories)
const formatTagName = (tagName: string): string => {
  return tagName
    .split('_')
    .map(word => word.replace(/\d+/g, ''))
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

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
    searchError.value = err.response?.data?.message || t('explore.failedToSearch');
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

const goToHome = () => {
  router.push({ name: 'home' });
};

// Fetch available tags from API
const fetchAvailableTags = async () => {
  try {
    isLoadingTags.value = true;
    
    const response = await api.get('/users');
    const tagsData = response.data.data || {};
    
    // Extract all tag names and format them
    const tags: string[] = [];
    
    Object.keys(tagsData).forEach((tagKey) => {
      const tagArray = tagsData[tagKey];
      
      // Only include tags that have users
      if (tagArray && tagArray.length > 0 && tagArray[0].users && tagArray[0].users.length > 0) {
        const formattedTagName = formatTagName(tagKey);
        tags.push(formattedTagName);
      }
    });
    
    availableTags.value = tags;
  } catch (err: any) {
    console.error('Error fetching tags:', err);
  } finally {
    isLoadingTags.value = false;
  }
};

const handleSearchFocus = () => {
  searchMode.value = true;
  if (availableTags.value.length === 0) {
    fetchAvailableTags();
  }
};

const handleSearchBlur = () => {
  // Delay to allow tag clicks
  setTimeout(() => {
    if (!isTagClicking.value) {
      searchMode.value = false;
    }
    isTagClicking.value = false;
  }, 200);
};

const goToAllUsers = (category: string) => {
  router.push({ name: 'allUsers', query: { category } });
};

const selectTag = (tag: string) => {
  isTagClicking.value = true;
  searchMode.value = false;
  router.push({ name: 'allUsers', query: { category: tag } });
};

const clearSearch = () => {
  searchQuery.value = '';
  hasSearched.value = false;
  searchResults.value = [];
  searchError.value = null;
};


</script>
<template>
  <main class="min-h-screen bg-white text-[#111111] max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-10 relative">
    <!-- Language Switcher - Top Right -->
    <div class="absolute top-6 right-4 z-10">
      <LanguageSwitcher />
    </div>
    
    <!-- Top logo bar -->
    <header class="pt-6 pb-4 border-b border-gray-200">
      <img :src="Icon" alt="Social Links Logo" class="w-25 h-auto cursor-pointer" @click="goToHome"/>
    </header>

    <!-- Search -->
    <section class="mt-6" >
      <div class="flex items-center gap-2">
        <div class="flex-1">
          <SearchBar 
            v-model="searchQuery" 
            :placeholder="t('explore.searchPlaceholder')"
            @focus="handleSearchFocus"
            @blur="handleSearchBlur"
            @search="handleSearch" 
          />
        </div>
        <button
          v-if="hasSearched"
          @click="clearSearch"
          class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          {{ t('explore.clear') }}
        </button>
      </div>
    </section>

    <!-- Search Results -->
    <section v-if="hasSearched" class="mt-6">
      <h2 class="text-xl font-semibold mb-4">{{ t('explore.searchResults') }} "{{ searchQuery }}"</h2>
      
      <!-- Loading state -->
      <div v-if="isSearching" class="text-center py-12">
        <p class="text-gray-600">{{ t('explore.searching') }}</p>
      </div>

      <!-- Error state -->
      <div v-else-if="searchError" class="text-center py-12">
        <p class="text-red-600">{{ searchError }}</p>
      </div>

      <!-- No results -->
      <div v-else-if="searchResults.length === 0" class="text-center py-12">
        <p class="text-gray-600">{{ t('explore.noUsersFound') }}</p>
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
              {{ t('explore.viewAll') }}
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

    <!-- Tags Selection (show when search input is focused and not searched) -->
    <section v-if="searchMode && !hasSearched" class="mt-6">
      <p class="text-xl font-medium text-center">
        {{ t('explore.orChooseFromHere') }}
      </p>

      <!-- Loading state -->
      <div v-if="isLoadingTags" class="mt-6 text-center py-8">
        <p class="text-gray-600">{{ t('explore.loadingTags') }}</p>
      </div>

      <!-- Tags grid -->
      <div
        v-else
        class="mt-6 grid grid-cols-1 gap-4 max-w-2xl mx-auto
               lg:grid-cols-2 lg:max-w-4xl lg:gap-x-8 lg:gap-y-6"
      >
        <button
          v-for="tag in availableTags"
          :key="tag"
          @mousedown.prevent="selectTag(tag)"
          class="w-full text-left text-lg font-medium
                 bg-[#f7f7f7] border border-[#0094ff]
                 rounded-2xl py-4 px-6 hover:bg-[#eaf6ff] transition"
        >
          {{ tag }}
        </button>
      </div>
    </section>

    <!-- Explore Categories (show when not searching and not focused) -->
    <ExploreCategories v-if="!hasSearched && !searchMode" @search="handleSearch" />


  </main>

</template>