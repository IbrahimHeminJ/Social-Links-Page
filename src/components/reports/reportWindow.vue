<!-- src/components/report/ReportModal.vue -->
<script setup lang="ts">
import { ref } from "vue";
import TextInput from "../inputs/text.vue";

const props = defineProps<{
  show: boolean; // controls visibility from parent
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", payload: { title: string; description: string; type: string }): void;
}>();

const title = ref("");
const description = ref("");
const reportType = ref("spam, scam and phishing");

const reportTypes = [
  "spam, scam and phishing",
  "malware or harmful content",
  "inappropriate or abusive content",
  "impersonation or fake identity",
  "other",
];

const handleSubmit = () => {
  emit("submit", {
    title: title.value.trim(),
    description: description.value.trim(),
    type: reportType.value,
  });
};
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
        @click="emit('close')"
        aria-label="Close report window"
      >
        ×
      </button>

      <!-- Report Title -->
      <div class="space-y-6">
        <TextInput
          label="Report Title"
          placeholder="e.g. Bad links"
          v-model="title"
        />

        <!-- Description -->
        <TextInput
          label="Description"
          placeholder="e.g. one of the links redirects you to a scam page and it is not safe"
          v-model="description"
        />

        <!-- Report Type -->
        <div class="flex flex-col">
          <label class="text-gray-700 text-lg font-medium mb-1 md:text-xl">
            Report Type
          </label>

          <select
            v-model="reportType"
            class="mt-2 w-full h-[48px] rounded-[10px] bg-gray-50 px-4 text-sm md:text-base
                   border border-[#009AFF] focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:bg-white appearance-none bg-[url('/src/assets/icons/chevron-down.svg')] bg-no-repeat bg-[right_1rem_center]"
          >
            <option
              v-for="option in reportTypes"
              :key="option"
              :value="option"
            >
              {{ option }}
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
            Submit report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
