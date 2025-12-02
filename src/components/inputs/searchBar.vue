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
  <div class="search-bar-container">
    <!-- Input -->
    <input
      type="text"
      class="search-input"
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
      class="search-button"
      type="button"
    >
      {{ t('common.search') }}
    </button>
  </div>
</template>

<style scoped>
.search-bar-container {
  width: 100%;
  background-color: #f4f4f4;
  border-radius: 9999px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid transparent;
  transition: background-color 200ms ease, border-color 200ms ease;
}

.theme-dark .search-bar-container {
  background-color: #111827;
  border-color: #1f2937;
}

.search-input {
  flex: 1;
  background-color: transparent;
  outline: none;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #111827;
  border: none;
  padding: 0;
  margin: 0;
}

.search-input::placeholder {
  color: #6b7280;
}

.theme-dark .search-input {
  color: #e2e8f0;
}

.theme-dark .search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  outline: none;
  border: none;
  box-shadow: none;
  ring: none;
}

.search-button {
  margin-left: 8px;
  padding: 6px 16px;
  border-radius: 9999px;
  background-color: #0094ff;
  color: white;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  transition: background-color 200ms ease;
  border: none;
  cursor: pointer;
}

.search-button:hover {
  background-color: rgba(0, 148, 255, 0.9);
}
</style>
