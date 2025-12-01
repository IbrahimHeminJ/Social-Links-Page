<script setup lang="ts">
import { watch } from 'vue';

const toast = withDefaults(defineProps<{
  show: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  timeout?: number;
}>(), {
  // default timeout is 5 seconds
  timeout: 5000
});

const emit = defineEmits<{
  close: [];
}>();

let timeoutId: ReturnType<typeof setTimeout> | null = null;

watch(
  () => toast.show,
  (newVal) => {
    if (newVal) {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout to auto-close after 5 seconds
      timeoutId = setTimeout(() => {
        emit('close');
      }, toast.timeout);
    } else {
      // Clear timeout if toast is manually closed
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
  },
  { immediate: true }
);

</script>

<template>
  <div v-if="toast.show" class="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 duration-300">
    <div class="flex items-start gap-3 p-4 rounded-xl shadow-lg border w-80" :class="{
      'bg-red-50 border-red-300': toast.type === 'error',
      'bg-green-50 border-green-300': toast.type === 'success',
      'bg-blue-50 border-blue-300': toast.type === 'info',
    }">
      <!-- Icon -->
      <div class="mt-1 w-6 h-6 flex items-center justify-center rounded-md" :class="{
        'bg-red-500 text-white': toast.type === 'error',
        'bg-green-500 text-white': toast.type === 'success',
        'bg-blue-500 text-white': toast.type === 'info',
      }">
        <span v-if="toast.type === 'error'">!</span>
        <span v-else-if="toast.type === 'success'">✓</span>
        <span v-else-if="toast.type === 'info'">ℹ️</span>
      </div>

      <!-- Text -->
      <div class="flex-1">
        <p class="font-semibold">
          {{ toast.title }}
        </p>
        <p class="text-gray-600 text-sm">
          {{ toast.message }}
        </p>
      </div>

      <!-- Close -->
      <button class="text-gray-500 hover:text-gray-700" @click="emit('close')">
        ✕
      </button>
    </div>
  </div>
</template>
