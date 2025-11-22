    
<script setup lang="ts">
    
  import { defineProps,ref } from "vue";
  const focus = ref(false);
  const props = defineProps({
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text",
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  });
    
  const emit = defineEmits(["update:modelValue"]);
  const modelValue = defineModel<string>({ required: true });
</script>
<template>
  <div class="flex flex-col gap-y-4">
    <label class=" text-gray-700 text-lg font-medium mb-1 md:text-xl">
      {{ label }}
    </label>
    <input
      type="{{ type }}"
      :id="label"
      :placeholder="placeholder"
      v-model="modelValue"
      :class="['caret-[#009AFF] w-full px-4 h-[48px] rounded-[10px] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors border-[#009AFF] focus:border-none', focus ? 'border-b' : 'border-b-3']"
      @focus="focus = true"
      @blur="focus = false"
    />
  </div>
</template>
