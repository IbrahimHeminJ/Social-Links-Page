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
        {{ t('reports.backToReports') }}
      </button>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ t('reports.reportDetails') }}</h1>
      <h2 v-if="reportData.reportType" class="text-xl font-bold text-gray-900">{{ getReportTypeLabel(reportData.reportType) }}</h2>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">{{ t('reports.loadingReportDetails') }}</p>
    </div>
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
    </div>
    <div v-else class="space-y-6 max-w-2xl">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">{{ t('reports.titleLabel') }}</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900">
          {{ reportData.title || t('reports.noTitleProvided') }}
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">{{ t('reports.descriptionLabel') }}</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900 min-h-[100px] whitespace-pre-wrap">
          {{ reportData.description || t('reports.noDescriptionProvided') }}
        </div>
      </div>

      <!-- Who Reported -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">{{ t('reports.reporterEmail') }}</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900">
          {{ reportData.reporterEmail || t('reports.notAvailable') }}
        </div>
      </div>

      <!-- Reported On User -->
      <div v-if="reportData.reportedUser">
        <label class="block text-sm font-medium text-gray-900 mb-2">{{ t('reports.reportedUser') }}</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900">
          {{ reportData.reportedUser }}
        </div>
      </div>

      <!-- Report Type -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">{{ t('reports.reportType') }}</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900">
          {{ getReportTypeLabel(reportData.reportType) || reportData.reportType || t('reports.notSpecified') }}
        </div>
      </div>

      <!-- Status -->
      <div v-if="reportData.reportStatus !== undefined">
        <label class="block text-sm font-medium text-gray-900 mb-2">{{ t('reports.status') }}</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900">
          {{ reportData.reportStatus === 1 ? t('reports.resolved') : reportData.reportStatus === 0 ? t('reports.pending') : t('reports.unknown') }}
        </div>
      </div>

      <!-- Handled By -->
      <div v-if="reportData.handledBy">
        <label class="block text-sm font-medium text-gray-900 mb-2">{{ t('reports.handledBy') }}</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900">
          {{ reportData.handledBy }}
        </div>
      </div>

      <!-- Created At -->
      <div v-if="reportData.createdAt">
        <label class="block text-sm font-medium text-gray-900 mb-2">{{ t('reports.createdAt') }}</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900">
          {{ formatDate(reportData.createdAt) }}
        </div>
      </div>

      <!-- Action -->
      <Select
        v-model="reportData.action"
        :label="t('reports.action')"
        :placeholder="t('reports.selectAction')"
        :options="actionOptions"
      />

      <!-- Reason for action -->
      <Text 
        :label="t('reports.reasonForAction')" 
        v-model="reportData.reason" 
        type="text" 
        :placeholder="t('reports.enterReasonForAction')" 
      />

      <!-- Previous Reason of Action (if exists and report is already resolved) -->
      <div v-if="reportData.reasonOfAction && reportData.reportStatus === 1">
        <label class="block text-sm font-medium text-gray-900 mb-2">{{ t('reports.previousReasonOfAction') }}</label>
        <div class="w-full px-4 py-3 bg-gray-100 rounded text-gray-900">
          {{ reportData.reasonOfAction }}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center gap-4 pt-4">
        <button
          @click="handleResolve"
          class="px-8 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors"
        >
          {{ t('reports.resolve') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Text from '../../components/inputs/text.vue'
import Select from '../../components/inputs/select.vue'
import api from '../../services/api'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

interface ReportData {
  id: number
  type: string
  title: string
  description: string
  reporterEmail: string
  reportedUser: string
  reportType: string
  action: string
  reason: string
  reportStatus?: number
  handledBy?: string | null
  reasonOfAction?: string
  createdAt?: string
  updatedAt?: string
}

const reportData = ref<ReportData>({
  id: 0,
  type: '',
  title: '',
  description: '',
  reporterEmail: '',
  reportedUser: '',
  reportType: '',
  action: '',
  reason: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

const actionOptions = [
  { label: t('reports.actions.deleteUser'), value: 'delete-user' },
  { label: t('reports.actions.warnUser'), value: 'warn-user' },
  { label: t('reports.actions.banUser'), value: 'ban-user' },
  { label: t('reports.actions.dismiss'), value: 'dismiss' },
  { label: t('reports.actions.normal'), value: 'normal' }
]

// Fetch report data from API
const fetchReportDetail = async () => {
  loading.value = true
  error.value = null
  try {
    const reportId = route.params.id
    
    console.log('Fetching report detail for ID:', reportId)
    
    // Fetch report detail using the direct endpoint
    const response = await api.get(`/admin/reports/${reportId}`)
    console.log('Report Detail API Response:', response.data)
    
    // Handle nested data structure - the API returns { id: 1, data: { ... } }
    const report = response.data?.data || response.data
    const reportDataObj = report.data || report
    
    // Map the API response to our ReportData interface
    // Title and description are read-only (from API)
    // Action and reason are editable (not pre-filled)
    reportData.value = {
      id: report.id || Number(reportId),
      type: reportDataObj.report_type || reportDataObj.reportType || '',
      title: reportDataObj.title || 'Untitled Report',
      description: reportDataObj.description || 'No description provided', // Use description only, don't use reason_of_action
      reporterEmail: reportDataObj.email_of_reporter || reportDataObj.emailOfReporter || reportDataObj.reporter_email || '',
      reportedUser: reportDataObj.reported_user || reportDataObj.reportedUser || reportDataObj.user_id || reportDataObj.userId || '',
      reportType: reportDataObj.report_type || reportDataObj.reportType || '',
      action: '', // Empty - admin will fill this
      reason: '', // Empty - admin will fill this
      reportStatus: reportDataObj.report_status || reportDataObj.reportStatus,
      handledBy: reportDataObj.handled_by || reportDataObj.handledBy,
      reasonOfAction: reportDataObj.reason_of_action || reportDataObj.reasonOfAction, // This is the previous reason, not the new one
      createdAt: reportDataObj.created_at || reportDataObj.createdAt,
      updatedAt: reportDataObj.updated_at || reportDataObj.updatedAt
    }
    
    console.log('Mapped Report Data:', reportData.value)
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || t('reports.failedToFetchReportDetails')
    console.error('Error fetching report detail:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReportDetail()
})

const getReportTypeLabel = (value: string) => {
  if (!value) return t('reports.reportTypeLabels.unknown')
  
  // Normalize the value for lookup - remove spaces, hyphens, underscores
  const normalizedValue = value.toLowerCase().replace(/[-\s_]/g, '')
  
  const labelMap: Record<string, string> = {
    'harmfullinks': 'harmfulLinks',
    'spam': 'spam',
    'spamscamandphishing': 'spamScamPhishing',
    'spamscamphishing': 'spamScamPhishing',
    'malwareorharmfulcontent': 'malwareHarmfulContent',
    'inappropriateorabusivecontent': 'inappropriateAbusiveContent',
    'impersonationorfakeidentity': 'impersonationFakeIdentity',
    'impersonationidentitytheft': 'impersonationFakeIdentity',
    'inappropriatecontent': 'inappropriateContent',
    'inappropriateoffensivecontent': 'inappropriateContent',
    'fakeaccount': 'fakeAccount',
    'fakeidentity': 'fakeAccount',
    'harassment': 'harassment',
    'other': 'other'
  }
  
  const key = labelMap[normalizedValue]
  if (key) {
    return t(`reports.reportTypeLabels.${key}`)
  }
  
  // Fallback: try to use the value directly if it matches a key pattern
  const camelCaseKey = normalizedValue.replace(/([a-z])([A-Z])/g, '$1$2').toLowerCase()
  const translationKey = `reports.reportTypeLabels.${camelCaseKey}`
  const translation = t(translationKey)
  
  // If translation returns the key itself, it means it doesn't exist, so return original value
  return translation !== translationKey ? translation : value || t('reports.reportTypeLabels.unknown')
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleResolve = async () => {
  // Validate required fields
  if (!reportData.value.action) {
    alert('Please select an action')
    return
  }

  if (!reportData.value.reason || !reportData.value.reason.trim()) {
    alert('Please enter a reason for the action')
    return
  }

  try {
    const reportId = reportData.value.id
    
    // Map action to delete_user: 1 for "delete-user", 0 for others
    const deleteUser = reportData.value.action === 'delete-user' ? 1 : 0
    
    console.log('Resolving report:', {
      reportId,
      action: reportData.value.action,
      deleteUser,
      reason: reportData.value.reason
    })
    
    // Call API to resolve the report (using POST since PUT is not supported)
    const response = await api.post(`/admin/reports/${reportId}`, {
      delete_user: deleteUser,
      reason_of_action: reportData.value.reason.trim()
    })
    
    console.log('Report resolved successfully:', response.data)
    
    // Show success message
    alert('Report resolved successfully')
    
    // Navigate back to reports list
    goBack()
  } catch (err: any) {
    console.error('Error resolving report:', err)
    const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to resolve report. Please try again.'
    alert(errorMessage)
  }
}

const goBack = () => {
  router.push({ name: 'superAdmin.reports' })
}
</script>

