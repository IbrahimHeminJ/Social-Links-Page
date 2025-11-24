<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4 md:p-6" :class="themeClasses">
    <div class="w-full max-w-md relative">
      <!-- Language Switcher - Top Right -->
      <div class="absolute top-0 right-0 z-10">
        <LanguageSwitcher />
      </div>

      <!-- Header -->
      <div class="px-4 md:px-6 pt-2 md:pt-3 flex items-center justify-between mb-4">

        <button @click="goToHome" class="text-white hover:opacity-80 transition-opacity" aria-label="Go to home">
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </button>
      </div>

      <!-- Profile Section -->
      <div class="px-4 md:px-6 pb-4 flex flex-col items-center">
        <img :src="userProfileImage || '/src/assets/images/man.png'" alt="Profile"
          class="w-20 h-20 md:w-24 md:h-24 rounded-full mb-4 border-2 object-cover" :class="profileBorderClass">
        <h2 class="text-xl md:text-2xl font-bold mb-2" :class="textColorClass">{{ userName || `User ID: ${userId}` }}
        </h2>
        <p class="text-sm md:text-base text-center" :class="subtitleColorClass">
          {{ userDescription || 'No description available' }}
        </p>
      </div>

      <!-- Social Links Section -->
      <div class="px-4 md:px-6 pb-6 space-y-3">
        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-8">
          <p :class="textColorClass">{{ t('socialLinks.loadingLinks') }}</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-500">{{ error }}</p>
        </div>

        <!-- No links -->
        <div v-else-if="socialLinks.length === 0" class="text-center py-8">
          <p :class="textColorClass">{{ t('socialLinks.noLinksAvailable') }}</p>
        </div>

        <!-- Links -->
        <button v-else v-for="(link, index) in socialLinks" :key="index" type="button" @click="openLink(link.link)"
          class="w-full p-3 md:p-4 shadow-lg transition-all duration-200 hover:scale-105 border-2 block cursor-pointer text-left"
          style="border-radius: 15px; text-decoration: none;" :class="[getButtonClasses(), getButtonBorderClass()]">
          <!-- First Row: Icon and Title -->
          <div class="flex items-center gap-x-3 mb-1">
            <img :src="getIconPath(link.icon)" :alt="link.platform" class="w-6 h-6 md:w-8 md:h-8">
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

      <ReportWindow :show="showReport" @close="showReport = false" @submit="handleSubmitReport" />
      <!-- Footer -->
      <div class="px-4 md:px-6 pb-4 md:pb-6 flex items-center justify-between">
        <!-- Report User -->
        <div @click="handleReportClick" class="flex items-center gap-x-2 cursor-pointer">
          <svg class="w-5 h-5 md:w-6 md:h-6" :class="textColorClass" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd" />
          </svg>
          <p class="text-xs md:text-sm" :class="textColorClass">{{ t('socialLinks.reportUser') }}</p>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/auth'
import ReportWindow from '../components/reports/reportWindow.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const { t } = useI18n()

// Import all available icons statically for Vite
import facebookIcon from '../assets/icons/facebook.svg'
import linkedinIcon from '../assets/icons/linkedin.svg'
import youtubeIcon from '../assets/icons/youtube.svg'
import twitterIcon from '../assets/icons/twitter.svg'
import instagramIcon from '../assets/icons/instagram.svg'
import githubIcon from '../assets/icons/github.svg'
import discordIcon from '../assets/icons/discord.svg'
import api from '../services/api'

