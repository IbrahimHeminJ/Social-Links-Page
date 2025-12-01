<template>
  <div class="p-4 md:p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ t("reports.title") }}</h1>
      <button @click="viewReportHistory"
        class="px-6 py-3 bg-gray-600 text-white font-bold rounded hover:bg-gray-700 transition-colors">
        {{ t("reports.reportHistory") }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">{{ t("reports.loadingReports") }}</p>
    </div>
    <div v-else-if="reports.length === 0" class="text-center py-8">
      <p class="text-gray-600">{{ t("reports.noReportsFound") }}</p>
    </div>
    <div v-else class="space-y-4">
      <ReportBox v-for="(report, index) in reports" :key="index" :report="report" @click="viewReport" />
    </div>
    <ToastMessage :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
      @close="closeToast" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import ReportBox from "../../components/reports/reportBox.vue";
import { superAdminReportsService } from "../../services/superAdmin";
import ToastMessage from "../../components/alerts/toastMessage.vue";

const { t } = useI18n();

const router = useRouter();

interface Report {
  id: number;
  title: string;
  description: string;
  [key: string]: any; // Allow additional fields from API
}

const reports = ref<Report[]>([]);
const loading = ref(false);

// Toast state
const toast = ref({
  show: false,
  type: 'info' as 'success' | 'error' | 'info',
  title: '',
  message: ''
});

const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
  toast.value = { show: true, type, title, message };
};

const closeToast = () => {
  toast.value.show = false;
};

const fetchReports = async () => {
  loading.value = true;
  try {
    reports.value = await superAdminReportsService.getReports();
  } catch (err: any) {
    showToast('error', 'Error', err.response?.data?.message || t("reports.failedToFetchReports"));
    // console.error("Error fetching reports:", err); // Dead code: Replaced by toastMessage component
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchReports();
});

const viewReport = (report: Report) => {
  router.push({ name: "superAdmin.reportDetail", params: { id: report.id } });
};

const viewReportHistory = () => {
  router.push({ name: "superAdmin.reportHistory" });
};
</script>
