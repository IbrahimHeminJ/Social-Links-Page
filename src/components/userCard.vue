<!-- src/components/UserCard.vue -->
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  id: number;
  name: string;
  role: string;
  avatar: string;
}>();

const goToProfile = () => {
  router.push({
    name: "social-links", // adjust if needed
    params: { id: props.id },
  });
};
</script>

<template>
  <article
    @click="goToProfile"
    class="w-[175px] bg-[#f7f7f7] border border-[#0094ff] rounded-3xl
           flex flex-col items-center text-center py-6 px-4 shadow-sm cursor-pointer
           hover:shadow-md transition-shadow"
  >
    <img
      :src="avatar"
      :alt="name"
      class="w-24 h-24 rounded-full object-cover mb-4"
    />

    <h3 class="text-lg font-semibold mb-1 w-full break-words">
      {{ name }}
    </h3>

    <p class="text-sm text-gray-700 mb-4 w-full break-words">
      {{ role }}
    </p>

    <button
      class="mt-auto px-8 py-2 rounded-xl bg-[#0094ff] text-white font-semibold text-sm shadow-sm
             hover:brightness-110 transition"
      @click="goToProfile"
    >
      View
    </button>
  </article>
</template>
