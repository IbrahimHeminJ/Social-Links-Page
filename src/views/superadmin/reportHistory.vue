<template>
  <div class="p-4 md:p-6">
    <div class="mb-6">
      <button 
        @click="goBack"
        class="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Report History</h1>
    </div>
    
    <div class="space-y-4">
      <div 
        v-for="(report, index) in reportHistory" 
        :key="index"
        @click="viewReport(report.id)"
        class="bg-gray-100 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors"
      >
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ report.title }}</h3>
        <p class="text-sm text-gray-700 mb-2">{{ report.description }}</p>
        <div class="flex items-center gap-4 text-xs text-gray-500">
          <span>Reported by: {{ report.reporterEmail }}</span>
          <span>•</span>
          <span>{{ formatDate(report.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface ReportHistoryItem {
  id: number
  title: string
  description: string
  reporterEmail: string
  createdAt: string
}

const reportHistory = ref<ReportHistoryItem[]>([])

// Load report history (in real app, fetch from API using route.params.id)
onMounted(() => {
  const reportId = route.params.id
  // TODO: Fetch report history from API
  // For now, using sample data
  reportHistory.value = [
    {
      id: 1,
      title: 'Harmful Links',
      description: "This user's page contains a harmful links that direct to scam websites",
      reporterEmail: 'user1@example.com',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Spam Content',
      description: "This user's page contains spam content and misleading information",
      reporterEmail: 'user2@example.com',
      createdAt: '2024-01-14T09:15:00Z'
    },
    {
      id: 3,
      title: 'Harmful Links',
      description: "This user's page contains a harmful links that direct to scam websites",
      reporterEmail: 'user3@example.com',
      createdAt: '2024-01-13T14:20:00Z'
    },
    {
      id: 4,
      title: 'Inappropriate Content',
      description: "This user's page contains inappropriate content that violates community guidelines",
      reporterEmail: 'user4@example.com',
      createdAt: '2024-01-12T11:45:00Z'
    }
  ]
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewReport = (reportId: number) => {
  router.push({ name: 'superAdmin.reportDetail', params: { id: reportId } })
}

const goBack = () => {
  router.push({ name: 'superAdmin.reports' })
}
</script>

