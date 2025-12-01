<template>
  <div class="w-full min-h-full pb-10 px-4 md:px-12 md:pt-10 pt-5 flex flex-col gap-y-8">
    <!-- Header Section -->
    <div class="flex flex-col gap-y-2">
      <TextHeading>{{ t('subscription.title') }}</TextHeading>
      <p class="text-gray-600 text-sm md:text-base">
        {{ t('subscription.description') }}
      </p>
    </div>

    <!-- Current Plan Section -->
    <div class="flex flex-col gap-y-4">
      <h2 class="text-lg font-bold text-gray-800">{{ t('subscription.currentPlan') }}</h2>
      <div class="border-2 border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ currentPlan }}</h3>
            <p class="text-gray-600 mt-1">{{ t('subscription.freePlanDescription') }}</p>
          </div>
          <div class="px-4 py-2 bg-gray-100 rounded-lg">
            <span class="text-gray-700 font-semibold">{{ t('subscription.free') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Premium Features Section -->
    <div class="flex flex-col gap-y-6">
      <h2 class="text-lg font-bold text-gray-800">{{ t('subscription.unlockPremium') }}</h2>
      
      <!-- Premium Card - Modern Gradient Design -->
      <div class="relative overflow-hidden rounded-2xl shadow-2xl">
        <!-- Animated Background Gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-90"></div>
        <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse-slow"></div>
        
        <!-- Premium Badge -->
        <div class="absolute top-6 right-6 z-10">
          <div class="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
            <span class="text-white font-bold text-sm uppercase tracking-wider">✨ {{ t('subscription.premium') }}</span>
          </div>
        </div>

        <!-- Content -->
        <div class="relative z-10 p-8 md:p-12 text-white">
          <!-- Header -->
          <div class="mb-8">
            <h3 class="text-3xl md:text-4xl font-black mb-3">{{ t('subscription.premiumTitle') }}</h3>
            <p class="text-white/90 text-lg">{{ t('subscription.premiumSubtitle') }}</p>
          </div>

          <!-- Main Feature - Theme Customization -->
          <div class="flex items-start gap-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20 mb-8">
            <div class="flex-shrink-0 w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-2xl mb-3">{{ t('subscription.featureThemeTitle') }}</h4>
              <p class="text-white/90 text-base leading-relaxed mb-4">{{ t('subscription.featureThemeDescription') }}</p>
              <div class="flex flex-wrap gap-3">
                <div class="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-sm">{{ t('subscription.themeBenefit1') }}</span>
                </div>
                <div class="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-sm">{{ t('subscription.themeBenefit2') }}</span>
                </div>
                <div class="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-sm">{{ t('subscription.themeBenefit3') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pricing & CTA -->
          <div class="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/20">
            <div>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl md:text-5xl font-black">100 IQD</span>
                <span class="text-white/70">/{{ t('subscription.month') }}</span>
              </div>
              <p class="text-white/80 text-sm mt-2">{{ t('subscription.billedMonthly') }}</p>
            </div>
            <button
              @click="handleUpgrade"
              :disabled="isProcessing"
              class="group relative px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span class="relative z-10 flex items-center gap-2">
                <img v-if="!isProcessing" src="../../assets/icons/fib.svg" alt="FIB" class="w-8 h-5 object-contain" />
                <span v-if="isProcessing">{{ t('subscription.processing') }}</span>
                <span v-else>{{ t('subscription.payWithFIB') }}</span>
                <svg v-if="!isProcessing" class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
        <p class="text-green-800 font-semibold">{{ successMessage }}</p>
      </div>

      <!-- Development Test Button (Remove in production) -->
      <div v-if="showQRModal" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p class="text-yellow-800 text-sm mb-2 font-semibold">🧪 Test Payment Status</p>
        <div class="flex gap-2 flex-wrap">
          <button
            @click="testPaymentStatus('PAID')"
            class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Simulate PAID
          </button>
          <button
            @click="testPaymentStatus('PENDING')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Simulate PENDING
          </button>
          <button
            @click="testPaymentStatus('DECLINED')"
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Simulate DECLINED
          </button>
        </div>
        <p class="text-yellow-700 text-xs mt-2">This is for testing only. Check browser console for status logs.</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
        <p class="text-red-800 font-semibold">{{ errorMessage }}</p>
      </div>

      <!-- QR Code Modal -->
      <QRCodeModal
        :show="showQRModal"
        :qr-code="qrCode"
        :payment-id="currentPaymentId"
        :readable-code="readableCode"
        :amount="PREMIUM_PRICE.toString()"
        :currency="CURRENCY"
        :is-polling="isPolling"
        :personal-app-link="personalAppLink"
        @close="closeQRModal"
      />

      <!-- Additional Benefits -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div class="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 class="font-bold text-gray-900 mb-2">{{ t('subscription.benefit1Title') }}</h4>
          <p class="text-gray-600 text-sm">{{ t('subscription.benefit1Description') }}</p>
        </div>

        <div class="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 class="font-bold text-gray-900 mb-2">{{ t('subscription.benefit2Title') }}</h4>
          <p class="text-gray-600 text-sm">{{ t('subscription.benefit2Description') }}</p>
        </div>

        <div class="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200">
          <div class="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h4 class="font-bold text-gray-900 mb-2">{{ t('subscription.benefit3Title') }}</h4>
          <p class="text-gray-600 text-sm">{{ t('subscription.benefit3Description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import TextHeading from '../../components/textHeading.vue'
import QRCodeModal from '../../components/payment/QRCodeModal.vue'
import api from '../../services/api'

const { t } = useI18n()
const router = useRouter()

const currentPlan = ref(t('subscription.freePlan'))
const isProcessing = ref(false)
const errorMessage = ref<string>('')
const successMessage = ref<string>('')
const showQRModal = ref(false)
const qrCode = ref('')
const currentPaymentId = ref('')
const readableCode = ref('')
const personalAppLink = ref('')
const isPolling = ref(false)
let pollingInterval: ReturnType<typeof setInterval> | null = null

// Premium subscription price in IQD (Iraqi Dinar)
const PREMIUM_PRICE = 100
const CURRENCY = 'IQD'

const handleUpgrade = async () => {
  try {
    isProcessing.value = true
    errorMessage.value = ''
    successMessage.value = ''

    console.log('Creating payment via backend API...')

    // Create payment via backend API
    // Backend will handle FIB integration and return QR code
    const paymentData = {
      amount: "100", // Amount field (some backends require this at root level)
      monetaryValue: {
        amount: "100", // Amount in IQD for FIB
        currency: CURRENCY
      },
      statusCallbackUrl: "http://127.0.0.1:8000/api/payments/callback",
      description: "Premium Subscription - Theme Customization",
      redirectUri: `${window.location.origin}/admin/subscription?status=success`,
      expiresIn: "PT1H", // 1 hour in ISO 8601 duration format
      category: "ECOMMERCE",
      refundableFor: "PT48H" // 48 hours
    }

    console.log('Sending payment request to backend...', paymentData)
    console.log('Payment data JSON:', JSON.stringify(paymentData, null, 2))
    const response = await api.post('/user/payments', paymentData)
    const paymentResponse = response.data?.data || response.data
    
    console.log('Payment created:', paymentResponse)

    // Backend returns payment with QR code
    if (!paymentResponse) {
      errorMessage.value = t('subscription.paymentLinkError')
      isProcessing.value = false
      return
    }

    // Store payment ID and readable code for verification
    const paymentId = paymentResponse.paymentId || paymentResponse.payment_id || paymentResponse.id
    const readable = paymentResponse.readableCode || paymentResponse.readable_code || ''
    
    if (paymentId) {
      localStorage.setItem('pendingPaymentId', paymentId)
      currentPaymentId.value = paymentId
    }
    
    if (readable) {
      readableCode.value = readable
    }

    // Show QR code modal
    if (paymentResponse.qrCode || paymentResponse.qr_code) {
      qrCode.value = paymentResponse.qrCode || paymentResponse.qr_code
      personalAppLink.value = paymentResponse.personalAppLink || paymentResponse.personal_app_link || ''
      showQRModal.value = true
      isProcessing.value = false
      
      // Start polling for payment status
      if (paymentId) {
        pollPaymentStatus(paymentId)
      }
    } else if (paymentResponse.personalAppLink || paymentResponse.personal_app_link) {
      // Show QR modal with link option
      qrCode.value = '' // No QR code available
      personalAppLink.value = paymentResponse.personalAppLink || paymentResponse.personal_app_link
      showQRModal.value = true
      isProcessing.value = false
      
      // Start polling for payment status
      if (paymentId) {
        pollPaymentStatus(paymentId)
      }
    } else {
      errorMessage.value = t('subscription.paymentLinkError')
      isProcessing.value = false
    }
  } catch (error: any) {
    console.error('Payment error:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    
    let errorMsg = t('subscription.paymentError')
    
    if (error.response?.data) {
      // Check for validation errors
      if (error.response.data.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(', ') : messages
            return `${field}: ${msg}`
          })
          .join('\n')
        errorMsg = `Validation errors:\n${errorMessages}`
      } else if (error.response.data.message) {
        errorMsg = error.response.data.message
      } else if (error.response.data.error) {
        errorMsg = error.response.data.error
      }
    } else if (error.message) {
      // Check for specific error messages
      if (error.message.includes('Client ID and Client Secret')) {
        errorMsg = error.message
      } else if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        errorMsg = 'Network error: Unable to connect to payment service. Please check your internet connection and try again.'
      } else {
        errorMsg = error.message
      }
    }
    
    errorMessage.value = errorMsg
    isProcessing.value = false
  }
}

const pollPaymentStatus = async (paymentId: string) => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }

  isPolling.value = true
  const maxAttempts = 120 // Poll for 10 minutes (120 * 5 seconds)
  let attempts = 0

  console.log(`Starting payment status polling for payment ID: ${paymentId}`)

  pollingInterval = setInterval(async () => {
    try {
      attempts++
      console.log(`Checking payment status (attempt ${attempts}/${maxAttempts})...`)
      
      // Check payment status via backend API
      const response = await api.get(`/user/payments/${paymentId}/status`)
      const statusResponse = response.data?.data || response.data

      console.log('Payment status response:', statusResponse)
      console.log('Current status:', statusResponse.status)

      if (statusResponse.status === 'PAID' || statusResponse.status === 'paid') {
        console.log('Payment confirmed as PAID!')
        clearInterval(pollingInterval!)
        isPolling.value = false
        await handlePaymentSuccess(paymentId)
      } else if (statusResponse.status === 'DECLINED' || statusResponse.status === 'declined' || 
                 statusResponse.status === 'CANCELLED' || statusResponse.status === 'cancelled') {
        console.log('Payment was declined or cancelled')
        clearInterval(pollingInterval!)
        isPolling.value = false
        errorMessage.value = t('subscription.paymentFailed')
        showQRModal.value = false
      } else if (attempts >= maxAttempts) {
        console.log('Payment status check timed out')
        clearInterval(pollingInterval!)
        isPolling.value = false
        errorMessage.value = t('subscription.paymentTimeout')
        showQRModal.value = false
      }
    } catch (error: any) {
      console.error('Error checking payment status:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      // Continue polling even if there's an error (network issues, etc.)
    }
  }, 5000) // Check every 5 seconds
}

const handlePaymentSuccess = async (paymentId: string) => {
  try {
    // Close QR modal
    showQRModal.value = false

    // Clear polling
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
    isPolling.value = false

    // Update user subscription status
    localStorage.removeItem('pendingPaymentId')
    
    // Show success message
    successMessage.value = t('subscription.paymentSuccess')
    errorMessage.value = ''
    
    // TODO: Later when DB column is added, uncomment this:
    // await api.post('/user/subscription/activate', {
    //   payment_id: paymentId,
    //   payment_provider: 'FIB'
    // })
    
    // Update current plan display
    currentPlan.value = t('subscription.premiumPlan')
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error: any) {
    console.error('Error activating subscription:', error)
    errorMessage.value = error.response?.data?.message || t('subscription.activationError')
  }
}

const closeQRModal = () => {
  showQRModal.value = false
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
  isPolling.value = false
}

// Test function to simulate payment status (for development/testing)
const testPaymentStatus = async (status: 'PAID' | 'PENDING' | 'DECLINED') => {
  const paymentId = currentPaymentId.value
  if (!paymentId) {
    console.error('No payment ID available for testing')
    return
  }

  console.log(`🧪 TEST: Simulating payment status: ${status}`)
  console.log(`🧪 TEST: Payment ID: ${paymentId}`)

  // Stop current polling
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }

  // Handle based on status
  if (status === 'PAID') {
    isPolling.value = false
    await handlePaymentSuccess(paymentId)
  } else if (status === 'DECLINED') {
    isPolling.value = false
    errorMessage.value = t('subscription.paymentFailed')
    showQRModal.value = false
  } else {
    // PENDING - restart polling
    pollPaymentStatus(paymentId)
  }
}

// Check if returning from payment
const checkPaymentStatus = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const status = urlParams.get('status')
  const paymentId = localStorage.getItem('pendingPaymentId')

  if (status === 'success' && paymentId) {
    await handlePaymentSuccess(paymentId)
  }
}

// Check payment status on component mount
onMounted(() => {
  checkPaymentStatus()
})

// Cleanup polling on unmount
onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
})

</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}
</style>

