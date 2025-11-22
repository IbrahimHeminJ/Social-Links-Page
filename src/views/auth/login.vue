<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Text from '../../components/inputs/text.vue';
import Submit from '../../components/buttons/submit.vue';
import Hyperlink from '../../components/buttons/hyperlink.vue';

const router = useRouter()

  const loginData = ref({
    username: '',
    password: ''
  })
  const goToSignup = () => {
    router.push({ name: 'signup' })
  }
  
  const handleLogin = () => {
    console.log(loginData.value)
    console.log('Login clicked')
  }

</script>
<template>
  <div class=" w-full bg-white flex flex-col items-center justify-center px-4 pt-0">
    <!-- Logo -->
    <div class="flex flex-col  items-center mb-8">
      <div class="flex  items-center justify-center mb-4">
        <img src="../../assets/icons/icon.svg" alt="logo" class="w-3/4 h-32 mr-4">

      </div>
    </div>

    <h2 class="text-2xl text-gray-700 mb-8">Welcome</h2>

    <!-- Login Form -->
    <div class="w-full max-w-md">

      <!-- Username/Email Field -->
      <Text v-model="loginData.username" label="Username or Email" placeholder="Enter your username" type="text" class="mb-6" />

      <!-- Password Field -->
      <Text v-model="loginData.password" label="Password" placeholder="Enter your password" type="password" class="mb-6" />
  

      <!-- Login Button -->
      <Submit text="Login" @click="handleLogin" class="h-[50px] mb-6" />

      <!-- Sign Up Link -->
      <div class="text-center">
        <span class="text-gray-600 text-sm">Do not have an account? </span>
          <Hyperlink text="Sign Up here" @click="goToSignup" />
      </div>
    </div>
  </div>
</template>
