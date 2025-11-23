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
        Back to Reports
      </button>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Report</h1>
      <h2 class="text-xl font-bold text-gray-900">{{ reportData.type }}</h2>
    </div>
    
    <div class="space-y-6 max-w-2xl">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">Title Here</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900">
          {{ reportData.title }}
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">Description</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900 min-h-[100px]">
          {{ reportData.description }}
        </div>
      </div>

      <!-- Who Reported -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">Who Reported</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900">
          {{ reportData.reporterEmail }}
        </div>
      </div>

      <!-- Reported On User -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">Reported On User</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900">
          {{ reportData.reportedUser }}
        </div>
      </div>

      <!-- Reported Type -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">Report Type</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900">
          {{ getReportTypeLabel(reportData.reportType) }}
        </div>
      </div>

      <!-- Action -->
      <Select
        v-model="reportData.action"
        label="Action"
        placeholder="Select an action"
        :options="actionOptions"
      />

      <!-- Reason for action -->
        <Text label="Reason for action" v-model="reportData.reason" type="text" placeholder="Enter reason for action" />


      <!-- Action Buttons -->
      <div class="flex justify-center gap-4 pt-4">
        <button
          @click="handleResolve"
          class="px-8 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors"
        >
          Resolve
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Text from '../../components/inputs/text.vue'
import Select from '../../components/inputs/select.vue'

const router = useRouter()
const route = useRoute()

interface ReportData {
  type: string
  title: string
  description: string
  reporterEmail: string
  reportedUser: string
  reportType: string
  action: string
  reason: string
}

const reportData = ref<ReportData>({
  type: 'Harmful websites',
  title: '',
  description: '',
  reporterEmail: '',
  reportedUser: '',
  reportType: 'harmful-links',
  action: 'delete-user',
  reason: ''
})

const actionOptions = [
  { label: 'Delete user', value: 'delete-user' },
  { label: 'Normal', value: 'normal' }
]

// Load report data (in real app, fetch from API using route.params.id)
onMounted(() => {
  const reportId = route.params.id
  // TODO: Fetch report data from API
  // For now, using sample data
  reportData.value = {
    type: 'Harmful websites',
    title: 'Harmful Links',
    description: 'Reports description, oudnkjewnkddrefwavnr reh ohfreohr ffhhe oihd hl osdihffoifhos gofhigdfjneo e eifnhuh df tghfepore andc f sndf dbf dslkhefe ofw erfjwe',
    reporterEmail: 'Me@gmial.com',
    reportedUser: 'halwest_proGamer',
    reportType: 'harmful-links',
    action: 'delete-user',
    reason: ''
  }
})

const getReportTypeLabel = (value: string) => {
  const labels: Record<string, string> = {
    'harmful-links': 'Harmful Links',
    'spam': 'Spam',
    'inappropriate-content': 'Inappropriate Content',
    'fake-account': 'Fake Account'
  }
  return labels[value] || value
}

const getActionLabel = (value: string) => {
  const labels: Record<string, string> = {
    'delete-user': 'Delete User',
    'warn-user': 'Warn User',
    'ban-user': 'Ban User',
    'dismiss': 'Dismiss'
  }
  return labels[value] || value
}

const handleResolve = () => {
  // TODO: Implement resolve functionality
  console.log('Resolve report:', reportData.value)
  // After resolve, navigate back
  goBack()
}

const viewReportHistory = () => {
  const reportId = route.params.id
  router.push({ name: 'superAdmin.reportHistory', params: { id: reportId } })
}

const goBack = () => {
  router.push({ name: 'superAdmin.reports' })
}
</script>

