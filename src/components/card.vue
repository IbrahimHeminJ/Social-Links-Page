<template>
  <div
    class="bg-[#F5F5F5] border border-[#009AFF] rounded-[10px] px-4 py-3 flex justify-between items-center"
  >
    <div class="flex gap-x-5 items-center">
      <img
        v-if="icon && !iconError"
        :src="iconPath"
        :alt="`${icon} icon`"
        class="size-[31px]"
        @error="handleError"
      />
      <div v-else class="size-[31px]" />
      <TextHeading>{{ title }}</TextHeading>
    </div>
    <div>
      <img
        src="../assets/icons/garbage.svg"
        alt="garbage"
        class="w-[17px] h-[21.86px] cursor-pointer"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TextHeading from "./textHeading.vue";
import { ref, computed } from "vue";

interface Props {
  icon: string;
  title: string;
}

const { icon, title } = defineProps<Props>();

const iconError = ref(false);

const iconPath = computed(() => {
  if (!icon) return "";
  try {
    const path = new URL(`../assets/icons/${icon}.svg`, import.meta.url).href;
    console.log("Icon path for", icon, ":", path);
    return path;
  } catch (error) {
    console.error("Error loading icon:", icon, error);
    iconError.value = true;
    return "";
  }
});

const handleError = () => {
  console.log("Icon failed to load:", icon);
  iconError.value = true;
};
</script>
