<script setup lang="ts">
import AdminLayout from './layouts/adminLayout.vue'
import AuthLayout from './layouts/authLayout.vue'
import GuestLayout from './layouts/guestLayout.vue'
import SocialLinksLayout from './layouts/socialLinksLayout.vue'
import SuperAdminLayout from './layouts/superAdminLayout.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  
  <GuestLayout v-if="route.name === 'home' || route.name === 'explore' || route.name === 'explore-search'"  />
  <AuthLayout v-else-if="route.name === 'login' || route.name === 'signup'" /> 
  <AdminLayout v-else-if="route.name === 'admin.links' || route.name === 'admin.profile' || route.name === 'admin.about' || route.name === 'admin.policies' || route.name === 'admin.themes'" />
  <SuperAdminLayout v-else-if="route.name === 'superAdmin.users' || route.name === 'superAdmin.editUser' || route.name === 'superAdmin.profile' || route.name === 'superAdmin.reports' || route.name === 'superAdmin.reportDetail' || route.name === 'superAdmin.reportHistory'" />
  <SocialLinksLayout v-else-if="route.name === 'social-links'" />
</template>
