<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: string;
  categories?: string[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "selectTag", tag: string): void;
  (e: "back"): void;
}>();

const localQuery = ref(props.modelValue);

// Sync external v-model -> internal
watch(
  () => props.modelValue,
  (v) => (localQuery.value = v)
);

// Sync internal -> external
watch(localQuery, (v) => emit("update:modelValue", v));

const defaultCategories = [
  "Designers",
  "Motion Designer",
  "Software Engineer",
  "Pro LinkedIn",
  "Youtuber",
  "Facebook",
];

const categoryList = props.categories ?? defaultCategories;

const pickCategory = (tag: string) => {
  emit("selectTag", tag);
};
</script>

<template>
  <div class="w-full">
    <!-- Subtitle -->
    <p class="mt-10 text-xl font-medium lg:ml-32">
      Or Choose from here
    </p>

    <!-- Category buttons grid -->
    <div
      class="mt-6 grid grid-cols-1 gap-4 max-w-2xl mx-auto
             lg:grid-cols-2 lg:max-w-4xl lg:gap-x-8 lg:gap-y-6"
    >
      <button
        v-for="cat in categoryList"
        :key="cat"
        @click="pickCategory(cat)"
        class="w-full text-left text-lg font-medium
               bg-[#f7f7f7] border border-[#0094ff]
               rounded-2xl py-4 px-6 hover:bg-[#eaf6ff] transition"
      >
        {{ cat }}
      </button>
    </div>

  </div>
</template>
