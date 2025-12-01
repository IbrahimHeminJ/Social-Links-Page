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
            @error="handleImageError"
          />
          <button
            @click="triggerFileUpload"
            class="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
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
        <div v-if="isLoadingUser" class="text-center py-8">
          <p class="text-gray-600">Loading profile data...</p>
        </div>

        <div v-else class="space-y-6">
          <!-- Username -->
          <Text
            v-model="profileData.username"
            label="username"
            type="text"
            placeholder="Enter username"
          />

          <!-- Name -->
          <Text
            v-model="profileData.name"
            label="Name"
            type="text"
            placeholder="Enter name"
          />

          <!-- Email -->
          <Text
            v-model="profileData.email"
            label="Email"
            type="email"
            placeholder="Enter email"
          />

          <!-- Phone No -->

          <Text
            v-model="profileData.phone"
            label="Phone No"
            type="tel"
            placeholder="Enter phone number"
          />

          <!-- Tags (Multiple Selection) -->
          <div v-if="isLoadingTags" class="text-gray-500 text-sm py-2">
            Loading tags...
          </div>
          <div v-else class="flex flex-col gap-y-4">
            <label>
              <TextHeading>Tags</TextHeading>
            </label>
            <p class="text-xs text-gray-600 mb-3">
              Your tags describe your specialty or major or hobbies that you are
              currently working on and you are using our services to display
              your social links
            </p>

            <!-- Selected Tags as Badges -->
            <div
              v-if="profileData.tags && profileData.tags.length > 0"
              class="flex flex-wrap gap-2 mb-2"
            >
              <span
                v-for="tagValue in profileData.tags"
                :key="tagValue"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
              >
                <span>{{ getTagLabel(tagValue) }}</span>
                <button
                  type="button"
                  @click="removeTag(tagValue)"
                  class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 transition-colors focus:outline-none"
                  title="Remove tag"
                >
                  <svg
                    class="w-3 h-3 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div v-else class="text-sm text-gray-500 mb-2">
              No tags selected
            </div>

            <!-- Tags Dropdown -->
            <div class="relative" ref="dropdownContainer">
              <button
                type="button"
                @click="toggleTagsDropdown"
                class="caret-[#009AFF] w-full px-4 h-[48px] rounded-[10px] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors border-[#009AFF] border-b-2 focus:border-none flex items-center justify-between cursor-pointer"
                :class="{ 'rounded-b-none': isTagsDropdownOpen }"
              >
                <span class="text-gray-400">Select tags</span>
                <svg
                  class="w-5 h-5 text-gray-500 transition-transform"
                  :class="{ 'transform rotate-180': isTagsDropdownOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isTagsDropdownOpen"
                  class="absolute z-50 w-full mt-1 bg-white border border-gray-300 border-t-0 rounded-b-[10px] shadow-lg max-h-64 overflow-auto"
                  style="border-top: none"
                >
                  <button
                    v-for="option in tagOptions"
                    :key="option.value"
                    type="button"
                    @click="toggleTagSelection(option)"
                    class="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors cursor-pointer text-left"
                    :class="{
                      'bg-blue-50': profileData.tags.includes(option.value),
                    }"
                  >
                    <span class="flex-1">{{ option.label }}</span>
                    <svg
                      v-if="profileData.tags.includes(option.value)"
                      class="w-5 h-5 text-[#009AFF]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Save Changes Button -->
        <div class="mt-8 flex justify-center">
          <button
            @click="handleSave"
            :disabled="isLoading"
            class="px-8 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? "Saving..." : "Save changes" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import Text from "../../components/inputs/text.vue";
import TextHeading from "../../components/textHeading.vue";
import authService from "../../services/authService";
import { userService } from "../../services/user";
import api from "../../services/api";
import defaultProfile from "../../assets/images/man.png";

const fileInput = ref<HTMLInputElement | null>(null);
const dropdownContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const isLoadingUser = ref(false);
const isLoadingTags = ref(false);
const selectedImageFile = ref<File | null>(null);
const tagOptions = ref<Array<{ label: string; value: string }>>([]);
const isTagsDropdownOpen = ref(false);

