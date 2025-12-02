<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-900">
      {{ t("superAdmin.usersManagement") }}
    </h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <p class="text-gray-600">{{ t("users.loadingUsers") }}</p>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50"
      @click.self="closeDeleteModal">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 text-center">
            {{ t("users.deleteUserConfirm") }}
          </h3>

          <div v-if="userToDeleteData" class="mb-6">
            <p class="text-2xl font-bold text-gray-900 mb-2 text-center">
              {{ userToDeleteData.name }}
            </p>
            <p class="text-sm text-gray-600 text-center mb-1">
              {{ userToDeleteData.username }}
            </p>
            <p class="text-sm text-gray-600 text-center">
              {{ userToDeleteData.email }}
            </p>
          </div>

          <div class="flex gap-3">
            <button @click="confirmDelete"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
              {{ t("common.yes") }}
            </button>
            <button @click="closeDeleteModal"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
              {{ t("common.cancel") }}
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
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t("users.image") }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t("users.id") }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t("users.username") }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t("users.name") }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Premium
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t("users.email") }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t("users.phone") }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t("users.updatedAt") }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t("users.action") }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="users.length === 0">
              <td colspan="9" class="px-4 py-8 text-center text-gray-500">
                {{ t("users.noUsersFound") }}
              </td>
            </tr>
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap">
                <img :src="user.image" :alt="user.username" class="w-10 h-10 rounded-full object-cover"
                  @error="handleImageError" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {{ user.id }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {{ user.username }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center gap-2">
                  <span>{{ user.name }}</span>
                  <svg
                    v-if="user.premium === 1"
                    class="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {{ user.premium === 1 ? 'Yes' : 'No' }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {{ user.email }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {{ user.phone || "-" }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {{ user.updatedAt ? formatDate(user.updatedAt) : "-" }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm">
                <div class="flex items-center gap-x-2">
                  <button @click="handleView(user.id)"
                    class="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors">
                    {{ t("common.view") }}
                  </button>
                  <button @click="handleEdit(user.id)"
                    class="px-3 py-1 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors">
                    {{ t("common.edit") }}
                  </button>
                  <button @click="handleDelete(user.id)"
                    class="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors">
                    {{ t("common.delete") }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination Controls -->
      <div v-if="pagination && pagination.last_page > 1" class="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            <span>Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} users</span>
          </div>
          <div class="flex items-center gap-2">
            <!-- Previous Button -->
            <button
              @click="goToPage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              :class="[
                'px-3 py-1 text-sm font-medium rounded transition-colors',
                pagination.current_page === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              ]">
              Previous
            </button>
            
            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1 text-sm font-medium rounded transition-colors',
                  page === pagination.current_page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                ]">
                {{ page }}
              </button>
            </div>
            
            <!-- Next Button -->
            <button
              @click="goToPage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              :class="[
                'px-3 py-1 text-sm font-medium rounded transition-colors',
                pagination.current_page === pagination.last_page
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              ]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
    <ToastMessage :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
      @close="closeToast" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { superAdminUsersService, type PaginationMeta } from "../../services/superAdmin";
import defaultProfile from "../../assets/images/man.png";
import ToastMessage from "../../components/alerts/toastMessage.vue";

const { t } = useI18n();

const router = useRouter();

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string | null;
  image: string;
  premium?: number;
  createdAt: string;
  updatedAt: string;
}

const users = ref<User[]>([]);
const isLoading = ref(false);
const currentPage = ref(1);
const pagination = ref<PaginationMeta | null>(null);

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Handle image loading errors
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== defaultProfile) {
    target.src = defaultProfile;
  }
};

const showDeleteModal = ref(false);
const userToDelete = ref<number | null>(null);
const userToDeleteData = ref<User | null>(null);

// Computed property for visible page numbers
const visiblePages = computed(() => {
  if (!pagination.value) return [];
  
  const totalPages = pagination.value.last_page;
  const current = pagination.value.current_page;
  const pages: number[] = [];
  
  // Show up to 5 page numbers
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show pages around current page
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
    } else if (current >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i);
      }
    }
  }
  
  return pages;
});

