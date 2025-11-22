<template>
  <div class="p-4 md:p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Edit User</h1>
    </div>
    
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
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
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Save Changes
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

const router = useRouter()
const route = useRoute()
const fileInput = ref<HTMLInputElement | null>(null)

interface FormData {
  username: string
  name: string
  email: string
  phone: string
  image: string
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
  image: '/src/assets/images/man.png'
})

const passwordData = ref<PasswordData>({
  newPassword: '',
  confirmPassword: ''
})

// Load user data (in real app, fetch from API using route.params.id)
onMounted(() => {
  const userId = route.params.id
  // TODO: Fetch user data from API
  // For now, using sample data
  formData.value = {
    username: 'john_doe',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    image: '/src/assets/images/man.png'
  }
})

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = () => {
  // TODO: Implement save functionality
  console.log('Form data:', formData.value)
  console.log('Password data:', passwordData.value)
  // After save, navigate back
  goBack()
}

const goBack = () => {
  router.push({ name: 'superAdmin.users' })
}
</script>

