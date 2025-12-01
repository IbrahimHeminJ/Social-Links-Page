<template>
  <div :class="`min-h-screen w-full bg-gradient-to-br ${themeBgClass} text-white relative overflow-hidden`">
    <!-- Creative Animated Background - Theme Based -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div :class="`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${themeBgOverlayClass}`"></div>
      <div
        :class="`absolute top-1/4 -left-20 w-96 h-96 ${themeOrb1Class} rounded-full blur-3xl opacity-30 animate-float`">
      </div>
      <div
        :class="`absolute bottom-1/4 -right-20 w-96 h-96 ${themeOrb2Class} rounded-full blur-3xl opacity-25 animate-float-delay`">
      </div>
      <div
        :class="`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${themeOrb3Class} rounded-full blur-3xl opacity-20 animate-pulse-slow`">
      </div>
      <div
        :class="`absolute top-3/4 left-1/4 w-72 h-72 ${themeOrb4Class} rounded-full blur-3xl opacity-15 animate-float`">
      </div>
    </div>

    <!-- Main Container -->
    <div class="relative z-10 min-h-screen flex flex-col">
      <!-- Top Bar -->
      <div class="flex justify-between items-center p-6">
        <button @click="goToHome"
          :class="`group relative px-4 py-2 overflow-hidden rounded-full border-2 border-white/20 ${themeHoverBorderClass} transition-all`">
          <span :class="`relative z-10 flex items-center gap-2 text-white ${themeTextHoverClass}`">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="font-bold">BACK</span>
          </span>
          <div :class="`absolute inset-0 bg-gradient-to-r ${themeBackButtonGradientClass} transition-all`"></div>
        </button>
        <LanguageSwitcher />
      </div>

      <!-- Hero Profile Section - Creative Layout -->
      <div class="flex-1 flex items-center justify-center px-6 py-12">
        <div class="w-full max-w-4xl">
          <!-- Asymmetric Profile Layout -->
          <div class="relative mb-16">
            <!-- Large Profile Image with Creative Effects -->
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
              <div class="relative group">
                <!-- Glowing Rings - Theme Based -->
                <div
                  :class="`absolute -inset-4 bg-gradient-to-r ${themeGradientRingsClass} rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity animate-spin-slow`">
                </div>
                <div
                  :class="`absolute -inset-2 bg-gradient-to-r ${themeGradientClass} rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity animate-spin-reverse`">
                </div>
                <div
                  :class="`absolute -inset-6 bg-gradient-to-r ${themeGradientRingsClass} rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse-slow`">
                </div>

                <!-- Profile Image -->
                <div class="relative">
                  <img :src="userProfileImage || '/src/assets/images/man.png'" alt="Profile"
                    :class="`relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 ${themeProfileBorderClass} shadow-2xl ${themeProfileShadowClass} transform group-hover:scale-105 transition-transform`">
                  <!-- Floating Badge - Theme Based -->
                  <div v-if="userTag"
                    :class="`absolute -bottom-4 -right-4 px-4 py-2 bg-gradient-to-r ${themeGradientClass} rounded-full shadow-xl ${themeBadgeShadowClass} transform rotate-12 hover:rotate-0 transition-transform border-2 ${themeBadgeBorderClass}`">
                    <span class="text-white text-xs font-black uppercase tracking-wider">{{ formatTagName(userTag)
                      }}</span>
                  </div>
                </div>
              </div>

              <!-- Name with Creative Typography - Theme Based -->
              <div class="flex-1 text-center md:text-left">
                <h1 class="text-6xl md:text-8xl font-black mb-4 leading-none">
                  <span
                    :class="`block bg-gradient-to-r ${themeGradientClass} bg-clip-text text-transparent animate-gradient`">
                    {{ userName || `User ID: ${userId}` }}
                  </span>
                </h1>
                <div
                  :class="`h-1 w-32 bg-gradient-to-r ${themeGradientRingsClass} mx-auto md:mx-0 mb-6 shadow-lg ${themeUnderlineShadowClass}`">
                </div>
                <p class="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                  {{ userDescription || 'No description available' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Creative Links Section -->
          <div class="space-y-6">
            <!-- Loading state - Theme Based -->
            <div v-if="isLoading" class="text-center py-20">
              <div class="inline-block relative">
                <div
                  :class="`w-16 h-16 border-4 ${themeLoadingBorder1Class} border-t-transparent rounded-full animate-spin`">
                </div>
                <div
                  :class="`absolute inset-0 w-16 h-16 border-4 ${themeLoadingBorder2Class} border-b-transparent rounded-full animate-spin-reverse`">
                </div>
                <div
                  :class="`absolute inset-2 w-12 h-12 border-4 ${themeLoadingBorder3Class} border-l-transparent rounded-full animate-spin`">
                </div>
              </div>
              <p class="mt-6 text-gray-300 text-lg">{{ t('socialLinks.loadingLinks') }}</p>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="text-center py-20">
              <p class="text-red-400 text-xl">{{ error }}</p>
            </div>

            <!-- No links -->
            <div v-else-if="socialLinks.length === 0" class="text-center py-20">
              <p class="text-gray-400 text-xl">{{ t('socialLinks.noLinksAvailable') }}</p>
            </div>

            <!-- Creative Link Cards -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a v-for="(link, index) in socialLinks" :key="index" @click="openLink(link.link)"
                :style="{ animationDelay: `${index * 100}ms` }"
                :class="`group relative block overflow-hidden rounded-3xl border-2 border-white/10 ${themeLinkHoverBorderClass} transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${themeLinkShadowClass} creative-link`"
                style="text-decoration: none;">

                <!-- Animated Background Gradient - Theme Based -->
                <div
                  :class="`absolute inset-0 bg-gradient-to-br ${themeLinkGradientHoverClass} transition-all duration-500`">
                </div>

                <!-- Content -->
                <div class="relative p-8 bg-black/50 backdrop-blur-sm">
                  <div class="flex items-start gap-6">
                    <!-- Icon with Creative Design - Theme Based -->
                    <div class="relative flex-shrink-0">
                      <div
                        :class="`absolute inset-0 bg-gradient-to-br ${themeGradientRingsClass} rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition-opacity`">
                      </div>
                      <div
                        :class="`absolute -inset-1 bg-gradient-to-br ${themeGradientClass} rounded-2xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity`">
                      </div>
                      <div
                        :class="`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${themeGradientClass} border-2 ${themeBorderClass}/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg ${themeIconShadowClass}`">
                        <img :src="getIconPath(link.icon)" :alt="link.platform"
                          class="w-10 h-10 object-contain filter brightness-0 invert">
                      </div>
                    </div>

                    <!-- Text Content -->
                    <div class="flex-1 min-w-0">
                      <h3
                        :class="`text-2xl font-black mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r ${themeGradientClass} group-hover:bg-clip-text transition-all`">
                        {{ link.title }}
                      </h3>
                      <p class="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4">
                        {{ link.description }}
                      </p>

                      <!-- Creative Arrow - Theme Based -->
                      <div
                        :class="`flex items-center gap-2 ${themeTextClass} opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300`">
                        <span class="text-xs font-bold uppercase tracking-widest">EXPLORE</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Decorative Corner Element - Theme Based -->
                <div :class="`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${themeCorner1Class} transition-all`">
                </div>
                <div
                  :class="`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr ${themeCorner2Class} transition-all`">
                </div>
                <div :class="`absolute top-0 left-0 w-16 h-16 bg-gradient-to-br ${themeCorner3Class} transition-all`">
                </div>
              </a>
            </div>
          </div>

          <!-- Creative Footer - Theme Based -->
          <div
            :class="`mt-12 flex items-center justify-between p-6 rounded-2xl border-2 ${themeFooterBorderClass} bg-black/40 backdrop-blur-sm shadow-xl ${themeFooterShadowClass}`">
            <button @click="handleReportClick"
              :class="`group relative px-6 py-3 overflow-hidden rounded-full border-2 ${themeReportButtonBorderClass} transition-all shadow-lg ${themeReportButtonShadowClass}`">
              <span :class="`relative z-10 flex items-center gap-2 ${themeTextClass} group-hover:text-white`">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
                </svg>
                <span class="font-bold">{{ t('socialLinks.reportUser') }}</span>
              </span>
              <div :class="`absolute inset-0 bg-gradient-to-r ${themeReportButtonGradientClass} transition-all`"></div>
            </button>

            <img src="../assets/icons/icon.svg" alt="Logo"
              class="w-12 h-12 opacity-60 hover:opacity-100 transition-opacity">
          </div>
        </div>
      </div>
    </div>

    <ReportWindow :show="showReport" @close="showReport = false" @submit="handleSubmitReport" />
    <ToastMessage :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
      @close="closeToast" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/auth'
