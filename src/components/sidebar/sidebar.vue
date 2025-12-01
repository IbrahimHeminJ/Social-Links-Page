<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface Props {
  toggleSidebar?: () => void;
}

const props = defineProps<Props>();
const route = useRoute()
const { t } = useI18n()
</script>
<template> 
  <aside
    class="bg-white border-r border-gray-200 flex flex-col items-start md:items-center px-6 py-6 md:w-[280px] w-[260px] self-stretch shadow-sm relative"
  >
    <!-- Close button for mobile -->
    <button
      v-if="toggleSidebar"
      @click="toggleSidebar"
      class="absolute top-2 right-4 md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Close sidebar"
    >
      <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    
    <div class="flex flex-col items-start justify-start gap-y-8 w-full">
      <nav class="w-full">
        <ul class="flex flex-col gap-y-2 text-base w-full">
          <li>
            <router-link 
              :to="{ name: 'admin.links' }"
              class="flex items-center px-4 py-3 rounded-xl font-medium transition-colors"
              :class="route.name === 'admin.links' 
                ? 'bg-[#0094ff] text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {{ t('admin.links') }}
            </router-link>
          </li>
          <li>
            <router-link 
              :to="{ name: 'admin.profile' }"
              class="flex items-center px-4 py-3 rounded-xl font-medium transition-colors"
              :class="route.name === 'admin.profile' 
                ? 'bg-[#0094ff] text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ t('admin.profile') }}
            </router-link>
          </li>
          <li>
            <router-link 
              :to="{ name: 'admin.themes' }"
              class="flex items-center px-4 py-3 rounded-xl font-medium transition-colors"
              :class="route.name === 'admin.themes' 
                ? 'bg-[#0094ff] text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              {{ t('admin.themes') }}
            </router-link>
          </li>
          <li>
            <router-link 
              :to="{ name: 'admin.subscription' }"
              class="flex items-center px-4 py-3 rounded-xl font-medium transition-colors"
              :class="route.name === 'admin.subscription' 
                ? 'bg-[#0094ff] text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              {{ t('admin.subscription') }}
            </router-link>
          </li>
        </ul> 
      </nav>
    </div>
  </aside>
</template>
