<template>
  <div class="p-4 md:p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
      <button
        @click="viewReportHistory"
        class="px-6 py-3 bg-gray-600 text-white font-bold rounded hover:bg-gray-700 transition-colors"
      >
        Report History
      </button>
    </div>
    
    <div class="space-y-4">
      <div 
        v-for="(report, index) in reports" 
        :key="index"
        @click="viewReport(index)"
        class="bg-gray-100 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors"
      >
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ report.title }}</h3>
        <p class="text-sm text-gray-700">{{ report.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Report {
  id: number
  title: string
  description: string
}

// Sample data - replace with API call later
const reports = ref<Report[]>([
  {
    id: 1,
    title: 'Harmful Links',
    description: "This user's page contains a harmful links that direct to scam websites"
  },
  {
    id: 2,
    title: 'Harmful Links',
    description: "This user's page contains a harmful links that direct to scam websites"
  },
  {
    id: 3,
    title: 'Harmful Links',
    description: "This user's page contains a harmful links that direct to scam websites"
  }
])

const viewReport = (index: number) => {
  const report = reports.value[index]
  router.push({ name: 'superAdmin.reportDetail', params: { id: report.id } })
}

const viewReportHistory = () => {
  // Navigate to report history - using first report ID as example
  // In real app, this might show all history or history for a specific user
  router.push({ name: 'superAdmin.reportHistory', params: { id: 1 } })
}
</script>

