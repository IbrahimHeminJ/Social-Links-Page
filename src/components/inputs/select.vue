<template>
  <div class="flex flex-col gap-y-4 relative">
    <label :for="label">
      <TextHeading>{{ label }}</TextHeading>
    </label>
    <div class="relative">
      <button
        type="button"
        @click="toggleDropdown"
        class="caret-[#009AFF] w-full px-4 h-[48px] rounded-[10px] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors border-[#009AFF] border-b-2 focus:border-none flex items-center justify-between cursor-pointer"
        :class="{ 'rounded-b-none': isOpen }"
      >
        <span v-if="selectedOption" class="flex items-center gap-2">
          <span class="text-lg">{{ getIcon(selectedOption) }}</span>
          <span>{{ selectedOption }}</span>
        </span>
        <span v-else class="text-gray-400">{{ placeholder }}</span>
        <svg
          class="w-5 h-5 text-gray-500 transition-transform"
          :class="{ 'transform rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="absolute z-50 w-full mt-1 bg-white border border-gray-300 border-t-0 rounded-b-[10px] shadow-lg max-h-64 overflow-auto"
          style="border-top: none"
        >
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            @click="selectOption(option)"
            class="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors cursor-pointer text-left"
            :class="{ 'bg-blue-50': selectedOption === option.label }"
          >
            <span class="text-lg min-w-[24px]">{{
              getIcon(option.label)
            }}</span>
            <span class="flex-1">{{ option.label }}</span>
            <svg
              v-if="selectedOption === option.label"
              class="w-5 h-5 text-[#009AFF]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextHeading from "../textHeading.vue";
import { ref, onMounted, onUnmounted, watch } from "vue";

interface Option {
  label: string;
  value: string;
}

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Select an option",
    required: true,
  },
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const selectedOption = ref<string | null>(null);

// Sync with modelValue prop
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      const option = options.find((opt) => opt.value === newValue);
      selectedOption.value = option ? option.label : null;
    } else {
      selectedOption.value = null;
    }
  },
  { immediate: true }
);

const options: Option[] = [
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
  { label: "GitHub", value: "github" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Twitter", value: "twitter" },
  { label: "YouTube", value: "youtube" },
  { label: "Snapchat", value: "snapchat" },
  { label: "TikTok", value: "tiktok" },
  { label: "Discord", value: "discord" },
  { label: "Telegram", value: "telegram" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Pinterest", value: "pinterest" },
  { label: "Reddit", value: "reddit" },
  { label: "Twitch", value: "twitch" },
  { label: "Spotify", value: "spotify" },
];

const getIcon = (label: string): string => {
  const iconMap: { [key: string]: string } = {
    Instagram: "📷",
    Facebook: "📘",
    GitHub: "🐙",
    LinkedIn: "💼",
    Twitter: "🐦",
    YouTube: "▶️",
    Snapchat: "👻",
    TikTok: "🎵",
    Discord: "💬",
    Telegram: "✈️",
    WhatsApp: "💬",
    Pinterest: "📌",
    Reddit: "🔴",
    Twitch: "🎮",
    Spotify: "🎵",
  };
  return iconMap[label] || "🔗";
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: Option) => {
  selectedOption.value = option.label;
  emit("update:modelValue", option.value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
