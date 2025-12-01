<template>
  <div class="p-4 md:p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Edit User</h1>
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
            <img :src="formData.image" alt="Profile"
              class="w-20 h-20 rounded-full object-cover border-2 border-gray-200" @error="handleImageError" />
            <button type="button" @click="triggerFileUpload"
              class="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors">
              Change Image
            </button>
            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="hidden" />
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

        <!-- Tags (Multiple Selection) -->
        <div v-if="isLoadingTags" class="text-gray-500 text-sm py-2">
          Loading tags...
        </div>
        <div v-else class="flex flex-col gap-y-4">
          <label>
            <TextHeading>Tags</TextHeading>
          </label>

          <!-- Selected Tags as Badges -->
          <div v-if="formData.tags && formData.tags.length > 0" class="flex flex-wrap gap-2 mb-2">
            <span v-for="tagValue in formData.tags" :key="tagValue"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
              <span>{{ getTagLabel(tagValue) }}</span>
              <button type="button" @click="removeTag(tagValue)"
                class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 transition-colors focus:outline-none"
                title="Remove tag">
                <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
          <div v-else class="text-sm text-gray-500 mb-2">No tags selected</div>

          <!-- Tags Dropdown -->
          <div class="relative" ref="dropdownContainer">
            <button type="button" @click="toggleTagsDropdown"
              class="caret-[#009AFF] w-full px-4 h-[48px] rounded-[10px] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors border-[#009AFF] border-b-2 focus:border-none flex items-center justify-between cursor-pointer"
              :class="{ 'rounded-b-none': isTagsDropdownOpen }">
              <span class="text-gray-400">Select tags</span>
              <svg class="w-5 h-5 text-gray-500 transition-transform"
                :class="{ 'transform rotate-180': isTagsDropdownOpen }" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
              <div v-if="isTagsDropdownOpen"
                class="absolute z-50 w-full mt-1 bg-white border border-gray-300 border-t-0 rounded-b-[10px] shadow-lg max-h-64 overflow-auto"
                style="border-top: none">
                <button v-for="option in tagOptions" :key="option.value" type="button"
                  @click="toggleTagSelection(option)"
                  class="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors cursor-pointer text-left"
                  :class="{
                    'bg-blue-50': formData.tags.includes(option.value),
                  }">
                  <span class="flex-1">{{ option.label }}</span>
                  <svg v-if="formData.tags.includes(option.value)" class="w-5 h-5 text-[#009AFF]" fill="currentColor"
                    viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Change Password Section -->
        <div class="border-t border-gray-200 pt-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Change Password
          </h2>

          <div class="space-y-4">
            <Text v-model="passwordData.newPassword" label="New Password" type="password"
              placeholder="Enter new password" />
            <Text v-model="passwordData.confirmPassword" label="Confirm New Password" type="password"
              placeholder="Confirm new password" />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end gap-4 pt-4">
          <button type="button" @click="goBack"
            class="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button type="submit" :disabled="isLoading"
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </form>
    </div>
    <ToastMessage :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
      @close="closeToast" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import Text from "../../components/inputs/text.vue";
import { superAdminUsersService } from "../../services/superAdmin";
import { userService } from "../../services/user";
import defaultProfile from "../../assets/images/man.png";
import ToastMessage from "../../components/alerts/toastMessage.vue";
import TextHeading from "../../components/textHeading.vue";

const router = useRouter();
const route = useRoute();
const fileInput = ref<HTMLInputElement | null>(null);
const dropdownContainer = ref<HTMLElement | null>(null);

interface FormData {
  username: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  tags: string[];
}

interface PasswordData {
  newPassword: string;
  confirmPassword: string;
}

const formData = ref<FormData>({
  username: "",
  name: "",
  email: "",
  phone: "",
  image: defaultProfile,
  tags: [],
});

const passwordData = ref<PasswordData>({
  newPassword: "",
  confirmPassword: "",
});

const isLoading = ref(false);
const isLoadingUser = ref(false);
const isLoadingTags = ref(false);
const tagOptions = ref<Array<{ label: string; value: string }>>([]);
const isTagsDropdownOpen = ref(false);
const selectedImageFile = ref<File | null>(null);

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