interface ProfileData {
  username: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  image: string;
}

const profileData = ref<ProfileData>({
  username: "",
  name: "",
  email: "",
  phone: "",
  tags: [],
  image: defaultProfile,
});

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
    alert("Failed to load tags. Please refresh the page.");
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
  const index = profileData.value.tags.indexOf(option.value);
  if (index > -1) {
    profileData.value.tags.splice(index, 1);
  } else {
    profileData.value.tags.push(option.value);
  }
};

// Remove tag from badges
const removeTag = (tagValue: string) => {
  const index = profileData.value.tags.indexOf(tagValue);
  if (index > -1) {
    profileData.value.tags.splice(index, 1);
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

// Fetch current user data from API
const fetchUserData = async () => {
  try {
    isLoadingUser.value = true;

    const rawUserData = await authService.getCurrentUser();

    // Handle nested structure: { id, data: { username, name, email, ... } }
    // Similar to how UserResource returns data
    const userData = rawUserData?.data || rawUserData;
    const userId = rawUserData?.id || userData?.id;

    // Handle image URL - similar to users.vue
    let imageUrl = userData.profile_image || userData.image || "";

    if (imageUrl && imageUrl.trim() !== "") {
      imageUrl = imageUrl.trim();

      // If it's already a full URL (http/https), use it as is
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        // Already full URL
      }
      // If it's a relative path starting with /storage
      else if (imageUrl.startsWith("/storage") || imageUrl.startsWith("/")) {
        if (import.meta.env.PROD) {
          const apiBaseUrl =
            import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
          const backendBase = apiBaseUrl.replace("/api", "");
          if (!imageUrl.startsWith("http")) {
            imageUrl = `${backendBase}${imageUrl}`;
          }
        } else {
          // Dev proxy will handle /storage
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
          "Profile - Invalid image URL format, using default:",
          imageUrl
        );
        imageUrl = defaultProfile;
      }
    } else {
      imageUrl = defaultProfile;
    }

    // Extract tags - handle different tag structures
    const tagIds = extractTagIds(userData.tags || []);

    profileData.value = {
      username: userData.username || "",
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone_no || userData.phone || "",
      tags: tagIds,
      image: imageUrl,
    };
  } catch (err: any) {
    console.error("=== Error fetching user data ===");
    console.error("Error object:", err);
    console.error("Error message:", err.message);
    console.error("Error response:", err.response);
    console.error("Error response status:", err.response?.status);
    console.error("Error response data:", err.response?.data);
    alert(err.response?.data?.message || "Failed to load profile data. Please try again.");
  } finally {
    isLoadingUser.value = false;
  }
};

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      if (target) {
        target.value = "";
      }
      selectedImageFile.value = null;
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
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
        profileData.value.image = e.target.result as string;
      }
    };
    reader.onerror = () => {
      console.error("Error reading file for preview");
      alert("Error reading image file");
    };
    reader.readAsDataURL(file);
  } else {
    selectedImageFile.value = null;
  }
};

