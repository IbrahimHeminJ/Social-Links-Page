<template>
  <div class="w-full h-auto pb-10 px-4 md:px-12 md:pt-10 pt-5 flex flex-col gap-y-6">
    <!-- Header Section -->
    <div class="flex flex-col gap-y-2">
      <TextHeading>Themes</TextHeading>
      <p class="text-gray-600 text-sm md:text-base">
        Themes will be applied to the links page
      </p>
    </div>

    <!-- Current Theme Section -->
    <div class="flex flex-col gap-y-4">
      <h2 class="text-lg font-bold">Current</h2>
      <div class="border-2 border-[#009AFF] rounded-lg p-4 md:p-6 bg-white">
        <p class="text-center text-gray-700">{{ currentTheme }}</p>
      </div>
    </div>

    <!-- Choose Theme Section -->
    <div class="flex flex-col gap-y-4">
      <h2 class="text-lg font-bold">Choose a theme you like</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <!-- Facebook Theme -->
        <button
          @click="selectTheme('Facebook')"
          :class="[
            'relative rounded-lg p-4 md:p-6 text-left text-white transition-all duration-200 hover:scale-105 hover:shadow-lg',
            selectedTheme === 'Facebook' ? 'ring-4 ring-[#009AFF] ring-offset-2' : ''
          ]"
          style="background: linear-gradient(to right, #1877F2, #42A5F5);"
        >
          <div class="flex items-center gap-x-3 md:gap-x-4 mb-2">
            <img src="../../assets/icons/facebook.svg" alt="Facebook" class="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full p-1.5">
            <h3 class="text-lg md:text-xl font-bold">Facebook</h3>
          </div>
          <p class="text-sm md:text-base text-white/90">
            This is a preset theme for Facebook lovers
          </p>
        </button>

        <!-- LinkedIn Theme -->
        <button
          @click="selectTheme('Linkedin')"
          :class="[
            'relative rounded-lg p-4 md:p-6 text-left text-white transition-all duration-200 hover:scale-105 hover:shadow-lg',
            selectedTheme === 'Linkedin' ? 'ring-4 ring-[#009AFF] ring-offset-2' : ''
          ]"
          style="background-color: #0A66C2;"
        >
          <div class="flex items-center gap-x-3 md:gap-x-4 mb-2">
            <img src="../../assets/icons/linkedin.svg" alt="LinkedIn" class="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full p-1.5">
            <h3 class="text-lg md:text-xl font-bold">Linkedin</h3>
          </div>
          <p class="text-sm md:text-base text-white/90">
            This is a preset theme for professional Linkedin users
          </p>
        </button>

        <!-- Graphic Designer Theme -->
        <button
          @click="selectTheme('Graphic Designer')"
          :class="[
            'relative rounded-lg p-4 md:p-6 text-left text-white transition-all duration-200 hover:scale-105 hover:shadow-lg',
            selectedTheme === 'Graphic Designer' ? 'ring-4 ring-[#009AFF] ring-offset-2' : ''
          ]"
          style="background: linear-gradient(to right, #FF6B35, #F7931E, #FFD23F, #06FFA5, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD, #98D8C8);"
        >
          <div class="flex items-center gap-x-3 md:gap-x-4 mb-2">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold">Graphic Designer</h3>
          </div>
          <p class="text-sm md:text-base text-white/90">
            This is a preset theme for graphic designers
          </p>
        </button>

        <!-- YouTube Theme -->
        <button
          @click="selectTheme('You tube')"
          :class="[
            'relative rounded-lg p-4 md:p-6 text-left text-white transition-all duration-200 hover:scale-105 hover:shadow-lg',
            selectedTheme === 'You tube' ? 'ring-4 ring-[#009AFF] ring-offset-2' : ''
          ]"
          style="background-color: #FF0000;"
        >
          <div class="flex items-center gap-x-3 md:gap-x-4 mb-2">
            <img src="../../assets/icons/youtube.svg" alt="YouTube" class="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full p-1.5">
            <h3 class="text-lg md:text-xl font-bold">You tube</h3>
          </div>
          <p class="text-sm md:text-base text-white/90">
            This is a preset theme for You tubers
          </p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TextHeading from '../../components/textHeading.vue'

const currentTheme = ref('Default')
const selectedTheme = ref<string | null>(null)

const selectTheme = (themeName: string) => {
  selectedTheme.value = themeName
  currentTheme.value = themeName
  // Here you can add logic to apply the theme
  console.log('Theme selected:', themeName)
}
</script>