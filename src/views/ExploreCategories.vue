<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import UserCard from '../components/userCard.vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const { t } = useI18n()

const router = useRouter();

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  profile_image: string;
  phone_no: string;
  role: string;
}

interface TagData {
  id: number;
  tag: string;
  users: User[];
}

interface TagCategory {
  title: string;
  users: User[];
}

const categories = ref<TagCategory[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const goToAllUsers = (category: string) => {
  router.push({ name: 'allUsers', query: { category } });
};

// Format tag name (remove numbers and underscores, capitalize)
const formatTagName = (tagName: string): string => {
  // Remove numbers and underscores, split by underscore, capitalize each word
  return tagName
    .split('_')
    .map(word => word.replace(/\d+/g, '')) // Remove numbers
    .filter(word => word.length > 0) // Remove empty strings
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const fetchUsers = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    const response = await api.get('/users');
    
    // Response structure: { message, data: { tag_name: [{ id, tag, users: [...] }] } }
    const tagsData = response.data.data || {};
    
    // Convert to categories array
    const categoriesList: TagCategory[] = [];
    
    // Loop through each tag in the response
    Object.keys(tagsData).forEach((tagKey) => {
      const tagArray = tagsData[tagKey];
      
      // Get users from the first item in the array (each tag key has array of tag objects)
      if (tagArray && tagArray.length > 0 && tagArray[0].users && tagArray[0].users.length > 0) {
        // Limit to 5 users per tag
        const users = tagArray[0].users.slice(0, 5);
        
        // Format tag name for display
        const formattedTagName = formatTagName(tagKey);
        
        categoriesList.push({
          title: formattedTagName,
          users: users.map((user: User) => ({
            id: user.id,
            name: user.name,
            role: formattedTagName, // Use formatted tag as role
            avatar: user.profile_image || '/src/assets/images/user.jpg',
          })),
        });
      }
    });
    
    categories.value = categoriesList;
  } catch (err: any) {
    console.error('Error fetching users:', err);
    error.value = err.response?.data?.message || t('users.failedToFetchUsers');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="space-y-10">
    <p class="text-lg font-medium">{{ t('explore.orExploreHere') }}</p>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-8">
      <p class="text-gray-600">{{ t('explore.loadingUsers') }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ t('explore.error') }}: {{ error }}</p>
    </div>

    <!-- Categories -->
    <template v-else>
      <section v-for="category in categories" :key="category.title">
        <div class="flex items-center mb-4">
          <h2 class="inline text-xl font-semibold">{{ category.title }}</h2>
          <button
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
              v-for="u in category.users"
              :key="u.id"
              :id="u.id"
              :name="u.name"
              :role="u.role"
              :avatar="u.avatar"
            />
          </div>
        </div>
      </section>

      <!-- No categories message -->
      <div v-if="categories.length === 0" class="text-center py-8">
        <p class="text-gray-600">{{ t('users.noUsersFound') }}</p>
      </div>
    </template>
  </div>
</template>
