<template>
  <div 
    class="min-h-screen w-full flex items-center justify-center p-4 md:p-6"
    :class="themeClasses"
  >
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="px-4 md:px-6 pt-2 md:pt-3 flex items-center justify-between mb-4">
        
        <button 
          @click="goToHome"
          class="text-white hover:opacity-80 transition-opacity"
          aria-label="Go to home"
        >
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
        </button>
      </div>

      <!-- Profile Section -->
      <div class="px-4 md:px-6 pb-4 flex flex-col items-center">
        <img 
          src="../../assets/images/man.png" 
          alt="Profile" 
          class="w-20 h-20 md:w-24 md:h-24 rounded-full mb-4 border-2 object-cover"
          :class="profileBorderClass"
        >
        <h2 class="text-xl md:text-2xl font-bold mb-2" :class="textColorClass">Zheer Salam</h2>
        <p class="text-sm md:text-base text-center" :class="subtitleColorClass">
          Friend of Suhaeb Fazil and Ibrahim Hemin
        </p>
      </div>

      <!-- Social Links Section -->
      <div class="px-4 md:px-6 pb-6 space-y-3">
        <button
          v-for="(link, index) in socialLinks"
          :key="index"
          @click="handleLinkClick(link.link)"
          class="w-full p-3 md:p-4 shadow-lg transition-all duration-200 hover:scale-105 border-2"
          style="border-radius: 15px;"
          :class="[getButtonClasses(), getButtonBorderClass()]"
        >
            <!-- First Row: Icon and Title -->
            <div class="flex items-center gap-x-3 mb-1">
              <img 
                :src="getIconPath()" 
                :alt="link.platform" 
                class="w-6 h-6 md:w-8 md:h-8"
              >
              <p class="font-bold text-lg md:text-base" :class="getButtonTextClass()">
                {{ link.title }}
              </p>
            </div>
            <!-- Second Row: Description -->
            <p class="text-xs md:text-sm mt-1 flex flex-row items-start" :class="getButtonSubtextClass()">
              {{ link.description }}
            </p>
          </button>
      </div>
      
      <ReportWindow
        :show="showReport"
        @close="showReport = false"
        @submit="handleSubmitReport"
      />  
      <!-- Footer -->
      <div class="px-4 md:px-6 pb-4 md:pb-6 flex items-center justify-between">
        <!-- Report User -->
        <div @click="showReport = true" class="flex items-center gap-x-2">
          <svg class="w-5 h-5 md:w-6 md:h-6" :class="textColorClass" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <p class="text-xs md:text-sm" :class="textColorClass">Report User</p>
        </div>
        <!-- Social Links Page Generator -->
        <div class="flex items-center gap-x-2">
          <img src="../assets/icons/icon.svg" alt="SOCIAL LINKS PAGE GENERATOR Logo" class="w-16 h-16 md:w-20 md:h-20">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import facebookIcon from '../assets/icons/facebook.svg'
import ReportWindow from '../components/reports/reportWindow.vue'

const router = useRouter()
const showReport = ref(false);

const handleSubmitReport = (payload: {
  title: string;
  description: string;
  type: string;
}) => {
  console.log("Report payload:", payload);
  // call backend here
  showReport.value = false;
};

interface SocialLink {
  title: string
  description: string
  link: string
  platform: string
}

// Theme variable: 1 = Facebook, 2 = LinkedIn, 3 = YouTube, 4 = Graphic Designer
// This will come from DB in the future, for now it's manual
const themeNumber = ref(3) // Default theme (1 = Facebook)

const socialLinks = ref<SocialLink[]>([
  {
    title: 'Facebook',
    description: 'This is a preset theme for Facebook lovers',
    link: 'https://facebook.com',
    platform: 'facebook'
  },
  {
    title: 'Youtube',
    description: 'This is a preset theme for Facebook lovers',
    link: 'https://youtube.com',
    platform: 'youtube'
  },
  {
    title: 'Facebook',
    description: 'This is a preset theme for Facebook lovers',
    link: 'https://facebook.com',
    platform: 'facebook'
  },
  {
    title: 'Facebook',
    description: 'This is a preset theme for Facebook lovers',
    link: 'https://facebook.com',
    platform: 'facebook'
  }
])