// Fetch users from API
const fetchUsers = async (page: number = 1) => {
  try {
    isLoading.value = true;
    currentPage.value = page;

    const response = await superAdminUsersService.getAllUsers(page);
    
    // Update pagination metadata
    pagination.value = response.pagination;

    // Map to our User interface
    users.value = response.users.map((user) => {
      // Validate and set image URL with fallback
      let imageUrl = user.image || user.profile_image || "";

      // If we have an image URL, process it
      if (imageUrl && imageUrl.trim() !== "") {
        // Trim whitespace
        imageUrl = imageUrl.trim();

        // If it's already a full URL (http/https), use it as is
        // Laravel asset() helper returns full URLs when APP_URL is set
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
          // Use the URL as-is - asset() already provides the correct domain
        }
        // If it's a relative path starting with /storage, it will work with Vite proxy in dev
        // Laravel asset() can also return relative paths if APP_URL is not set
        else if (imageUrl.startsWith("/storage") || imageUrl.startsWith("/")) {
          // In development, Vite proxy handles /storage
          // In production, if it's relative, we might need to prepend backend URL
          if (import.meta.env.PROD) {
            const apiBaseUrl =
              import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
            const backendBase = apiBaseUrl.replace("/api", "");
            // Only prepend if it's not already a full URL
            if (!imageUrl.startsWith("http")) {
              imageUrl = `${backendBase}${imageUrl}`;
            }
          }
        }
        // If it starts with storage/ (no leading slash), add the slash
        else if (imageUrl.startsWith("storage/")) {
          imageUrl = `/${imageUrl}`;
          if (import.meta.env.PROD) {
            const apiBaseUrl =
              import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
            const backendBase = apiBaseUrl.replace("/api", "");
            imageUrl = `${backendBase}${imageUrl}`;
          }
        }
        // Invalid format - use default
        else {
          console.warn(
            `User ${user.id} - Invalid image URL format, using default:`,
            imageUrl
          );
          imageUrl = defaultProfile;
        }
      } else {
        imageUrl = defaultProfile;
      }

      // Check for placeholder URLs
      if (imageUrl.includes("via.placeholder.com")) {
        imageUrl = defaultProfile;
      }

      return {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        premium: user.premium !== undefined ? (user.premium === 1 ? 1 : 0) : 0,
        image: imageUrl,
        createdAt: user.createdAt || user.created_at || "",
        updatedAt: user.updatedAt || user.updated_at || "",
      };
    });
  } catch (err: any) {
    // console.error("Error fetching users:", err); // Dead code: Replaced by toastMessage component
    showToast('error', 'Error', err.response?.data?.message || t("users.failedToFetchUsers"));
  } finally {
    isLoading.value = false;
  }
};

const handleView = (userId: number) => {
  // Navigate to social-links route with user ID
  router.push({ name: "social-links", params: { id: userId } });
};

const handleEdit = (userId: number) => {
  // Navigate to edit user page
  router.push({ name: "superAdmin.editUser", params: { id: userId } });
};

const handleDelete = (userId: number) => {
  const user = users.value.find((u) => u.id === userId);
  if (user) {
    userToDelete.value = userId;
    userToDeleteData.value = user;
    showDeleteModal.value = true;
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
  userToDeleteData.value = null;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;

  try {
    await superAdminUsersService.deleteUser(userToDelete.value);

    // Remove user from list
    users.value = users.value.filter((u) => u.id !== userToDelete.value);
    
    // Update pagination total if needed
    if (pagination.value) {
      pagination.value.total = Math.max(0, pagination.value.total - 1);
      
      // If current page is empty and not first page, go to previous page
      if (users.value.length === 0 && currentPage.value > 1) {
        goToPage(currentPage.value - 1);
        closeDeleteModal();
        return;
      }
    }

    // Show success message
    const deletedUserName = userToDeleteData.value?.name || "User";
    showToast('success', 'Success', `${deletedUserName} has been deleted successfully.`);

    // Close modal
    closeDeleteModal();
  } catch (err: any) {
    // console.error("Error deleting user:", err); // Dead code: Replaced by toastMessage component
    showToast('error', 'Error', err.response?.data?.message || t("users.failedToDeleteUser"));
    closeDeleteModal();
  }
};

// Pagination navigation
const goToPage = (page: number) => {
  if (page < 1 || (pagination.value && page > pagination.value.last_page)) {
    return;
  }
  fetchUsers(page);
  // Scroll to top of table
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Fetch users when component mounts
onMounted(() => {
  fetchUsers(1);
});
</script>
