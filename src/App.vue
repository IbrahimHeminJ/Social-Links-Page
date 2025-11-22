<script setup lang="ts">
import AdminLayout from './layouts/adminLayout.vue'
import AuthLayout from './layouts/authLayout.vue'
import GuestLayout from './layouts/guestLayout.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  
  <GuestLayout v-if="route.name === 'home'" />
  <AuthLayout v-else-if="route.name === 'login' || route.name === 'signup'" /> 
  <AdminLayout v-else-if="route.name === 'user'" />
</template>