const themeClasses = computed(() => {
  switch (themeNumber.value) {
    case 1: // Facebook - vertical gradient (top to bottom)
      return 'bg-gradient-to-b from-[#1877F2] to-[#42A5F5]'
    case 2: // LinkedIn
      return 'bg-white'
    case 3: // YouTube - vertical gradient (top to bottom)
      return 'bg-gradient-to-b from-red-600 to-red-800'
    case 4: // Graphic Designer - vertical gradient (top to bottom)
      return 'bg-gradient-to-b from-purple-600 via-purple-500 to-blue-600'
    default:
      return 'bg-white'
  }
})

const textColorClass = computed(() => {
  return themeNumber.value === 2 
    ? 'text-gray-900' 
    : 'text-white'
})

const subtitleColorClass = computed(() => {
  return themeNumber.value === 2 
    ? 'text-gray-600' 
    : 'text-white/90'
})


const profileBorderClass = computed(() => {
  return themeNumber.value === 2 
    ? 'border-gray-300' 
    : 'border-white/20'
})

const getButtonClasses = () => {
  if (themeNumber.value === 2) { // LinkedIn - white background
    return 'bg-white'
  }
  
  if (themeNumber.value === 3) { // YouTube - horizontal gradient buttons (right to left)
    return 'bg-gradient-to-l from-red-600 to-red-800'
  }
  
  if (themeNumber.value === 4) { // Graphic Designer - horizontal gradient buttons (right to left)
    return 'bg-gradient-to-l from-purple-600 via-blue-500 to-purple-700'
  }
  
  // Theme 1: Facebook - horizontal gradient buttons (right to left)
  return 'bg-gradient-to-l from-[#1877F2] to-[#42A5F5]'
}

const getButtonBorderClass = () => {
  if (themeNumber.value === 1) { // Facebook - blue gradient border (right to left)
    return 'border-gradient-facebook'
  }
  
  if (themeNumber.value === 2) { // LinkedIn - blue gradient border (right to left)
    return 'border-gradient-linkedin'
  }
  
  if (themeNumber.value === 3) { // YouTube - gradient border (right to left)
    return 'border-gradient-youtube'
  }
  
  if (themeNumber.value === 4) { // Graphic Designer - gradient border (opposite direction)
    return 'border-gradient-graphic'
  }
  
  return ''
}

const getButtonTextClass = () => {
  if (themeNumber.value === 2) { // LinkedIn
    return 'text-[#009AFF]'
  }
  return 'text-white'
}

const getButtonSubtextClass = () => {
  if (themeNumber.value === 2) { // LinkedIn
    return 'text-gray-600'
  }
  return 'text-white/90'
}

const getIconPath = () => {
  // For testing: use facebook.svg for all links
  return facebookIcon
}

const handleLinkClick = (url: string) => {
  window.open(url, '_blank')
}

const goToHome = () => {
  router.push({ name: 'home' })
}
</script>

<style scoped>
/* Gradient border for Facebook theme */
.border-gradient-facebook {
  position: relative;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.border-gradient-facebook::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 15px;
  padding: 2px;
  background: linear-gradient(to left, #1877F2, #42A5F5);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  z-index: -1;
}

/* Gradient border for LinkedIn theme */
.border-gradient-linkedin {
  position: relative;
  background: white;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.border-gradient-linkedin::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 15px;
  padding: 2px;
  background: linear-gradient(to left, #009AFF, #42A5F5);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  z-index: -1;
}

/* Gradient border for YouTube theme */
.border-gradient-youtube {
  position: relative;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.border-gradient-youtube::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 15px;
  padding: 2px;
  background: linear-gradient(to left, #991B1B, #DC2626);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  z-index: -1;
}

/* Gradient border for Graphic Designer theme (opposite direction) */
.border-gradient-graphic {
  position: relative;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.border-gradient-graphic::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 15px;
  padding: 2px;
  background: linear-gradient(to right, #6366F1, #A855F7, #8B5CF6);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  z-index: -1;
}
</style>

