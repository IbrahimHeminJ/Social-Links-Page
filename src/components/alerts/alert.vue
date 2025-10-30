<template>
  <div class="fixed inset-0 z-50">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- Modal -->
    <div
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-[90%] sm:max-w-[520px] w-[78%] bg-white border border-[#009AFF] rounded-[10px] px-6 py-6 shadow-xl"
    >
      <div class="flex flex-col items-center text-center gap-y-4">
        <div>
          <p class="text-2xl font-semibold">
            Are you sure to <span class="text-red-500">delete</span> this Link?
          </p>
        </div>

        <div class="mt-2 flex flex-col items-center">
          <p class="text-2xl font-bold">{{ item?.title }}</p>
          <p class="text-gray-600 text-xs mt-2">{{ item?.description }}</p>
          <p class="text-gray-500 text-[10px] mt-2">{{ item?.link }}</p>
        </div>

        <div class="w-full flex items-center justify-between gap-x-4 mt-4">
          <button
            class="min-w-[120px] bg-[#009AFF] text-white font-bold p-2 text-2xl rounded-[10px] hover:bg-[#009AFF]/90 transition-colors cursor-pointer"
            @click="$emit('confirm')"
          >
            Yes
          </button>
          <button
            class="min-w-[120px] bg-gray-400 text-2xl text-white font-bold p-2 rounded-[10px] hover:bg-gray-500 transition-colors cursor-pointer"
            @click="$emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"> 

interface LinkItem {
  title: string;
  description: string;
  link: string;
  platform: string;
}

const { item } = defineProps<{ item: LinkItem | null }>();

defineEmits<{
  (e: "close"): void;
  (e: "confirm"): void;
}>();
</script>
