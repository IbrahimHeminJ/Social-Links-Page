<script setup lang="ts">
  import { ref } from "vue";
  
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
    description: {
      type: String,
      required: false,
    },
  });
  
  // Use defineModel for v-model support (this handles both prop and emit)
  const modelValue = defineModel<string>({ 
    default: "" // Allow empty string as default instead of required
  });
</script>
<template>
  <div class="flex flex-col">
    <label class=" text-gray-700 text-lg font-medium mb-1 md:text-xl">
      {{ label }}
    </label>
    <p class="text-gray-600 text-xs mb-3 pt-2 md:text-[14px]">
      {{ description }}
    </p>
    <input
      :type="type"
      :id="label"
      :placeholder="placeholder"
      v-model="modelValue"
      :class="['caret-[#009AFF] w-full px-4 h-[48px] rounded-[10px] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors border-[#009AFF] focus:border-none', focus ? 'border-b' : 'border-b-3']"
      @focus="focus = true"
      @blur="focus = false"
    />
  </div>
</template>
