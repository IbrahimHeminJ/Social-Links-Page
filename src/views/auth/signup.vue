<template>
  <div class="w-full bg-white flex flex-col items-center justify-center px-4 pt-0 relative">
    <!-- Language Switcher - Top Right -->
    <div class="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>
    <!-- Logo and Title Row -->
    <div class="flex flex-col md:flex-row items-center justify-center ">
      <img src="../../assets/icons/icon.svg" alt="logo" class="w-40 h-40 md:w-56 md:h-56 mb-4 md:mb-0 md:mr-8">
      <div class="hidden md:block w-px h-20 bg-gray-300 mr-8"></div>
      <h2 class="text-2xl md:text-4xl text-gray-700 text-center md:text-left">{{ t('auth.signup') }}</h2>
    </div>

    <!-- Signup Form -->
    <div class="w-full max-w-7xl px-4 p">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Left Column -->
        <div class="space-y-8">
          <!-- Username Field -->
          <Text v-model="username" :label="t('auth.username')" :placeholder="t('auth.enterUsername')" type="text" class="mb-6" />
          

          <!-- Email Field -->
           <Text v-model="email" :label="t('auth.email')" :placeholder="t('auth.enterEmail')" type="email" class="mb-6" />
          

          <!-- Password Field -->
          <Text v-model="password" :label="t('auth.password')" :placeholder="t('auth.enterPassword')" type="password" class="mb-6" />
          
        </div>

        <!-- Middle Column -->
        <div class="">
          <!-- Name Field -->
          <Text v-model="name" :label="t('auth.name')" :placeholder="t('auth.enterName')" type="text" class="mb-6" />
        

          <!-- Phone Number Field -->
          <Text v-model="phoneNumber" label="Phone Number" placeholder="e.g. +1234567890" type="tel" class="mb-6" />

          <!-- Tag Field -->

          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">{{ t('profile.tag') }}</label>
            
            <select
              v-model="selectedTag"
              class="w-full px-4 py-3 border-b-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              style="border-bottom-color: #009AFF;"
            >
              <option value="">None</option>
              <option value="music">Music</option>
              <option value="photography">Photography</option>
              <option value="education">Education</option>
              <option value="programming">Programming</option>
              <option value="marketing">Marketing</option>
              <option value="volunteer">Volunteer</option>
              <option value="sports">Sports</option>
              <option value="mobile_apps">Mobile Apps</option>
              <option value="doctor">Doctor</option>
              <option value="therapist">Therapist</option>
              <option value="web_development">Web Development</option>
              <option value="influencer">Influencer</option>
              <option value="travel">Travel</option>
              <option value="filmmaker">Filmmaker</option>
              <option value="gaming">Gaming</option>
              <option value="activist">Activist</option>
              <option value="scientist">Scientist</option>
              <option value="coach">Coach</option>
            </select>
            <p class="text-gray-600 text-xs mb-3 pt-2">
              {{ t('profile.tagDescription') }}
            </p>
          </div>
        </div>

        <!-- Right Column - Profile Image -->
        <div class="space-y-6">
          <!-- Profile Image Upload -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Profile Image</label>
            <div 
              @click="triggerFileUpload"
              class="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div class="flex flex-col items-center">
                <div v-if="!profileImage" class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div v-else class="w-16 h-16 rounded-full overflow-hidden mb-4">
                  <img :src="profileImage" alt="Profile" class="w-full h-full object-cover">
                </div>
                <p class="text-blue-600 font-medium">{{ profileImage ? 'Change Image' : 'Upload an Image' }}</p>
              </div>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="hidden"
            />
          </div>
        </div>
      </div>

      <!-- Signup Button -->
      <div class="mt-8 flex justify-center">

        <button
          @click="handleSignup"
          class="cursor-pointer bg-[#009AFF] text-white font-bold rounded-[10px] hover:bg-[#009AFF]/80 transition-colors py-3 px-4 mb-4"
          style="width: 100%; max-width: 300px;"
        >
          {{ t('common.signup') }}
        </button>
      </div>

      <!-- Login Link -->
      <div class="text-center">
        <span class="text-gray-600 text-sm">{{ t('auth.haveAccount') }} </span>
        <Hyperlink :text="t('auth.loginHere')" @click="goToLogin" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import { useI18n } from 'vue-i18n';
import Text from '../../components/inputs/text.vue';
import Hyperlink from '../../components/buttons/hyperlink.vue';
import LanguageSwitcher from '../../components/LanguageSwitcher.vue';

const { t } = useI18n()

const username = ref('')
const email = ref('')
const password = ref('')
const name = ref('')
const phoneNumber = ref('')
const selectedTag = ref('')
const profileImage = ref('')
const profileImageFile = ref<File | null>(null)

// Map tag names to tag IDs from database
// Based on the tags table: music=1, photography=2, education=3, programming=4, etc.
const tagNameToIdMap: Record<string, number> = {
  'music': 1,
  'photography': 2,
  'education': 3,
  'programming': 4,
  'marketing': 5,
  'volunteer': 6,
  'sports': 7,
  'mobile_apps': 8,
  'doctor': 9,
  'therapist': 10,
  'web_development': 11,
  'influencer': 12,
  'travel': 13,
  'filmmaker': 14,
  'gaming': 15,
  'activist': 16,
  'scientist': 17,
  'coach': 18,
}

const fileInput = ref<HTMLInputElement | null>(null)
const router = useRouter()
const authStore = useAuthStore()

const goToLogin = () => {
  router.push({ name: 'login' })
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // Store the file object for upload
    profileImageFile.value = file
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleSignup = async () => {
  // Clear any previous errors
  authStore.clearError()

  // Trim whitespace from all fields
  const trimmedUsername = username.value.trim()
  const trimmedEmail = email.value.trim()
  const trimmedPassword = password.value.trim()
  const trimmedName = name.value.trim()

  // Validate required fields
  if (!trimmedUsername || !trimmedEmail || !trimmedPassword || !trimmedName || !phoneNumber.value?.trim()) {
    alert('Please fill in all required fields (username, email, password, name, phone number)')
    return
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmedEmail)) {
    alert('Please enter a valid email address')
    return
  }

  // Validate password length (>= 8 characters)
  if (trimmedPassword.length < 8) {
    alert('Password must be at least 8 characters long')
    return
  }

  // Convert tag name to tag ID
  let tagIds: number[] | undefined = undefined
  if (selectedTag.value) {
    const tagId = tagNameToIdMap[selectedTag.value]
    if (tagId !== undefined) {
      tagIds = [tagId]
    }
  }

  // Debug: Log the data being sent
  console.log('Signup data:', {
    username: trimmedUsername,
    email: trimmedEmail,
    password: trimmedPassword ? '***' : '',
    name: trimmedName,
    phone_no: phoneNumber.value?.trim(),
    profile_image: profileImageFile.value ? 'File selected' : 'No file',
    tags: tagIds,
    selectedTag: selectedTag.value,
    tagId: tagIds && tagIds.length > 0 ? tagIds[0] : undefined,
  })

  // Call signup action with FormData
  const result = await authStore.signup({
    username: trimmedUsername,
    email: trimmedEmail,
    password: trimmedPassword,
    name: trimmedName,
    phone_no: phoneNumber.value.trim(),
    profile_image: profileImageFile.value || undefined,
    tags: tagIds, // Send array of tag IDs (integers)
  })

  if (result.success) {
    // Signup successful, redirect to home
    router.push({ name: 'home' })
  } else {
    // Signup failed, show error
    alert(result.error || 'Signup failed')
  }
}
</script>