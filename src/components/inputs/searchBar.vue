<!-- src/components/SearchBar.vue -->
<script setup lang="ts">
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
    <!-- Search icon -->
    <div class="mr-3 flex items-center justify-center">
      <!-- simple magnifier icon -->
      <img src="/src/assets/icons/search.svg" alt="Search Icon" class="w-6 h-auto" />
    </div>

    <!-- Input -->
    <input
      type="text"
      class="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500"
      :placeholder="placeholder ?? 'Explore Community'"
      :value="modelValue"
      @input="onInput"
      @keyup="onKeyup"
      @focus="emit('focus')"
      @blur="emit('blur')"
    />
  </div>
</template>
