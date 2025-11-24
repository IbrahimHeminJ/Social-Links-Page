<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../store/auth";
import SearchBar from "./inputs/searchBar.vue";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import ProfileSwitcher from "./ProfileSwitcher.vue";

interface Props {
  toggleSidebar?: () => void;
}
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const goToExplore = () => {
  router.push({ name: 'explore' });
};
const props = defineProps<Props>();

const searchQuery = ref("");

// Sync auth state on mount to ensure user data is loaded
onMounted(() => {
  authStore.syncAuthState();
});

// Check if current route is admin or super admin route
const isAdminOrSuperAdminRoute = computed(() => {
  const routeName = route.name as string
  return routeName?.startsWith('admin.') || routeName?.startsWith('superAdmin.')
})

// Profile switcher visibility logic:
// If role is 'user' → DON'T show it
// If role is 'admin' (superadmin in DB) → Always show it in both dashboards
const showProfileSwitcher = computed(() => {
  const role = authStore.userRole
  
  // If role is 'user' → DON'T show it
  if (role === 'user') {
    return false
  }
  
  // If role is 'admin' (superadmin in DB) → Always show it in both dashboards
  if (role === 'admin') {
    return isAdminOrSuperAdminRoute.value
  }
  
  // All other cases → don't show
  return false
})

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
        class="w-full md:max-w-md mt-3"
        @click="goToExplore" />
      
      <!-- Profile Switcher (for users with role 'user' or 'admin' in admin/superAdmin routes) -->
      <ProfileSwitcher v-if="showProfileSwitcher" />
      
      <div class="flex items-center gap-3">
        <LanguageSwitcher />
        <img
          src="../assets/icons/moon.svg"
          alt="logo"
          class="size-[21px] max-md:hidden"
        />
      </div>
    </nav>
  </header>
</template>
