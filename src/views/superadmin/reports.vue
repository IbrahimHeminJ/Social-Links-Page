<template>
  <div class="p-4 md:p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('reports.title') }}</h1>
      <button
        @click="viewReportHistory"
        class="px-6 py-3 bg-gray-600 text-white font-bold rounded hover:bg-gray-700 transition-colors"
      >
        {{ t('reports.reportHistory') }}
      </button>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">{{ t('reports.loadingReports') }}</p>
    </div>
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
    </div>
    <div v-else-if="reports.length === 0" class="text-center py-8">
      <p class="text-gray-600">{{ t('reports.noReportsFound') }}</p>
    </div>
    <div v-else class="space-y-4">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ReportBox from '../../components/reports/reportBox.vue'
import api from '../../services/api'

const { t } = useI18n()

const router = useRouter()

interface Report {
  id: number
  title: string
  description: string
  [key: string]: any // Allow additional fields from API
}

const reports = ref<Report[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchReports = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/admin/reports/show')
    console.log('Reports API Response:', response.data)
    
    // Handle different response structures
    const rawReports = response.data?.data || response.data || []
    
    // Log first report to see actual structure
    if (rawReports.length > 0) {
      const firstReport = rawReports[0]
      console.log('=== REPORT STRUCTURE DEBUG ===')
      console.log('First report (full object):', firstReport)
      console.log('First report (JSON):', JSON.stringify(firstReport, null, 2))
      console.log('All field names:', Object.keys(firstReport))
      console.log('Field values:', Object.entries(firstReport).map(([key, value]) => `${key}: ${value}`))
      console.log('=== END DEBUG ===')
    }
    
    // Map API response to expected format, filter out null/undefined
    // The API returns reports with nested data structure: { id: 1, data: { title, description, ... } }
    reports.value = rawReports
      .filter((report: any) => report != null && report.data != null) // Remove null/undefined reports
      .map((report: any) => {
        const reportData = report.data || report // Handle both nested and flat structures
        
        // Extract title from nested data structure
        const title = reportData.title || 
                     reportData.report_type || 
                     reportData.reportType ||
                     reportData.type || 
                     'Untitled Report'
        
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
                           'No description available'
        
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
    
    console.log('Mapped Reports:', reports.value)
    if (reports.value.length > 0) {
      console.log('First mapped report:', reports.value[0])
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || t('reports.failedToFetchReports')
    console.error('Error fetching reports:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReports()
})

const viewReport = (report: Report) => {
  console.log('Clicking report:', report)
  console.log('Report ID:', report.id, 'Type:', typeof report.id)
  router.push({ name: 'superAdmin.reportDetail', params: { id: report.id } })
}

const viewReportHistory = () => {
  router.push({ name: 'superAdmin.reportHistory', params: { id: 1 } })
}
</script>

