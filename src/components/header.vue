<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../store/auth";
import { useI18n } from "vue-i18n";
import ProfileSwitcher from "./ProfileSwitcher.vue";

interface Props {
  toggleSidebar?: () => void;
}
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { t, locale } = useI18n();

const props = defineProps<Props>();

const profileDropdownOpen = ref(false);
const languageDropdownOpen = ref(false);

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

const goToLogin = () => {
  router.push({ name: 'login' });
};

const handleLogout = async () => {
  await authStore.logout();
  profileDropdownOpen.value = false;
};

const handleUserClick = () => {
  const role = authStore.userRole;
  
  if (role === 'user') {
    // User role → redirect to admin links
    router.push({ name: 'admin.links' });
  } else if (role === 'admin' || role === 'superadmin') {
    // Admin or superadmin → redirect to superadmin users
    router.push({ name: 'superAdmin.users' });
  }
  profileDropdownOpen.value = false;
};

const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value;
};

const toggleLanguageDropdown = (e: Event) => {
  e.stopPropagation();
  languageDropdownOpen.value = !languageDropdownOpen.value;
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ku', name: 'کوردی' },
  { code: 'ar', name: 'العربية' }
];

const currentLanguage = computed(() => {
  const lang = languages.find(l => l.code === locale.value) || languages[0];
  return lang?.code.toUpperCase().substring(0, 2) || 'EN';
});

const switchLanguage = (langCode: string) => {
  locale.value = langCode;
  localStorage.setItem('locale', langCode);
  languageDropdownOpen.value = false;
};

const closeDropdowns = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.profile-dropdown') && !target.closest('.language-dropdown')) {
    profileDropdownOpen.value = false;
    languageDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});
</script>

<template>
  <header class="rounded-2xl px-6 py-3 min-md:h-[70px] h-[50px] shadow-sm mt-4">
    <nav class="flex justify-between items-center h-full">
      <!-- Left: Logo and Mobile Menu -->
      <div class="flex items-center gap-x-5">
        <img
          src="../assets/icons/menu.svg"
          alt="menu"
          class="size-[19px] cursor-pointer md:hidden"
          @click="handleMenuClick"
        />
        <img
          src="../assets/icons/icon.svg"
          alt="logo"
          class="w-[87.44px] h-[30.31px]"
        />
      </div>

      <!-- Right: Language Selection, Profile Switcher, and Profile Dropdown -->
      <div class="flex items-center gap-3">
        <!-- Language Selection -->
        <div class="relative language-dropdown">
          <button
            @click="toggleLanguageDropdown"
            class="flex items-center justify-center px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 min-w-[50px]"
          >
            <span>{{ currentLanguage }}</span>
            <svg
              class="w-4 h-4 ml-1 transition-transform"
              :class="{ 'rotate-180': languageDropdownOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Language Dropdown Menu -->
          <div
            v-if="languageDropdownOpen"
            class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            @click.stop
          >
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="switchLanguage(lang.code)"
              class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              :class="{ 'bg-blue-50 text-blue-700': locale === lang.code }"
            >
              <span>{{ lang.code.toUpperCase().substring(0, 2) }}</span>
              <svg
                v-if="locale === lang.code"
                class="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Profile Switcher (for users with role 'user' or 'admin' in admin/superAdmin routes) -->
        <ProfileSwitcher v-if="showProfileSwitcher" />
        
        <!-- Theme Toggle -->
        <img
          src="../assets/icons/moon.svg"
          alt="theme toggle"
          class="size-[21px] max-md:hidden"
        />
        
        <!-- Profile Dropdown -->
        <div class="relative profile-dropdown">
          <template v-if="!authStore.isAuthenticated">
            <button 
              @click="goToLogin"
              class="px-5 py-1.5 rounded-full bg-[#0094ff] text-white text-sm font-semibold shadow-sm hover:bg-[#0094ff]/90 transition-colors cursor-pointer"
            >
              {{ t('common.login') }}
            </button>
          </template>
          <template v-else>
            <button 
              @click="toggleProfileDropdown"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center"
              title="Profile menu"
            >
              <!-- User Icon SVG -->
              <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Profile Dropdown Menu -->
            <div
              v-if="profileDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              @click.stop
            >
              <!-- Dashboard -->
              <button
                @click="handleUserClick"
                class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{{ t('admin.dashboard') }}</span>
              </button>
              
              <!-- Logout -->
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{{ t('common.logout') }}</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>