import ReportWindow from '../components/reports/reportWindow.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import ToastMessage from '../components/alerts/toastMessage.vue'

const { t } = useI18n()

// Import all available icons statically for Vite
import facebookIcon from '../assets/icons/facebook.svg'
import linkedinIcon from '../assets/icons/linkedin.svg'
import youtubeIcon from '../assets/icons/youtube.svg'
import twitterIcon from '../assets/icons/twitter.svg'
import instagramIcon from '../assets/icons/instagram.svg'
import githubIcon from '../assets/icons/github.svg'
import discordIcon from '../assets/icons/discord.svg'
import { userService, userLinksService, userReportService } from '../services/user'

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

// Toast state
const toast = ref({
  show: false,
  type: 'info' as 'success' | 'error' | 'info',
  title: '',
  message: ''
});

const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
  toast.value = { show: true, type, title, message };
};

const closeToast = () => {
  toast.value.show = false;
};

// Get user ID from route params
const userId = computed(() => route.params.id as string || '')

// Loading and error states
const isLoading = ref(false)
const error = ref<string | null>(null)

// User profile data
const userName = ref<string>('')
const userDescription = ref<string>('')
const userProfileImage = ref<string>('')
const userTag = ref<string>('')

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
    showToast('error', 'Authentication Required', t('socialLinks.pleaseLoginToReport'))
    router.push({
      name: 'login',
      query: { redirect: route.fullPath }
    })
    return
  }

  if (!userId.value) {
    showToast('error', 'Missing Information', t('socialLinks.userIdRequired'))
    return
  }

  // Validate report payload
  const validationError = userReportService.validateReport({
    user_id: userId.value,
    title: payload.title,
    description: payload.description,
    report_type: payload.type
  })

  if (validationError) {
    showToast('error', 'Validation Error', validationError)
    return
  }

  if (isSubmittingReport.value) {
    return // Prevent multiple submissions
  }

  isSubmittingReport.value = true

  try {
    // Call the service to submit the report
    await userReportService.submitReport({
      user_id: userId.value, // The user being reported
      title: payload.title,
      description: payload.description,
      report_type: payload.type
    });

    // Show success message
    showToast('success', 'Success', 'Report submitted successfully. Thank you for your feedback.');

    // Close the report window
    showReport.value = false;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to submit report. Please try again.';
    showToast('error', 'Error', errorMessage);
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
    return
  }

  try {
    // Fetch user by ID directly
    const userData = await userService.getUserById(userId.value)

    // Get user info from /users/{id} endpoint (independent of button links)
    // Set profile_image, name, and description from user data
    if (userData.profile_image) {
      userProfileImage.value = userData.profile_image
    }

    // Set name and description if available (so they work even without button links)
    if (userData.name) {
      userName.value = userData.name
    }
    if (userData.description || userData.subtitle) {
      userDescription.value = userData.description || userData.subtitle || ''
    }
    // Set user tag if available (check all possible field names from API)
    if (userData.usertag) {
      userTag.value = userData.usertag
    } else if (userData.tag) {
      userTag.value = userData.tag
    } else if (userData.role) {
      userTag.value = userData.role
    }

    // Get theme_id from theme object
    const themeId = userData.theme?.theme_id

    if (themeId !== undefined && themeId !== null) {
      themeNumber.value = parseInt(String(themeId))
    } else {
      themeNumber.value = 1 // Default to theme 1
    }
  } catch (err: any) {
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

    // Get visible button links sorted by order
    const visibleLinks = await userLinksService.getVisibleButtonLinks(userId.value)

    if (visibleLinks.length > 0) {
      // Extract user data from button links (if available)
      const userButtonLinks = await userLinksService.getUserButtonLinks(userId.value)
      const extractedUserData = userLinksService.extractUserData(userButtonLinks)

      if (extractedUserData) {
        if (!userName.value) {
          userName.value = extractedUserData.name || ''
        }
        if (!userDescription.value) {
          userDescription.value = extractedUserData.description || ''
        }

        // Set user tag if available (check all possible field names from API)
        if (!userTag.value) {
          if (extractedUserData.usertag) {
            userTag.value = extractedUserData.usertag
          } else if (extractedUserData.tag) {
            userTag.value = extractedUserData.tag
          } else if (extractedUserData.role) {
            userTag.value = extractedUserData.role
          }
        }
      }

      // Map to SocialLink format
      socialLinks.value = visibleLinks.map((link) => ({
        title: link.title,
        description: link.description,
        link: link.link,
        platform: link.platform,
        icon: link.icon
      }))
    } else {
      // No links found, but user info (name, description, profile_image) 
      // should already be set from fetchUserInfo() which is called first
      // So we don't clear them - they are independent of button links
      socialLinks.value = []
    }
  } catch (err: any) {
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

// Theme-based color classes (computed)
const themeBgClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-50 via-sky-100 to-blue-50'
    case 2: return 'from-blue-950 via-slate-900 to-blue-900'
    case 3: return 'from-purple-950 via-black to-purple-900'
    case 4: return 'from-red-950 via-black to-red-900'
    default: return 'from-blue-50 via-sky-100 to-blue-50'
  }
})

const themeBgOverlayClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-400/20 via-sky-300/15 to-blue-500/20'
    case 2: return 'from-blue-600/20 via-blue-800/15 to-blue-900/20'
    case 3: return 'from-purple-600/20 via-purple-800/15 to-purple-900/20'
    case 4: return 'from-red-600/20 via-red-800/15 to-red-900/20'
    default: return 'from-blue-400/20 via-sky-300/15 to-blue-500/20'
  }
})

const themeOrb1Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'bg-blue-400'
    case 2: return 'bg-blue-600'
    case 3: return 'bg-purple-600'
    case 4: return 'bg-red-600'
    default: return 'bg-blue-400'
  }
})

const themeOrb2Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'bg-sky-300'
    case 2: return 'bg-blue-500'
    case 3: return 'bg-purple-500'
    case 4: return 'bg-red-500'
    default: return 'bg-sky-300'
  }
})

const themeOrb3Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'bg-blue-500'
    case 2: return 'bg-blue-700'
    case 3: return 'bg-purple-700'
    case 4: return 'bg-red-700'
    default: return 'bg-blue-500'
  }
})

const themeOrb4Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'bg-blue-300'
    case 2: return 'bg-blue-400'
    case 3: return 'bg-purple-400'
    case 4: return 'bg-red-400'
    default: return 'bg-blue-300'
  }
})

const themeGradientClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-400 via-sky-400 to-blue-500'
    case 2: return 'from-blue-500 via-blue-600 to-blue-700'
    case 3: return 'from-purple-400 via-purple-500 to-purple-600'
    case 4: return 'from-red-400 via-red-500 to-red-600'
    default: return 'from-blue-400 via-sky-400 to-blue-500'
  }
})

const themeGradientRingsClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-400 via-blue-500 to-sky-500'
    case 2: return 'from-blue-500 via-blue-600 to-blue-700'
    case 3: return 'from-purple-500 via-purple-600 to-purple-700'
    case 4: return 'from-red-500 via-red-600 to-red-700'
    default: return 'from-blue-400 via-blue-500 to-sky-500'
  }
})

const themeBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-400'
    case 2: return 'border-blue-400'
    case 3: return 'border-purple-400'
    case 4: return 'border-red-400'
    default: return 'border-blue-400'
  }
})

const themeTextClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'text-blue-400'
    case 2: return 'text-blue-400'
    case 3: return 'text-purple-400'
    case 4: return 'text-red-400'
    default: return 'text-blue-400'
  }
})

const themeTextHoverClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'group-hover:text-blue-400'
    case 2: return 'group-hover:text-blue-400'
    case 3: return 'group-hover:text-purple-400'
    case 4: return 'group-hover:text-red-400'
    default: return 'group-hover:text-blue-400'
  }
})

const themeHoverBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'hover:border-blue-400'
    case 2: return 'hover:border-blue-400'
    case 3: return 'hover:border-purple-400'
    case 4: return 'hover:border-red-400'
    default: return 'hover:border-blue-400'
  }
})

const themeLoadingBorder1Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-500'
    case 2: return 'border-blue-600'
    case 3: return 'border-purple-500'
    case 4: return 'border-red-500'
    default: return 'border-blue-500'
  }
})

const themeLoadingBorder2Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-sky-300'
    case 2: return 'border-blue-500'
    case 3: return 'border-purple-600'
    case 4: return 'border-red-600'
    default: return 'border-sky-300'
  }
})

const themeLoadingBorder3Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-400'
    case 2: return 'border-blue-400'
    case 3: return 'border-purple-400'
    case 4: return 'border-red-400'
    default: return 'border-blue-400'
  }
})

const themeProfileBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-400/40'
    case 2: return 'border-blue-400/40'
    case 3: return 'border-purple-400/40'
    case 4: return 'border-red-400/40'
    default: return 'border-blue-400/40'
  }
})

const themeProfileShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'shadow-blue-500/50'
    case 2: return 'shadow-blue-600/50'
    case 3: return 'shadow-purple-500/50'
    case 4: return 'shadow-red-500/50'
    default: return 'shadow-blue-500/50'
  }
})

const themeBadgeBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-400/50'
    case 2: return 'border-blue-400/50'
    case 3: return 'border-purple-400/50'
    case 4: return 'border-red-400/50'
    default: return 'border-blue-400/50'
  }
})

const themeBadgeShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'shadow-blue-500/50'
    case 2: return 'shadow-blue-600/50'
    case 3: return 'shadow-purple-500/50'
    case 4: return 'shadow-red-500/50'
    default: return 'shadow-blue-500/50'
  }
})

const themeUnderlineShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'shadow-blue-500/50'
    case 2: return 'shadow-blue-600/50'
    case 3: return 'shadow-purple-500/50'
    case 4: return 'shadow-red-500/50'
    default: return 'shadow-blue-500/50'
  }
})

const themeLinkHoverBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'hover:border-blue-400/60'
    case 2: return 'hover:border-blue-400/60'
    case 3: return 'hover:border-purple-400/60'
    case 4: return 'hover:border-red-400/60'
    default: return 'hover:border-blue-400/60'
  }
})

const themeLinkShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'hover:shadow-blue-500/40'
    case 2: return 'hover:shadow-blue-600/40'
    case 3: return 'hover:shadow-purple-500/40'
    case 4: return 'hover:shadow-red-500/40'
    default: return 'hover:shadow-blue-500/40'
  }
})

const themeIconShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'shadow-blue-500/30'
    case 2: return 'shadow-blue-600/30'
    case 3: return 'shadow-purple-500/30'
    case 4: return 'shadow-red-500/30'
    default: return 'shadow-blue-500/30'
  }
})

const themeFooterBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-500/20'
    case 2: return 'border-blue-600/20'
    case 3: return 'border-purple-500/20'
    case 4: return 'border-red-500/20'
    default: return 'border-blue-500/20'
  }
})

const themeFooterShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'shadow-blue-500/10'
    case 2: return 'shadow-blue-600/10'
    case 3: return 'shadow-purple-500/10'
    case 4: return 'shadow-red-500/10'
    default: return 'shadow-blue-500/10'
  }
})

const themeReportButtonBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-500/40 hover:border-blue-400'
    case 2: return 'border-blue-600/40 hover:border-blue-400'
    case 3: return 'border-purple-500/40 hover:border-purple-400'
    case 4: return 'border-red-500/40 hover:border-red-400'
    default: return 'border-blue-500/40 hover:border-blue-400'
  }
})

const themeReportButtonShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'shadow-blue-500/20'
    case 2: return 'shadow-blue-600/20'
    case 3: return 'shadow-purple-500/20'
    case 4: return 'shadow-red-500/20'
    default: return 'shadow-blue-500/20'
  }
})

const themeReportButtonGradientClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-500/0 to-sky-300/0 group-hover:from-blue-500/30 group-hover:to-sky-300/30'
    case 2: return 'from-blue-600/0 to-blue-500/0 group-hover:from-blue-600/30 group-hover:to-blue-500/30'
    case 3: return 'from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/30 group-hover:to-purple-600/30'
    case 4: return 'from-red-500/0 to-red-600/0 group-hover:from-red-500/30 group-hover:to-red-600/30'
    default: return 'from-blue-500/0 to-sky-300/0 group-hover:from-blue-500/30 group-hover:to-sky-300/30'
  }
})

const themeBackButtonGradientClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-500/0 to-sky-300/0 group-hover:from-blue-500/30 group-hover:to-sky-300/30'
    case 2: return 'from-blue-600/0 to-blue-500/0 group-hover:from-blue-600/30 group-hover:to-blue-500/30'
    case 3: return 'from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/30 group-hover:to-purple-600/30'
    case 4: return 'from-red-500/0 to-red-600/0 group-hover:from-red-500/30 group-hover:to-red-600/30'
    default: return 'from-blue-500/0 to-sky-300/0 group-hover:from-blue-500/30 group-hover:to-sky-300/30'
  }
})

const themeLinkGradientHoverClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-500/0 via-sky-300/0 to-blue-500/0 group-hover:from-blue-500/30 group-hover:via-sky-300/30 group-hover:to-blue-500/30'
    case 2: return 'from-blue-600/0 via-blue-500/0 to-blue-600/0 group-hover:from-blue-600/30 group-hover:via-blue-500/30 group-hover:to-blue-600/30'
    case 3: return 'from-purple-600/0 via-purple-500/0 to-purple-700/0 group-hover:from-purple-600/30 group-hover:via-purple-500/30 group-hover:to-purple-700/30'
    case 4: return 'from-red-600/0 via-red-500/0 to-red-700/0 group-hover:from-red-600/30 group-hover:via-red-500/30 group-hover:to-red-700/30'
    default: return 'from-blue-500/0 via-sky-300/0 to-blue-500/0 group-hover:from-blue-500/30 group-hover:via-sky-300/30 group-hover:to-blue-500/30'
  }
})

const themeCorner1Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-500/0 to-transparent group-hover:from-blue-500/40'
    case 2: return 'from-blue-600/0 to-transparent group-hover:from-blue-600/40'
    case 3: return 'from-purple-500/0 to-transparent group-hover:from-purple-500/40'
    case 4: return 'from-red-500/0 to-transparent group-hover:from-red-500/40'
    default: return 'from-blue-500/0 to-transparent group-hover:from-blue-500/40'
  }
})

const themeCorner2Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-sky-300/0 to-transparent group-hover:from-sky-300/40'
    case 2: return 'from-blue-500/0 to-transparent group-hover:from-blue-500/40'
    case 3: return 'from-purple-600/0 to-transparent group-hover:from-purple-600/40'
    case 4: return 'from-red-600/0 to-transparent group-hover:from-red-600/40'
    default: return 'from-sky-300/0 to-transparent group-hover:from-sky-300/40'
  }
})

const themeCorner3Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-400/0 to-transparent group-hover:from-blue-400/20'
    case 2: return 'from-blue-400/0 to-transparent group-hover:from-blue-400/20'
    case 3: return 'from-purple-400/0 to-transparent group-hover:from-purple-400/20'
    case 4: return 'from-red-400/0 to-transparent group-hover:from-red-400/20'
    default: return 'from-blue-400/0 to-transparent group-hover:from-blue-400/20'
  }
})

// Format tag name function (using service)
const formatTagName = (tagName: string): string => {
  return userService.formatTagName(tagName);
};

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
/* Component-specific styles only */
</style>
