<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-900">{{ t('superAdmin.usersManagement') }}</h1>
    
    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-600">{{ error }}</p>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <p class="text-gray-600">{{ t('users.loadingUsers') }}</p>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteModal"
      class="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50"
      @click.self="closeDeleteModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 text-center">
            {{ t('users.deleteUserConfirm') }}
          </h3>
          
          <div v-if="userToDeleteData" class="mb-6">
            <p class="text-2xl font-bold text-gray-900 mb-2 text-center">{{ userToDeleteData.name }}</p>
            <p class="text-sm text-gray-600 text-center mb-1">{{ userToDeleteData.username }}</p>
            <p class="text-sm text-gray-600 text-center">{{ userToDeleteData.email }}</p>
          </div>
          
          <div class="flex gap-3">
            <button
              @click="confirmDelete"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              {{ t('common.yes') }}
            </button>
            <button
              @click="closeDeleteModal"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              {{ t('common.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Users Table -->
    <div v-if="!isLoading" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('users.image') }}</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('users.id') }}</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('users.username') }}</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('users.name') }}</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('users.email') }}</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('users.phone') }}</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('users.updatedAt') }}</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('users.action') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="users.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                {{ t('users.noUsersFound') }}
              </td>
            </tr>
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap">
                <img 
                  :src="user.image" 
                  :alt="user.username"
                  class="w-10 h-10 rounded-full object-cover"
                  @error="(e: any) => e.target.src = '/src/assets/images/man.png'"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ user.username }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ user.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ user.email }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ user.phone || '-' }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ user.updatedAt ? formatDate(user.updatedAt) : '-' }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm">
                <div class="flex items-center gap-x-2">
                  <button 
                    @click="handleView(user.id)"
                    class="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                  >
                    {{ t('common.view') }}
                  </button>
                  <button 
                    @click="handleEdit(user.id)"
                    class="px-3 py-1 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                  >
                    {{ t('common.edit') }}
                  </button>
                  <button 
                    @click="handleDelete(user.id)"
                    class="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  >
                    {{ t('common.delete') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { superAdminUsersService } from '../../services/superAdmin'

const { t } = useI18n()

const router = useRouter()

interface User {
  id: number
  username: string
  name: string
  email: string
  phone: string | null
  image: string
  createdAt: string
  updatedAt: string
}

const users = ref<User[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const showDeleteModal = ref(false)
const userToDelete = ref<number | null>(null)
const userToDeleteData = ref<User | null>(null)

// Fetch users from API
const fetchUsers = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const fetchedUsers = await superAdminUsersService.getAllUsers()
    
    // Map to our User interface
    users.value = fetchedUsers.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image || '/src/assets/images/man.png',
      createdAt: user.createdAt || user.created_at || '',
      updatedAt: user.updatedAt || user.updated_at || ''
    }))
  } catch (err: any) {
    console.error('Error fetching users:', err)
    error.value = err.response?.data?.message || t('users.failedToFetchUsers')
  } finally {
    isLoading.value = false
  }
}

const handleView = (userId: number) => {
  // Navigate to social-links route with user ID
  router.push({ name: 'social-links', params: { id: userId } })
}

const handleEdit = (userId: number) => {
  // Navigate to edit user page
  router.push({ name: 'superAdmin.editUser', params: { id: userId } })
}

const handleDelete = (userId: number) => {
  const user = users.value.find(u => u.id === userId)
  if (user) {
    userToDelete.value = userId
    userToDeleteData.value = user
    showDeleteModal.value = true
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
  userToDeleteData.value = null
}

const confirmDelete = async () => {
  if (!userToDelete.value) return
  
  try {
    await superAdminUsersService.deleteUser(userToDelete.value)
    
    // Remove user from list
    users.value = users.value.filter(u => u.id !== userToDelete.value)
    
    // Close modal
    closeDeleteModal()
  } catch (err: any) {
    console.error('Error deleting user:', err)
    error.value = err.response?.data?.message || t('users.failedToDeleteUser')
    closeDeleteModal()
  }
}

// Fetch users when component mounts
onMounted(() => {
  fetchUsers()
})
</script>

