<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" @click.self="close">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div class="flex items-center justify-between">
            <h3 class="text-2xl font-bold">{{ t('payment.scanQRCode') }}</h3>
            <button @click="close" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="text-white/90 mt-2 text-sm">{{ t('payment.scanQRDescription') }}</p>
        </div>

        <!-- Content -->
        <div class="p-8">
          <!-- QR Code -->
          <div class="flex justify-center mb-6">
            <div class="bg-white p-4 rounded-xl shadow-lg border-2 border-gray-200">
              <img :src="qrCode" alt="QR Code" class="w-64 h-64" />
            </div>
          </div>

          <!-- Payment Info -->
          <div class="space-y-4 mb-6">
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span class="text-gray-600 font-medium">{{ t('payment.amount') }}</span>
              <span class="text-2xl font-bold text-gray-900">{{ amount }} {{ currency }}</span>
            </div>
            <div v-if="readableCode" class="flex flex-col gap-2 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <span class="text-gray-600 font-medium text-sm">{{ t('payment.readableCode') }}</span>
              <span class="text-xl font-bold text-blue-700 font-mono tracking-wider">{{ readableCode }}</span>
              <p class="text-xs text-gray-500 mt-1">{{ t('payment.readableCodeDescription') }}</p>
            </div>
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span class="text-gray-600 font-medium">{{ t('payment.paymentId') }}</span>
              <span class="text-sm font-mono text-gray-700 break-all">{{ paymentId }}</span>
            </div>
          </div>

          <!-- Status -->
          <div v-if="isPolling" class="text-center mb-4">
            <div class="inline-flex items-center gap-2 text-blue-600">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="font-medium">{{ t('payment.waitingForPayment') }}</span>
            </div>
          </div>

          <!-- Alternative Links -->
          <div class="space-y-3">
            <p class="text-sm text-gray-600 text-center mb-3">{{ t('payment.orUseLinks') }}</p>
            <button
              v-if="personalAppLink"
              @click="openPersonalApp"
              class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <img src="../../assets/icons/fib.svg" alt="FIB" class="w-6 h-4 object-contain" />
              {{ t('payment.openPersonalApp') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  show: boolean
  qrCode: string
  paymentId: string
  readableCode?: string
  amount: string
  currency: string
  isPolling?: boolean
  personalAppLink?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const close = () => {
  emit('close')
}

const openPersonalApp = () => {
  if (props.personalAppLink) {
    window.open(props.personalAppLink, '_blank')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>

