<template>
  <div class="flex flex-col gap-y-4">
    <label for="{{ label }}">
      <TextHeading>{{ label }}</TextHeading>
    </label>
    <input
      type="{{ type }}"
      :id="label"
      :placeholder="placeholder"
      v-model="modelValue"
      class="caret-[#009AFF] w-full px-4 h-[48px] rounded-[10px] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors border-[#009AFF] border-b-2 focus:border-none"
    />
  </div>
</template>

<script setup lang="ts">
import TextHeading from "../textHeading.vue";
import { defineProps } from "vue";
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
});

const emit = defineEmits(["update:modelValue"]);
const modelValue = defineModel<string>({ required: true });
</script>
