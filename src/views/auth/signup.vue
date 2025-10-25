<template>
  <div class="w-full bg-white flex flex-col items-center justify-center px-4 pt-0">
    <!-- Logo and Title Row -->
    <div class="flex flex-col md:flex-row items-center justify-center ">
      <img src="../../assets/icons/icon.svg" alt="logo" class="w-40 h-40 md:w-56 md:h-56 mb-4 md:mb-0 md:mr-8">
      <div class="hidden md:block w-px h-20 bg-gray-300 mr-8"></div>
      <h2 class="text-2xl md:text-4xl text-gray-700 text-center md:text-left">Let's make an account for you</h2>
    </div>

    <!-- Signup Form -->
    <div class="w-full max-w-7xl px-4 p">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Left Column -->
        <div class="space-y-8">
          <!-- Username Field -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Username</label>
            <input
              v-model="username"
              type="text"
              placeholder="e.g. Mustafa"
              :class="['w-full px-4 py-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors', usernameFocused ? 'border-b' : 'border-b-3']"
              style="border-bottom-color: #009AFF;"
              @focus="usernameFocused = true"
              @blur="usernameFocused = false"
            />
          </div>

          <!-- Email Field -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="e.g. Mustafa@example.com"
              :class="['w-full px-4 py-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors', emailFocused ? 'border-b' : 'border-b-3']"
              style="border-bottom-color: #009AFF;"
              @focus="emailFocused = true"
              @blur="emailFocused = false"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="e.g. 123456789"
              :class="['w-full px-4 py-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors', passwordFocused ? 'border-b' : 'border-b-3']"
              style="border-bottom-color: #009AFF;"
              @focus="passwordFocused = true"
              @blur="passwordFocused = false"
            />
          </div>
        </div>

        <!-- Middle Column -->
        <div class="space-y-8">
          <!-- Name Field -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Name</label>
            <input
              v-model="name"
              type="text"
              placeholder="e.g. Mustafa"
              :class="['w-full px-4 py-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors', nameFocused ? 'border-b' : 'border-b-3']"
              style="border-bottom-color: #009AFF;"
              @focus="nameFocused = true"
              @blur="nameFocused = false"
            />
          </div>

          <!-- Phone Number Field -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
            <input
              v-model="phoneNumber"
              type="tel"
              placeholder="e.g. +1234567890"
              :class="['w-full px-4 py-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors', phoneFocused ? 'border-b' : 'border-b-3']"
              style="border-bottom-color: #009AFF;"
              @focus="phoneFocused = true"
              @blur="phoneFocused = false"
            />
          </div>

          <!-- Tag Field -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Tag</label>
            
            <select
              v-model="selectedTag"
              class="w-full px-4 py-3 border-b-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              style="border-bottom-color: #009AFF;"
            >
              <option value="">None</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="writer">Writer</option>
              <option value="photographer">Photographer</option>
              <option value="musician">Musician</option>
              <option value="artist">Artist</option>
              <option value="student">Student</option>
              <option value="entrepreneur">Entrepreneur</option>
            </select>
            <p class="text-gray-600 text-xs mb-3 pt-2">
              Your tag describes your specialty, major, or hobbies.
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
          class="bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-4"
          style="width: 100%; max-width: 300px;"
        >
          Signup
        </button>
      </div>

      <!-- Login Link -->
      <div class="text-center">
        <span class="text-gray-600 text-sm">have an account? </span>
        <a @click="goToLogin" class="text-blue-600 text-sm underline hover:text-blue-800 cursor-pointer">Login</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const name = ref('')
const phoneNumber = ref('')
const selectedTag = ref('')
const profileImage = ref('')

const usernameFocused = ref(false)
const emailFocused = ref(false)
const passwordFocused = ref(false)
const nameFocused = ref(false)
const phoneFocused = ref(false)

const fileInput = ref(null)
const router = useRouter()

const goToLogin = () => {
  router.push({ name: 'login' })
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSignup = () => {
  console.log('Signup clicked')
}
</script>