<!-- src/components/report/ReportModal.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from 'vue-i18n';
import TextInput from "../inputs/text.vue";

const { t } = useI18n()

const props = defineProps<{
  show: boolean; // controls visibility from parent
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", payload: { title: string; description: string; type: string }): void;
}>();

const title = ref("");
const description = ref("");
const reportType = ref("spam_scam_phishing");

const reportTypes = [
  { value: "spam_scam_phishing", label: t('reports.reportTypes.spamScamPhishing') },
  { value: "impersonation_identity_theft", label: t('reports.reportTypes.impersonationIdentityTheft') },
  { value: "inappropriate_offensive_content", label: t('reports.reportTypes.inappropriateOffensiveContent') },
  { value: "intellectual_property_infringement", label: t('reports.reportTypes.intellectualPropertyInfringement') },
  { value: "fake_identity", label: t('reports.reportTypes.fakeIdentity') },
  { value: "other", label: t('reports.reportTypes.other') },
];

const handleSubmit = () => {
  if (!title.value.trim() || !description.value.trim()) {
    return; // Don't submit if fields are empty
  }
  
  emit("submit", {
    title: title.value.trim(),
    description: description.value.trim(),
    type: reportType.value,
  });
};

// Reset form when modal is closed
const handleClose = () => {
  title.value = "";
  description.value = "";
  reportType.value = "spam_scam_phishing";
  emit("close");
};

// Watch for when modal is closed to reset form
watch(() => props.show, (isOpen) => {
  if (!isOpen) {
    // Reset form when modal is closed
    title.value = "";
    description.value = "";
    reportType.value = "spam_scam_phishing";
  }
});
</script>

<template>
  <!-- Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
  >
    <!-- Modal box -->
    <div
      class="relative bg-white rounded-[24px] w-full max-w-md mx-4 p-6 md:p-8 shadow-lg"
    >
      <!-- Close button -->
      <button
        class="absolute top-4 right-4 text-2xl leading-none hover:scale-110 transition"
        @click="handleClose"
        aria-label="Close report window"
      >
        ×
      </button>

      <!-- Report Title -->
      <div class="space-y-6">
        <TextInput
          :label="t('reports.reportTitle')"
          :placeholder="t('reports.reportTitlePlaceholder')"
          v-model="title"
        />

        <!-- Description -->
        <TextInput
          :label="t('reports.descriptionLabel')"
          :placeholder="t('reports.descriptionPlaceholder')"
          v-model="description"
        />

        <!-- Report Type -->
        <div class="flex flex-col">
          <label class="text-gray-700 text-lg font-medium mb-1 md:text-xl">
            {{ t('reports.reportType') }}
          </label>

          <select
            v-model="reportType"
            class="mt-2 w-full h-[48px] rounded-[10px] bg-gray-50 px-4 text-sm md:text-base
                   border border-[#009AFF] focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:bg-white appearance-none bg-[url('/src/assets/icons/chevron-down.svg')] bg-no-repeat bg-[right_1rem_center]"
          >
            <option
              v-for="option in reportTypes"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Submit button (you can style / rename as you like) -->
        <div class="pt-2 flex justify-end">
          <button
            class="px-6 py-2 rounded-full bg-[#009AFF] text-white font-semibold text-sm shadow-sm
                   hover:brightness-110 transition"
            @click="handleSubmit"
          >
            {{ t('reports.submitReport') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