// Fetch tags from backend
const fetchTags = async () => {
  try {
    isLoadingTags.value = true;
    const tags = await userService.getTags();

    tagOptions.value = tags.map((tag: any) => ({
      label: tag.tag || tag.tag_name || tag.name || `Tag ${tag.id}`,
      value: String(tag.id),
    }));
  } catch (err: any) {
    console.error("Error fetching tags:", err);
    showToast('error', 'Error', "Failed to load tags. Please refresh the page.");
  } finally {
    isLoadingTags.value = false;
  }
};

// Extract tag IDs from user tags - handles multiple tag structures
const extractTagIds = (userTags: any[]): string[] => {
  if (!Array.isArray(userTags) || userTags.length === 0) {
    return [];
  }

  return userTags
    .map((tag) => {
      // First, try to get ID directly
      let id = tag.id || tag.tag_id || tag.pivot?.tag_id;

      // If no ID, try to match by tag string value
      if (!id && tag.tag) {
        const tagString = String(tag.tag).trim();

        // Find matching tag option by label (tag string) - exact match
        let matchingOption = tagOptions.value.find(
          (option) => option.label.trim() === tagString
        );

        // If no exact match, try case-insensitive match
        if (!matchingOption) {
          matchingOption = tagOptions.value.find(
            (option) =>
              option.label.trim().toLowerCase() === tagString.toLowerCase()
          );
        }

        if (matchingOption) {
          id = matchingOption.value;
        } else {
          console.warn(`⚠️ Could not find tag ID for tag string: "${tag.tag}"`);
        }
      }

      // If still no ID and tag is a string that might contain ID (e.g., "nonprofit_842")
      if (!id && typeof tag.tag === "string") {
        // Try to extract number from end of string (e.g., "nonprofit_842" -> "842")
        const match = tag.tag.match(/_(\d+)$/);
        if (match && match[1]) {
          // Verify this ID exists in tagOptions
          const extractedId = match[1];
          if (tagOptions.value.some((opt) => opt.value === extractedId)) {
            id = extractedId;
          }
        }
      }

      return id ? String(id) : null;
    })
    .filter((id): id is string => id !== null);
};

// Fetch user data from API
const fetchUserData = async () => {
  const userId = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id;

  if (!userId) {
    showToast('error', 'Error', "User ID is required");
    return;
  }

  try {
    isLoadingUser.value = true;

    const userData = await superAdminUsersService.getUserById(userId);

    let imageUrl = userData.image || userData.profile_image || "";

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
        } else {
          // Dev proxy handles /storage
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
          "Edit User - Invalid image URL format, using default:",
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

    const tagIds = extractTagIds(userData.tags || []);

    formData.value = {
      username: userData.username || "",
      name: userData.name || "",
      email: userData.email || "",
      phone: String(userData.phone_no || userData.phone || ""),
      image: imageUrl,
      tags: tagIds,
    };
  } catch (err: any) {
    console.error("Error fetching user data:", err);
    showToast('error', 'Error', err.response?.data?.message || "Failed to load user data. Please try again.");
  } finally {
    isLoadingUser.value = false;
  }
};

// Get tag label by value
const getTagLabel = (tagValue: string): string => {
  const option = tagOptions.value.find((opt) => opt.value === tagValue);
  return option?.label || tagValue;
};

// Toggle tags dropdown
const toggleTagsDropdown = () => {
  isTagsDropdownOpen.value = !isTagsDropdownOpen.value;
};

// Toggle tag selection
const toggleTagSelection = (option: { label: string; value: string }) => {
  const index = formData.value.tags.indexOf(option.value);
  if (index > -1) {
    formData.value.tags.splice(index, 1);
  } else {
    formData.value.tags.push(option.value);
  }
};

// Remove tag from badges
const removeTag = (tagValue: string) => {
  const index = formData.value.tags.indexOf(tagValue);
  if (index > -1) {
    formData.value.tags.splice(index, 1);
  }
};

