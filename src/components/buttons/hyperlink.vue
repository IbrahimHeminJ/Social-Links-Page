<script setup lang="ts">

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
});
</script>
<template>
    <a class="text-blue-600 text-sm underline hover:text-blue-800 cursor-pointer">
        {{text }}
    </a>
</template>