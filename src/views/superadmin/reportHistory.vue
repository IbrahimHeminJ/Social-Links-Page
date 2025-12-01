<template>
  <div class="p-4 md:p-6">
    <div class="mb-6">
      <button
        @click="goBack"
        class="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {{ t("reports.back") }}
      </button>
      <h1 class="text-2xl font-bold text-gray-900">
        {{ t("reports.reportHistory") }}
      </h1>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">{{ t("reports.loadingReportHistory") }}</p>
    </div>
    <div v-else-if="reportHistory.length === 0" class="text-center py-8">
      <p class="text-gray-600">{{ t("reports.noReportHistoryFound") }}</p>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import ReportBox from "../../components/reports/reportBox.vue";
import { superAdminReportsService } from "../../services/superAdmin";
import { useToast } from "../../composables/useToast";

const { t } = useI18n();
const { showToast } = useToast();
const router = useRouter();

interface ReportHistoryItem {
  id: number;
  title: string;
  description: string;
  reporterEmail?: string;
  createdAt?: string;
  [key: string]: any; // Allow additional fields from API
}

const reportHistory = ref<ReportHistoryItem[]>([]);
const loading = ref(false);

const fetchReportHistory = async () => {
  loading.value = true;
  try {
    reportHistory.value = await superAdminReportsService.getResolvedReports();
  } catch (err: any) {
    showToast({
      type: "error",
      message: err.response?.data?.message || t("reports.failedToFetchReportHistory"),
    });
    console.error("Error fetching report history:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchReportHistory();
});

const viewReport = (report: { id: number }) => {
  router.push({ name: "superAdmin.reportDetail", params: { id: report.id } });
};

const goBack = () => {
  router.push({ name: "superAdmin.reports" });
};
</script>
