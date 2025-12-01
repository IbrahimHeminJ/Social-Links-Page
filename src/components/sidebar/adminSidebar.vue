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
              :to="{ name: 'superAdmin.users' }"
              class="flex items-center px-4 py-3 rounded-xl font-medium transition-colors"
              :class="route.name === 'superAdmin.users' 
                ? 'bg-[#0094ff] text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {{ t('superAdmin.users') }}
            </router-link>
          </li>
          <li>
            <router-link 
              :to="{ name: 'superAdmin.profile' }"
              class="flex items-center px-4 py-3 rounded-xl font-medium transition-colors"
              :class="route.name === 'superAdmin.profile' 
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
              :to="{ name: 'superAdmin.reports' }"
              class="flex items-center px-4 py-3 rounded-xl font-medium transition-colors"
              :class="route.name === 'superAdmin.reports' 
                ? 'bg-[#0094ff] text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ t('superAdmin.reports') }}
            </router-link>
          </li>
        </ul> 
      </nav>
    </div>
  </aside>
</template>

