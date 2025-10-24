<template>
  <div class=" w-full bg-white flex flex-col items-center justify-center px-4 pt-0">
    <!-- Logo -->
    <div class="flex flex-col  items-center mb-8">
      <div class="flex  items-center justify-center mb-4">
        <img src="../../assets/icons/icon.svg" alt="logo" class="w-[100%] h-32 mr-4">
        
      </div>
    </div>

    <h2 class="text-2xl text-gray-700 mb-8">Welcome</h2>

    <!-- Login Form -->
    <div class="w-full max-w-md">
      <!-- Username/Email Field -->
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-medium mb-2">Username or Email</label>
        <input
          v-model="username"
          type="text"
          placeholder="e.g. Mustafa"
          :class="['w-full px-4 py-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors', usernameFocused ? 'border-b' : 'border-b-3']"
          style="border-bottom-color: #009AFF;"
          @focus="usernameFocused = true"
          @blur="usernameFocused = false"
        />
      </div>

      <!-- Password Field -->
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-medium mb-2">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="e.g. Mustafa"
          :class="['w-full px-4 py-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors', passwordFocused ? 'border-b' : 'border-b-3']"
          style="border-bottom-color: #009AFF;"
          @focus="passwordFocused = true"
          @blur="passwordFocused = false"
        />
      </div>

      <!-- Login Button -->
      <button
        @click="handleLogin"
        class="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors mb-4"
      >
        Login
      </button>

      <!-- Sign Up Link -->
      <div class="text-center">
        <span class="text-gray-600 text-sm">Do not have an account? </span>
        <a @click="goToSignup" class="text-blue-600 text-sm underline hover:text-blue-800 cursor-pointer">Sign Up here</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const usernameFocused = ref(false)
const passwordFocused = ref(false)

const router = useRouter()

const goToSignup = () => {
  router.push({ name: 'signup' })
}

const handleLogin = () => {
  console.log('Login clicked')
}

</script>