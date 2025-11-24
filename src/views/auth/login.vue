<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useI18n } from 'vue-i18n'
import Text from '../../components/inputs/text.vue';
import Submit from '../../components/buttons/submit.vue';
import Hyperlink from '../../components/buttons/hyperlink.vue';
import LanguageSwitcher from '../../components/LanguageSwitcher.vue';

const { t } = useI18n()

const router = useRouter()
const authStore = useAuthStore()

const loginData = ref({
  username: '',
  password: ''
})

const goToSignup = () => {
  router.push({ name: 'signup' })
}

const handleLogin = async () => {
  // Clear any previous errors
  authStore.clearError()

  // Trim whitespace
  const trimmedUsername = loginData.value.username.trim()
  const trimmedPassword = loginData.value.password.trim()

  // Validate inputs
  if (!trimmedUsername || !trimmedPassword) {
    alert(t('validation.required'))
    return
  }

  // Prepare login data - backend accepts userCredential (can be email or username)
  const loginPayload = {
    userCredential: trimmedUsername,
    password: trimmedPassword
  }

  // Debug: Log what's being sent
  console.log('Login data being sent:', {
    userCredential: trimmedUsername,
    password: '***'
  })

  // Call login action
  const result = await authStore.login(loginPayload)

  if (result.success) {
    // Login successful, redirect to home
    router.push({ name: 'home' })
  } else {
    // Login failed, show error
    // Error is already stored in authStore.error
    // You can display it using an alert or toast component
    alert(result.error || 'Login failed')
  }
}

</script>
<template>
  <div class="w-full bg-white flex flex-col items-center justify-center px-4 pt-0 relative">
    <!-- Language Switcher - Top Right -->
    <div class="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>

    <!-- Logo -->
    <div class="flex flex-col items-center mb-8">
      <div class="flex items-center justify-center mb-4">
        <img src="../../assets/icons/icon.svg" alt="logo" class="w-3/4 h-32 mr-4">
      </div>
    </div>

    <h2 class="text-2xl text-gray-700 mb-8">{{ t('common.welcome') }}</h2>

    <!-- Login Form -->
    <div class="w-full max-w-md">
      <!-- Username/Email Field -->
      <Text v-model="loginData.username" :label="t('auth.usernameOrEmail')" :placeholder="t('auth.enterUsernameOrEmail')" type="text" class="mb-6" />

      <!-- Password Field -->
      <Text v-model="loginData.password" :label="t('auth.password')" :placeholder="t('auth.enterPassword')" type="password" class="mb-6" />
  
      <!-- Login Button -->
      <Submit :text="t('auth.loginButton')" @click="handleLogin" class="h-[50px] mb-6" />

      <!-- Sign Up Link -->
      <div class="text-center">
        <span class="text-gray-600 text-sm">{{ t('auth.noAccount') }} </span>
        <Hyperlink :text="t('auth.signUpHere')" @click="goToSignup" />
      </div>
    </div>
  </div>
</template>
