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
      <ReportBox 
        v-for="(report, index) in reportHistory" 
        :key="index"
        :report="report"
        @click="viewReport"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ReportBox from '../../components/reports/reportBox.vue'

const router = useRouter()
// const route = useRoute() // Will be used when API is implemented to fetch report history by ID

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
  // const reportId = route.params.id // Will be used when API is implemented
  // TODO: Fetch report history from API using route.params.id
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

const viewReport = (report: { id: number }) => {
  router.push({ name: 'superAdmin.reportDetail', params: { id: report.id } })
}

const goBack = () => {
  router.push({ name: 'superAdmin.reports' })
}
</script>

