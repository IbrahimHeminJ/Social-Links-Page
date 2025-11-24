<!-- src/components/SearchBar.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'focus'): void
  (e: 'blur'): void
}>();

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
};

const onKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('search', props.modelValue);
  }
};
</script>

<template>
  <div
    class="w-full bg-[#f4f4f4] rounded-full px-4 py-3 flex items-center shadow-sm"
  >
    <!-- Input -->
    <input
      type="text"
      class="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500"
      :placeholder="placeholder ?? t('home.exploreCommunity')"
      :value="modelValue"
      @input="onInput"
      @keyup="onKeyup"
      @focus="emit('focus')"
      @blur="emit('blur')"
    />
    
    <!-- Search Button -->
    <button
      @click="emit('search', props.modelValue)"
      class="ml-2 px-4 py-1.5 rounded-full bg-[#0094ff] text-white text-sm font-semibold hover:bg-[#0094ff]/90 transition-colors"
      type="button"
    >
      {{ t('common.search') }}
    </button>
  </div>
</template>
