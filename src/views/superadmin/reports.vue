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
      <ReportBox 
        v-for="(report, index) in reports" 
        :key="index"
        :report="report"
        @click="viewReport"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ReportBox from '../../components/reports/reportBox.vue'

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

const viewReport = (report: Report) => {
  router.push({ name: 'superAdmin.reportDetail', params: { id: report.id } })
}

const viewReportHistory = () => {
  // Navigate to report history - using first report ID as example
  // In real app, this might show all history or history for a specific user
  router.push({ name: 'superAdmin.reportHistory', params: { id: 1 } })
}
</script>