const openLink = (rawUrl: string) => {
  if (!rawUrl) return

  // ensure it has protocol
  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`

  window.open(url, '_blank', 'noopener,noreferrer')
}

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const showReport = ref(false);
const isSubmittingReport = ref(false);

// Get user ID from route params
const userId = computed(() => route.params.id as string || '')

// Loading and error states
const isLoading = ref(false)
const error = ref<string | null>(null)

// User profile data
const userName = ref<string>('')
const userDescription = ref<string>('')
const userProfileImage = ref<string>('')

const handleReportClick = () => {
  // Check if user is authenticated
  authStore.syncAuthState()
  if (!authStore.isAuthenticated) {
    // Redirect to login with return URL
    router.push({
      name: 'login',
      query: { redirect: route.fullPath }
    })
    return
  }
  // User is authenticated, show report window
  showReport.value = true
}

const handleSubmitReport = async (payload: {
  title: string;
  description: string;
  type: string;
}) => {
  // Double check authentication before submitting
  authStore.syncAuthState()
  if (!authStore.isAuthenticated) {
    alert(t('socialLinks.pleaseLoginToReport'))
    router.push({
      name: 'login',
      query: { redirect: route.fullPath }
    })
    return
  }

  if (!userId.value) {
    alert(t('socialLinks.userIdRequired'))
    return
  }

  // Validate required fields
  if (!payload.title.trim() || !payload.description.trim()) {
    alert('Please fill in both title and description')
    return
  }

  if (isSubmittingReport.value) {
    return // Prevent multiple submissions
  }

  isSubmittingReport.value = true

  try {
    console.log("Submitting report:", payload);
    console.log("Reporting user ID:", userId.value);

    // Call the API to submit the report
    const response = await api.post('/user/report', {
      user_id: userId.value, // The user being reported
      title: payload.title,
      description: payload.description,
      report_type: payload.type
    });

    console.log("Report submitted successfully:", response.data);

    // Show success message
    alert('Report submitted successfully. Thank you for your feedback.');

    // Close the report window
    showReport.value = false;
  } catch (err: any) {
    console.error("Error submitting report:", err);
    const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to submit report. Please try again.';
    alert(errorMessage);
  } finally {
    isSubmittingReport.value = false
  }
};

interface SocialLink {
  title: string
  description: string
  link: string
  platform: string
  icon: string
}

// Theme variable: 1 = Facebook, 2 = LinkedIn, 3 = YouTube, 4 = Graphic Designer
// This comes from the API
const themeNumber = ref(1) // Will be replaced with theme ID from API

const socialLinks = ref<SocialLink[]>([])

// Fetch user info to get theme ID and profile image
const fetchUserInfo = async () => {
  if (!userId.value) {
    console.log('No user ID provided')
    return
  }

  try {
    // Fetch user by ID directly
    console.log('Fetching user info for ID:', userId.value)
    const userResponse = await api.get(`/users/${userId.value}`)

    console.log('========== USER API RESPONSE ==========')
    console.log('Full response:', userResponse)
    console.log('Response data:', userResponse.data)
    console.log('========================================')

    // Parse response structure: { message, data: { id, name, ..., profile_image, theme: { id, theme_id, theme_type } } }
    const userData = userResponse.data?.data || {}

    console.log('========== USER DATA ==========')
    console.log('User data object:', userData)
    console.log('Profile image:', userData.profile_image)
    console.log('Theme object:', userData.theme)
    if (userData.theme) {
      console.log('Theme.theme_id:', userData.theme.theme_id)
    }
    console.log('===============================')

    // Get user info from /users/{id} endpoint (independent of button links)
    // Set profile_image, name, and description from user data
    if (userData.profile_image) {
      userProfileImage.value = userData.profile_image
      console.log('✅ Profile image set to:', userProfileImage.value)
    }

    // Set name and description if available (so they work even without button links)
    if (userData.name) {
      userName.value = userData.name
    }
    if (userData.description || userData.subtitle) {
      userDescription.value = userData.description || userData.subtitle || ''
    }

    // Get theme_id from theme object
    const themeId = userData.theme?.theme_id
    console.log('Extracted Theme ID (theme_id):', themeId)

    if (themeId !== undefined && themeId !== null) {
      themeNumber.value = parseInt(themeId)
      console.log('✅ Theme number set to:', themeNumber.value)
    } else {
      console.log('❌ No theme_id found in API response')
      themeNumber.value = 1 // Default to theme 1
    }
  } catch (err: any) {
    console.error('❌ Error fetching user info for theme:', err)
    console.error('Error response:', err.response)
    console.error('Error data:', err.response?.data)
    themeNumber.value = 1 // Default to theme 1 on error
  }
}

// Fetch user's button links from API (includes user info in response)
const fetchUserLinks = async () => {
  if (!userId.value) {
    error.value = 'User ID is required'
    return
  }

  try {
    isLoading.value = true
    error.value = null

    const response = await api.get(`/user/${userId.value}/button-links`)

    console.log('Button Links API Response:', response.data)

    // Parse API response structure
    const linksData = response.data.data || []

    if (linksData.length > 0) {
      // Extract user info from first item (all items have same user)
      const firstItem = linksData[0]
      const userData = firstItem.relationship?.user?.data || {}

      userName.value = userData.name || ''
      userDescription.value = userData.description || userData.subtitle || ''

      // Note: profile_image is now fetched from /users/{id} endpoint in fetchUserInfo()
      // So we don't need to set it here from button-links endpoint

      console.log('User info:', {
        userName: userName.value,
        userDescription: userDescription.value,
        userProfileImage: userProfileImage.value,
        themeNumber: themeNumber.value
      })

      // Map buttons from relationship.button_link
      // Sort by order field
      const sortedLinks = [...linksData].sort((a, b) => (a.order || 0) - (b.order || 0))

      socialLinks.value = sortedLinks
        .filter((item: any) => item.relationship?.button_link?.is_visible === 1) // Only show visible buttons
        .map((item: any) => {
          const buttonLink = item.relationship.button_link || {}
          return {
            title: buttonLink.title || '',
            description: buttonLink.description || '',
            link: buttonLink.link || '#',
            platform: buttonLink.icon || 'default',
            icon: buttonLink.icon || 'default'
          }
        })

      console.log('Mapped social links:', socialLinks.value)
    } else {
      // No links found, but user info (name, description, profile_image) 
      // should already be set from fetchUserInfo() which is called first
      // So we don't clear them - they are independent of button links
      socialLinks.value = []
    }
  } catch (err: any) {
    console.error('Error fetching user links:', err)
    error.value = err.response?.data?.message || 'Failed to fetch user links'
    socialLinks.value = []
    // Don't clear user info (name, description, profile_image) on error
    // They are set from fetchUserInfo() and should remain even if button links fail
  } finally {
    isLoading.value = false
  }
}

// Fetch user data - fetch user info first to get theme, then fetch button links
const fetchUserData = async () => {
  // Fetch user info first to get theme
  await fetchUserInfo()
  // Then fetch button links
  await fetchUserLinks()
}

// Fetch user data when component mounts or route changes
onMounted(() => {
  if (userId.value) {
    fetchUserData()
  }
})

// Watch for route changes (user ID changes)
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchUserData()
  }
})

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

// Icon map for static imports (Vite requires static imports)
const iconMap: Record<string, string> = {
  facebook: facebookIcon,
  linkedin: linkedinIcon,
  youtube: youtubeIcon,
  twitter: twitterIcon,
  instagram: instagramIcon,
  github: githubIcon,
  discord: discordIcon,
  // Add more icons here as they become available
  // soundcloud: soundcloudIcon,
  // snapchat: snapchatIcon,
}

const getIconPath = (iconName?: string) => {
  if (!iconName) {
    return facebookIcon // Default icon
  }

  // Convert icon name to lowercase and trim whitespace
  let normalizedIcon = iconName.toLowerCase().trim()

  // Remove .svg extension if already present
  if (normalizedIcon.endsWith('.svg')) {
    normalizedIcon = normalizedIcon.replace(/\.svg$/, '')
  }

  // Return icon from map or default to facebook
  return iconMap[normalizedIcon] || facebookIcon
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
