<template>
  <div 
    @click="handleClick"
    class="bg-gray-100 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors"
  >
    <h3 class="text-lg font-bold text-gray-900 mb-2">{{ report.title }}</h3>
    <p class="text-sm text-gray-700" :class="{ 'mb-2': showMetadata }">{{ report.description }}</p>
    <div v-if="showMetadata" class="flex items-center gap-4 text-xs text-gray-500">
      <span v-if="report.reporterEmail">Reported by: {{ report.reporterEmail }}</span>
      <span v-if="report.reporterEmail && report.createdAt">•</span>
      <span v-if="report.createdAt">{{ formatDate(report.createdAt) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Report {
  id: number
  title: string
  description: string
  reporterEmail?: string
  createdAt?: string
}

const props = defineProps<{
  report: Report
}>()

const emit = defineEmits<{
  click: [report: Report]
}>()

const showMetadata = computed(() => {
  return !!(props.report.reporterEmail || props.report.createdAt)
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

const handleClick = () => {
  emit('click', props.report)
}
</script>

