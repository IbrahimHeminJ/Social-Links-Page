<script setup lang="ts">
import GuestLayout from './layouts/guestLayout.vue'
import AuthLayout from './layouts/authLayout.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
    
  <AuthLayout v-if="route.name === 'login' || route.name === 'signup'" /> 
  <GuestLayout v-else />
</template>
