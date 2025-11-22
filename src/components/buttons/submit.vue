<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps({
    text: {
        type: String,
        default: "Submit",
        required: true,
    },
});
</script>

<template>
    <button type="submit"
    class="w-full cursor-pointer bg-[#009AFF] text-white font-bold py-1.5 px-9 rounded-[10px] hover:bg-[#009AFF]/80 transition-colors"
    >
        {{ props.text }}
    </button>
</template>