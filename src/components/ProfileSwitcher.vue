<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
      :class="{ 'bg-gray-50': isOpen }"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span class="hidden md:inline">{{ currentProfileLabel }}</span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-auto bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
      @click.stop
    >
      <button
        @click="switchToUserProfile"
        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        :class="{ 'bg-blue-50 text-blue-700': currentProfile === 'user' }"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>{{ t('profileSwitcher.userProfile') }}</span>
        <svg
          v-if="currentProfile === 'user'"
          class="w-4 h-4 ml-auto text-blue-600"
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
      <button
        @click="switchToAdminProfile"
        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        :class="{ 'bg-blue-50 text-blue-700': currentProfile === 'admin' }"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>{{ t('profileSwitcher.adminProfile') }}</span>
        <svg
          v-if="currentProfile === 'admin'"
          class="w-4 h-4 ml-auto text-blue-600"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/auth'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isOpen = ref(false)
const currentProfile = ref<'user' | 'admin'>('admin') // Default to admin for super admin layout

// Determine current profile based on current route
// - admin routes show "User Profile" (for users with role "user")
// - superAdmin routes show "Admin Profile" (for users with role "admin")
const determineCurrentProfile = () => {
  const routeName = route.name as string
  if (routeName?.startsWith('admin.')) {
    currentProfile.value = 'user' // User sees admin routes as "User Profile"
  } else if (routeName?.startsWith('superAdmin.')) {
    currentProfile.value = 'admin' // Admin sees superAdmin routes as "Admin Profile"
  }
}

// Watch route changes to update current profile
watch(() => route.name, () => {
  determineCurrentProfile()
}, { immediate: true })

// Watch locale changes to update label
const currentProfileLabel = computed(() => {
  // Access locale to make it reactive to language changes
  const _ = locale.value
  return currentProfile.value === 'user' 
    ? t('profileSwitcher.userProfile') 
    : t('profileSwitcher.adminProfile')
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const switchToUserProfile = () => {
  router.push({ name: 'admin.links' })
  isOpen.value = false
}

const switchToAdminProfile = () => {
  router.push({ name: 'superAdmin.users' })
  isOpen.value = false
}

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  determineCurrentProfile()
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