// Handle click outside tags dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownContainer.value &&
    !dropdownContainer.value.contains(event.target as Node)
  ) {
    isTagsDropdownOpen.value = false;
  }
};

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== defaultProfile) {
    target.src = defaultProfile;
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'Validation Error', "Image size must be less than 2MB");
      // Reset file input
      if (target) {
        target.value = "";
      }
      selectedImageFile.value = null;
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast('error', 'Validation Error', "Please select a valid image file");
      // Reset file input
      if (target) {
        target.value = "";
      }
      selectedImageFile.value = null;
      return;
    }

    // Set the selected file
    selectedImageFile.value = file;

    // Update preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        formData.value.image = e.target.result as string;
      }
    };
    reader.onerror = () => {
      console.error("Error reading file for preview");
      showToast('error', 'Error', "Error reading image file");
    };
    reader.readAsDataURL(file);
  } else {
    console.warn("No file selected");
    selectedImageFile.value = null;
  }
};

const handleSubmit = async () => {
  try {
    isLoading.value = true;

    const userId = Array.isArray(route.params.id)
      ? route.params.id[0]
      : route.params.id;

    if (!userId) {
      showToast('error', 'Error', "User ID is required");
      return;
    }

    const username = formData.value.username.trim();
    const name = formData.value.name.trim();
    const email = formData.value.email.trim();
    const phone = formData.value.phone.trim();

    if (!username) {
      showToast('error', 'Validation Error', "Username is required");
      return;
    }
    if (!name) {
      showToast('error', 'Validation Error', "Name is required");
      return;
    }
    if (!email) {
      showToast('error', 'Validation Error', "Email is required");
      return;
    }
    if (!phone) {
      showToast('error', 'Validation Error', "Phone number is required");
      return;
    }
    if (formData.value.tags.length === 0) {
      showToast('error', 'Validation Error', "At least one tag is required");
      return;
    }

    const tagsAsNumbers = formData.value.tags
      .map((tag) => parseInt(tag))
      .filter((tag) => !isNaN(tag) && tag > 0);

    // Handle password fields - only include if both are filled
    const newPassword = passwordData.value.newPassword.trim();
    const confirmPassword = passwordData.value.confirmPassword.trim();

    // If password fields are filled, validate them
    if (newPassword || confirmPassword) {
      if (!newPassword) {
        showToast('error', 'Validation Error', "New password is required");
        return;
      }
      if (!confirmPassword) {
        showToast('error', 'Validation Error', "Password confirmation is required");
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('error', 'Validation Error', "Passwords do not match");
        return;
      }
      if (newPassword.length < 8) {
        showToast('error', 'Validation Error', "Password must be at least 8 characters");
        return;
      }
    }

    const imageFile = selectedImageFile.value;

    await superAdminUsersService.updateUser(userId, {
      username,
      name,
      email,
      phone_no: phone,
      profile_image: imageFile || undefined,
      tags: tagsAsNumbers,
      password: newPassword || undefined,
      password_confirmation: confirmPassword || undefined,
    });

    showToast('success', 'Success', "User updated successfully!");

    // Clear password fields after successful update
    passwordData.value.newPassword = "";
    passwordData.value.confirmPassword = "";

    setTimeout(() => {
      goBack();
    }, 2000);
  } catch (err: any) {
    console.error("=== Error updating user ===");
    console.error("Error object:", err);
    console.error("Error message:", err.message);
    console.error("Error code:", err.code);
    console.error("Error response:", err.response);
    console.error("Error response status:", err.response?.status);
    console.error("Error response statusText:", err.response?.statusText);
    console.error("Error response data:", err.response?.data);
    console.error("Error response headers:", err.response?.headers);
    console.error("Request config:", err.config);
    console.error("Request URL:", err.config?.url);
    console.error("Request method:", err.config?.method);
    console.error("Request data:", err.config?.data);

    let errorMsg = "Failed to update user. Please try again.";
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      console.error("Validation errors:", errors);
      const errorMessages = Object.values(errors).flat();
      errorMsg = `Validation failed: ${errorMessages.join(", ")}`;
    } else if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    } else if (err.message) {
      errorMsg = `Error: ${err.message}`;
    } else if (err.response?.status === 404) {
      errorMsg = "User not found. Please refresh the page and try again.";
    } else if (err.response?.status === 500) {
      errorMsg = "Server error. Please check the backend logs.";
    } else if (!err.response) {
      errorMsg = "Network error: Could not reach the server. Please check your connection.";
    } else {
      errorMsg = `Failed to update user (Status: ${err.response?.status || "Unknown"}). Please try again.`;
    }

    showToast('error', 'Error', errorMsg);
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.push({ name: "superAdmin.users" });
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  await fetchTags();
  await fetchUserData();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
