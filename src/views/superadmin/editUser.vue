<template>
  <div class="p-4 md:p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Edit User</h1>
    </div>

    <!-- Error and Success Messages -->
    <div v-if="errorMessage || successMessage" class="mb-4">
      <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
        <p class="text-red-800 font-semibold">{{ errorMessage }}</p>
      </div>
      <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
        <p class="text-green-800 font-semibold">{{ successMessage }}</p>
      </div>
    </div>

    <div v-if="isLoadingUser" class="text-center py-8">
      <p class="text-gray-600">Loading user data...</p>
    </div>
    
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Profile Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
          <div class="flex items-center gap-4">
            <img 
              :src="formData.image" 
              alt="Profile"
              class="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <button
              type="button"
              @click="triggerFileUpload"
              class="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
            >
              Change Image
            </button>
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileUpload" 
              accept="image/*"
              class="hidden"
            />
          </div>
        </div>

        <!-- Username -->
        <Text v-model="formData.username" label="Username" type="text" placeholder="Enter username" />
        

        <!-- Name -->
        <Text v-model="formData.name" label="Name" type="text" placeholder="Enter name" />
        

        <!-- Email -->
         <Text v-model="formData.email" label="Email" type="email" placeholder="Enter email" />
         

        <!-- Phone -->
         <Text v-model="formData.phone" label="Phone Number" type="tel" placeholder="Enter phone number" />
        
        <!-- Tag -->
        <Select
          v-model="formData.tag"
          label="Tag"
          placeholder="Select a tag"
          :options="tagOptions"
        />

        <!-- Change Password Section -->
        <div class="border-t border-gray-200 pt-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
          
          <div class="space-y-4">
            <Text v-model="passwordData.newPassword" label="New Password" type="password" placeholder="Enter new password" />
            <Text v-model="passwordData.confirmPassword" label="Confirm New Password" type="password" placeholder="Confirm new password" />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end gap-4 pt-4">
          <button
            type="button"
            @click="goBack"
            class="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Text from '../../components/inputs/text.vue'
import Select from '../../components/inputs/select.vue'
import api from '../../services/api'
import defaultProfile from '../../assets/images/man.png'

const router = useRouter()
const route = useRoute()
const fileInput = ref<HTMLInputElement | null>(null)

interface FormData {
  username: string
  name: string
  email: string
  phone: string
  image: string
  tag: string
}

interface PasswordData {
  newPassword: string
  confirmPassword: string
}

const formData = ref<FormData>({
  username: '',
  name: '',
  email: '',
  phone: '',
  image: defaultProfile,
  tag: ''
})

const passwordData = ref<PasswordData>({
  newPassword: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const isLoadingUser = ref(false)
const errorMessage = ref<string>('')
const successMessage = ref<string>('')

// Tag options (same as in profile view)
const tagOptions = [
  { label: 'Music', value: 'music' },
  { label: 'Photography', value: 'photography' },
  { label: 'Education', value: 'education' },
  { label: 'Programming', value: 'programming' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Volunteer', value: 'volunteer' },
  { label: 'Sports', value: 'sports' },
  { label: 'Mobile Apps', value: 'mobile_apps' },
  { label: 'Doctor', value: 'doctor' },
  { label: 'Therapist', value: 'therapist' },
  { label: 'Web Development', value: 'web_development' },
  { label: 'Influencer', value: 'influencer' },
  { label: 'Travel', value: 'travel' },
  { label: 'Filmmaker', value: 'filmmaker' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'Activist', value: 'activist' },
  { label: 'Scientist', value: 'scientist' },
  { label: 'Coach', value: 'coach' },
]

// Map tag IDs to tag names for display
const tagIdToNameMap: Record<number, string> = {
  1: 'music',
  2: 'photography',
  3: 'education',
  4: 'programming',
  5: 'marketing',
  6: 'volunteer',
  7: 'sports',
  8: 'mobile_apps',
  9: 'doctor',
  10: 'therapist',
  11: 'web_development',
  12: 'influencer',
  13: 'travel',
  14: 'filmmaker',
  15: 'gaming',
  16: 'activist',
  17: 'scientist',
  18: 'coach',
}

// Map tag names to tag IDs
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

// Extract tag name from user tags array
const getUserTagName = (userTags: any[]): string => {
  if (Array.isArray(userTags) && userTags.length > 0) {
    const tagId = userTags[0].id || userTags[0].tag_id
    return tagIdToNameMap[tagId] || ''
  }
  return ''
}

// Fetch user data from API
const fetchUserData = async () => {
  const userId = route.params.id
  if (!userId) {
    errorMessage.value = 'User ID is required'
    return
  }

  try {
    isLoadingUser.value = true
    errorMessage.value = ''

    // Fetch user data from API
    const response = await api.get(`/users/${userId}`)
    console.log('Fetched user data for editing:', response.data)

    // Parse response data
    const userData = response.data?.data || response.data || {}

    // Pre-fill form with user data
    formData.value = {
      username: userData.username || '',
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone_no || userData.phone || '',
      image: userData.profile_image || defaultProfile,
      tag: getUserTagName(userData.tags || [])
    }

    console.log('Form pre-filled with user data:', formData.value)
  } catch (err: any) {
    console.error('Error fetching user data:', err)

    if (err.response?.data?.message) {
      errorMessage.value = `Failed to load user: ${err.response.data.message}`
    } else {
      errorMessage.value = 'Failed to load user data. Please try again.'
    }
  } finally {
    isLoadingUser.value = false
  }
}

// Load user data when component mounts
onMounted(() => {
  fetchUserData()
})

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const selectedImageFile = ref<File | null>(null)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      errorMessage.value = 'Image size must be less than 2MB'
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Please select a valid image file'
      return
    }

    selectedImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    const userId = route.params.id
    if (!userId) {
      errorMessage.value = 'User ID is required'
      return
    }

    // Prepare form data for API
    const formDataToSend = new FormData()
    formDataToSend.append('username', formData.value.username.trim())
    formDataToSend.append('name', formData.value.name.trim())
    formDataToSend.append('email', formData.value.email.trim())
    formDataToSend.append('phone_no', formData.value.phone.trim())
    
    // Add tag if selected
    if (formData.value.tag) {
      const tagId = tagNameToIdMap[formData.value.tag]
      if (tagId) {
        formDataToSend.append('tags[1]', tagId.toString())
      }
    }

    // Add profile image if changed
    if (selectedImageFile.value) {
      formDataToSend.append('profile_image', selectedImageFile.value)
    }

    console.log('Updating user with data:', {
      username: formData.value.username,
      name: formData.value.name,
      email: formData.value.email,
      phone_no: formData.value.phone,
      tag: formData.value.tag
    })

    // Update user via API
    const response = await api.post(`/users/${userId}`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('User updated successfully:', response.data)
    successMessage.value = 'User updated successfully!'

    // Update password if provided
    if (passwordData.value.newPassword && passwordData.value.newPassword === passwordData.value.confirmPassword) {
      // TODO: Add password update API call if endpoint exists
      console.log('Password update requested (not implemented yet)')
    }

    // Clear success message after 3 seconds and navigate back
    setTimeout(() => {
      successMessage.value = ''
      goBack()
    }, 2000)
  } catch (err: any) {
    console.error('Error updating user:', err)

    // Parse error for user-friendly message
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors
      const errorMessages = Object.values(errors).flat()
      errorMessage.value = `Failed to update user: ${errorMessages.join(', ')}`
    } else if (err.response?.data?.message) {
      errorMessage.value = err.response.data.message
    } else {
      errorMessage.value = 'Failed to update user. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'superAdmin.users' })
}
</script>

