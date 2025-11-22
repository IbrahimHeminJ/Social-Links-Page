<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-900">Users Management</h1>
    
    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteModal"
      class="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50"
      @click.self="closeDeleteModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 text-center">
            Are you sure to <span class="text-red-600 font-semibold">delete</span> this User?
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
              Yes
            </button>
            <button
              @click="closeDeleteModal"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap">
                <img 
                  :src="user.image" 
                  :alt="user.username"
                  class="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ user.username }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ user.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ user.email }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ user.phone || '-' }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatDate(user.createdAt) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatDate(user.updatedAt) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm">
                <div class="flex items-center gap-x-2">
                  <button 
                    @click="handleView(user.id)"
                    class="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                  >
                    View
                  </button>
                  <button 
                    @click="handleEdit(user.id)"
                    class="px-3 py-1 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    @click="handleDelete(user.id)"
                    class="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  >
                    Delete
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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

// Sample data - replace with API call later
const users = ref<User[]>([
  {
    id: 1,
    username: 'john_doe',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    image: '/src/assets/images/man.png',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z'
  },
  {
    id: 2,
    username: 'jane_smith',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    image: '/src/assets/images/man.png',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-19T16:45:00Z'
  },
  {
    id: 3,
    username: 'bob_wilson',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    phone: null,
    image: '/src/assets/images/man.png',
    createdAt: '2024-01-17T11:00:00Z',
    updatedAt: '2024-01-18T10:30:00Z'
  }
])

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

const handleView = (userId: number) => {
  // Navigate to social-links route
  router.push({ name: 'social-links' })
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

const confirmDelete = () => {
  if (userToDelete.value) {
    // TODO: Implement delete functionality
    console.log('Delete user:', userToDelete.value)
    // After delete, close modal and refresh list
    closeDeleteModal()
  }
}
</script>

