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
        {{ t('reports.back') }}
      </button>
      <h1 class="text-2xl font-bold text-gray-900">{{ t('reports.reportHistory') }}</h1>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">{{ t('reports.loadingReportHistory') }}</p>
    </div>
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
    </div>
    <div v-else-if="reportHistory.length === 0" class="text-center py-8">
      <p class="text-gray-600">{{ t('reports.noReportHistoryFound') }}</p>
    </div>
    <div v-else class="space-y-4">
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
import { useI18n } from 'vue-i18n'
import ReportBox from '../../components/reports/reportBox.vue'
import api from '../../services/api'

const { t } = useI18n()
const router = useRouter()

interface ReportHistoryItem {
  id: number
  title: string
  description: string
  reporterEmail?: string
  createdAt?: string
  [key: string]: any // Allow additional fields from API
}

const reportHistory = ref<ReportHistoryItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchReportHistory = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/admin/reports/resolved')
    console.log('Report History API Response:', response.data)
    
    // Handle different response structures
    const rawReports = response.data?.data || response.data || []
    
    // Map API response to expected format, filter out null/undefined
    // The API returns reports with nested data structure: { id: 1, data: { title, description, ... } }
    reportHistory.value = rawReports
      .filter((report: any) => report != null && report.data != null) // Remove null/undefined reports
      .map((report: any) => {
        const reportData = report.data || report // Handle both nested and flat structures
        
        // Extract title from nested data structure
        const title = reportData.title || 
                     reportData.report_type || 
                     reportData.reportType ||
                     reportData.type || 
                     t('reports.untitledReport')
        
        // Extract description - use reason_of_action if description is null
        const description = reportData.description || 
                           reportData.reason_of_action ||
                           reportData.reasonOfAction ||
                           reportData.message || 
                           reportData.content || 
                           reportData.body || 
                           reportData.text || 
                           reportData.details ||
                           reportData.note ||
                           t('reports.noDescriptionAvailable')
        
        return {
          id: report.id,
          title: String(title),
          description: String(description),
          reporterEmail: reportData.email_of_reporter || reportData.emailOfReporter || reportData.reporter_email,
          createdAt: reportData.created_at || reportData.createdAt,
          reportType: reportData.report_type || reportData.reportType,
          reportStatus: reportData.report_status || reportData.reportStatus,
          handledBy: reportData.handled_by || reportData.handledBy,
          reasonOfAction: reportData.reason_of_action || reportData.reasonOfAction,
          ...reportData // Include all other fields from data
        }
      })
    
    console.log('Mapped Report History:', reportHistory.value)
  } catch (err: any) {
    error.value = err.response?.data?.message || t('reports.failedToFetchReportHistory')
    console.error('Error fetching report history:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReportHistory()
})

const viewReport = (report: { id: number }) => {
  router.push({ name: 'superAdmin.reportDetail', params: { id: report.id } })
}

const goBack = () => {
  router.push({ name: 'superAdmin.reports' })
}
</script>