const handleSave = async () => {
  try {
    isLoading.value = true;

    // Validate required fields
    if (!profileData.value.username.trim()) {
      alert("Username is required");
      return;
    }
    if (!profileData.value.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!profileData.value.email.trim()) {
      alert("Email is required");
      return;
    }
    if (!profileData.value.phone.trim()) {
      alert("Phone number is required");
      return;
    }

    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append("name", profileData.value.name.trim());
    formData.append("username", profileData.value.username.trim());
    formData.append("email", profileData.value.email.trim());
    formData.append("phone_no", profileData.value.phone.trim());

    // Handle tags - send as array of tag IDs
    const tagsAsNumbers = profileData.value.tags
      .map((tag) => parseInt(tag))
      .filter((tag) => !isNaN(tag) && tag > 0);

    // Send tags as array - Laravel expects array indices starting from 1
    tagsAsNumbers.forEach((tagId, index) => {
      formData.append(`tags[${index + 1}]`, String(tagId));
    });

    // If no tags, send empty array
    if (tagsAsNumbers.length === 0) {
      formData.append("tags[]", "");
    }

    // Add profile image if a new one was selected
    if (selectedImageFile.value) {
      formData.append("profile_image", selectedImageFile.value);
    }

    const { data } = await api.post("/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Handle multiple possible response structures
    // Structure 1: { data: { user: {...} } }
    // Structure 2: { data: { data: { id, data: {...} } } } (UserResource format)
    // Structure 3: { data: { id, data: {...} } } (UserResource format)
    // Structure 4: { user: {...} }
    // Structure 5: { data: {...} } (user data directly)

    let updatedUser = null;
    let updatedUserData = null;

    // Try different response structures
    if (data?.data?.user) {
      updatedUser = data.data.user;
      updatedUserData = updatedUser.data || updatedUser;
    } else if (data?.data?.data) {
      // UserResource format: { id, data: {...} }
      updatedUser = data.data;
      updatedUserData = updatedUser.data || updatedUser;
    } else if (data?.data) {
      // User data directly in data
      updatedUser = data.data;
      updatedUserData = updatedUser.data || updatedUser;
    } else if (data?.user) {
      updatedUser = data.user;
      updatedUserData = updatedUser.data || updatedUser;
    } else if (data) {
      // Data is the user object itself
      updatedUser = data;
      updatedUserData = updatedUser.data || updatedUser;
    }

    if (updatedUserData) {
      // Update local storage with the user data
      const userForStorage = {
        id: updatedUser?.id || updatedUserData.id,
        username: updatedUserData.username,
        name: updatedUserData.name,
        email: updatedUserData.email,
        phone_no: updatedUserData.phone_no || updatedUserData.phone,
        profile_image: updatedUserData.profile_image || updatedUserData.image,
        role: updatedUserData.role,
        tags: updatedUserData.tags || [],
      };
      localStorage.setItem("user", JSON.stringify(userForStorage));

      // Update profile image if it was updated
      const updatedImageUrl =
        updatedUserData.profile_image || updatedUserData.image;
      if (updatedImageUrl) {
        let processedImageUrl = updatedImageUrl;

        // Process the image URL similar to fetchUserData
        if (
          processedImageUrl.startsWith("http://") ||
          processedImageUrl.startsWith("https://")
        ) {
          profileData.value.image = processedImageUrl;
        } else if (
          processedImageUrl.startsWith("/storage") ||
          processedImageUrl.startsWith("/")
        ) {
          if (import.meta.env.PROD) {
            const apiBaseUrl =
              import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
            const backendBase = apiBaseUrl.replace("/api", "");
            profileData.value.image = `${backendBase}${processedImageUrl}`;
          } else {
            profileData.value.image = processedImageUrl;
          }
        } else {
          profileData.value.image = processedImageUrl;
        }
      }

      // Refresh the profile data from the updated user data
      const tagIds = extractTagIds(updatedUserData.tags || []);
      profileData.value.username =
        updatedUserData.username || profileData.value.username;
      profileData.value.name = updatedUserData.name || profileData.value.name;
      profileData.value.email =
        updatedUserData.email || profileData.value.email;
      profileData.value.phone =
        updatedUserData.phone_no ||
        updatedUserData.phone ||
        profileData.value.phone;
      profileData.value.tags = tagIds;

      alert("Profile updated successfully!");

      // Clear selected file
      selectedImageFile.value = null;
    } else {
      console.warn("Could not extract user data from response");
      console.warn("Response structure:", JSON.stringify(data, null, 2));
      alert("Profile update completed, but some information may not have been saved. Please refresh the page.");
    }
  } catch (err: any) {
    console.error("Error updating profile:", err);
    let errorMsg = "Failed to update profile. Please try again.";
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      const errorMessages = Object.values(errors).flat();
      errorMsg = `Validation failed: ${errorMessages.join(", ")}`;
    } else if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    }
    
    alert(errorMsg);
  } finally {
    isLoading.value = false;
  }
};

// Handle image loading errors
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== defaultProfile) {
    target.src = defaultProfile;
  }
};

// Fetch user data when component mounts
onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  await fetchTags();
  await fetchUserData();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
