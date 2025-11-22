<template>
  <div class="p-4 md:p-6">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left Section - Profile Picture -->
      <div class="flex flex-col items-center md:items-start">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        <div class="relative">
          <img 
            :src="profileData.image" 
            alt="Profile"
            class="w-48 h-48 rounded-full object-cover border-4 border-gray-200"
          />
          <button
            @click="triggerFileUpload"
            class="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
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

      <!-- Right Section - Form -->
      <div class="flex-1">
        <div class="space-y-6">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">username</label>
            <input
              v-model="profileData.username"
              type="text"
              class="w-full px-4 py-3 bg-gray-100 border-b-2 border-blue-500 focus:outline-none focus:bg-white transition-colors"
              placeholder="Enter username"
            />
          </div>

          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="profileData.name"
              type="text"
              class="w-full px-4 py-3 bg-gray-100 border-b-2 border-blue-500 focus:outline-none focus:bg-white transition-colors"
              placeholder="Enter name"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="profileData.email"
              type="email"
              class="w-full px-4 py-3 bg-gray-100 border-b-2 border-blue-500 focus:outline-none focus:bg-white transition-colors"
              placeholder="Enter email"
            />
          </div>

          <!-- Phone No -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone No</label>
            <input
              v-model="profileData.phone"
              type="tel"
              class="w-full px-4 py-3 bg-gray-100 border-b-2 border-blue-500 focus:outline-none focus:bg-white transition-colors"
              placeholder="Enter phone number"
            />
          </div>

          <!-- Tag -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tag</label>
            <p class="text-xs text-gray-600 mb-3">
              Your tag describes your specialty or major or hobbies that you are currently working on and you are using our services to display your social links
            </p>
            <select
              v-model="profileData.tag"
              class="w-full px-4 py-3 bg-gray-100 border-b-2 border-blue-500 focus:outline-none focus:bg-white transition-colors appearance-none cursor-pointer"
            >
              <option value="">None</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="content-creator">Content Creator</option>
              <option value="business">Business</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>

        <!-- Save Changes Button -->
        <div class="mt-8 flex justify-center">
          <Submit text="Save Changes" @click="handleSave" />
          <button
            @click="handleSave"
            class="px-8 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Submit from '../../components/buttons/submit.vue'

const fileInput = ref<HTMLInputElement | null>(null)

interface ProfileData {
  username: string
  name: string
  email: string
  phone: string
  tag: string
  image: string
}

const profileData = ref<ProfileData>({
  username: '',
  name: '',
  email: '',
  phone: '',
  tag: '',
  image: '/src/assets/images/man.png'
})

// Load profile data (in real app, fetch from API)
onMounted(() => {
  // TODO: Fetch profile data from API
  profileData.value = {
    username: 'super_admin',
    name: 'Super Admin',
    email: 'admin@example.com',
    phone: '+1234567890',
    tag: '',
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
      profileData.value.image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleSave = () => {
  // TODO: Implement save functionality
  console.log('Save profile:', profileData.value)
}
</script>

