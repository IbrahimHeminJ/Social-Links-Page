<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import defaultProfile from "../../assets/images/4.jpg";
import Text from "../../components/inputs/text.vue";
import TextHeading from "../../components/textHeading.vue";
import Submit from "../../components/buttons/submit.vue";
import AuthService from "../../services/authService";
import { adminProfileService } from "../../services/admin";
import { userService } from "../../services/user";
import { useToast } from "../../composables/useToast";

const { t } = useI18n();
const { showToast } = useToast();

const user = ref(AuthService.getStoredUser());

// Tag dropdown state (similar to superadmin profile)
const tagOptions = ref<Array<{ label: string; value: string }>>([]);
const isTagsDropdownOpen = ref(false);
const dropdownContainer = ref<HTMLElement | null>(null);

// Get initial tag IDs from stored user (supports multiple tags)
const getUserTagIds = (): string[] => {
  if (!user.value) return [];
  const userTags = (user.value as any).tags;
  if (!Array.isArray(userTags)) return [];
  return userTags
    .map((tag) => (tag && tag.id ? String(tag.id) : null))
    .filter((id): id is string => id !== null);
};

const profileData = reactive({
  username: user.value?.username || "",
  name: user.value?.name || "",
  email: user.value?.email || "",
  phoneNumber: (user.value as any)?.phone_no || "",
  // Store tag IDs as strings, similar to superadmin profile
  tags: getUserTagIds() as string[],
});

// Use profile_image from user data (same as explore and social links pages)
// If no profile_image, fallback to default
const profileImage = ref((user.value as any)?.profile_image || defaultProfile);
const selectedImageFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const isLoading = ref(false);

// Fetch tags from backend (reuse userService like superadmin profile)
const isLoadingTags = ref(false);

const fetchTags = async () => {
  try {
    isLoadingTags.value = true;
    const tags = await userService.getTags();
    tagOptions.value = tags.map((tag: any) => ({
      label: tag.tag || tag.tag_name || tag.name || `Tag ${tag.id}`,
      value: String(tag.id),
    }));
  } catch (err) {
    console.error("Error fetching tags:", err);
    showToast({
      type: "error",
      message: t("profile.failedToLoadTags") || "Failed to load tags. Please refresh the page.",
    });
  } finally {
    isLoadingTags.value = false;
  }
};

// Extract tag IDs from user tags - handles multiple tag structures (similar to superadmin profile)
const extractTagIds = (userTags: any[]): string[] => {
  if (!Array.isArray(userTags) || userTags.length === 0) {
    return [];
  }

  return userTags
    .map((tag) => {
      // First, try to get ID directly
      let id = tag.id || tag.tag_id || tag.pivot?.tag_id;

      // If no ID, try to match by tag string value against loaded tag options
      if (!id && tag.tag && tagOptions.value.length > 0) {
        const tagString = String(tag.tag).trim();

        let matchingOption = tagOptions.value.find(
          (option) => option.label.trim() === tagString
        );

        if (!matchingOption) {
          matchingOption = tagOptions.value.find(
            (option) =>
              option.label.trim().toLowerCase() === tagString.toLowerCase()
          );
        }

        if (matchingOption) {
          id = matchingOption.value;
        }
      }

      return id ? String(id) : null;
    })
    .filter((id): id is string => id !== null);
};

// Fetch current user from API to keep profile & tags in sync with backend
const fetchUserData = async () => {
  try {
    // Use auth service to get current user from backend
    const rawUserData = await AuthService.getCurrentUser();
    const userData = rawUserData?.data || rawUserData;

    if (!userData) return;

    // Update reactive user ref and localStorage snapshot
    user.value = userData;
    localStorage.setItem("user", JSON.stringify(userData));

    // Extract tags from user and map to IDs
    const tagIds = extractTagIds(userData.tags || []);

    profileData.username = userData.username || "";
    profileData.name = userData.name || "";
    profileData.email = userData.email || "";
    profileData.phoneNumber = userData.phone_no || userData.phone || "";
    profileData.tags = tagIds;

    // Update profile image
    if (userData.profile_image) {
      profileImage.value = userData.profile_image;
    }
  } catch (err) {
    console.error("Error fetching admin profile user data:", err);
    // Keep using stored user as fallback; no UI error needed here
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
  const index = profileData.tags.indexOf(option.value);
  if (index > -1) {
    profileData.tags.splice(index, 1);
  } else {
    profileData.tags.push(option.value);
  }
};

// Remove tag from badges
const removeTag = (tagValue: string) => {
  const index = profileData.tags.indexOf(tagValue);
  if (index > -1) {
    profileData.tags.splice(index, 1);
  }
};

const handleEditClick = () => {
  fileInput.value?.click();
};

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    selectedImageFile.value = null;
    profileImage.value = (user.value as any)?.profile_image || defaultProfile;
    return;
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    showToast({
      type: "error",
      message: t("profile.invalidImageFile"),
    });
    selectedImageFile.value = null;
    profileImage.value = (user.value as any)?.profile_image || defaultProfile;
    return;
  }

  // Validate file size (2MB = 2 * 1024 * 1024 bytes)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    showToast({
      type: "error",
      message: `${t("profile.imageTooLarge")} ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`,
    });
    selectedImageFile.value = null;
    profileImage.value = (user.value as any)?.profile_image || defaultProfile;
    return;
  }

  // File is valid, store it and create preview
  selectedImageFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    profileImage.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const handleSave = async () => {
  isLoading.value = true;

  // Convert selected tag IDs (strings) to numbers
  const tagIds: number[] = (profileData.tags || [])
    .map((tagId) => parseInt(tagId, 10))
    .filter((id) => !isNaN(id) && id > 0);

  const formData = new FormData();
  formData.append("name", profileData.name);
  formData.append("username", profileData.username);
  formData.append("email", profileData.email);
  formData.append("phone_no", profileData.phoneNumber);

  // Send tags as array of IDs (Laravel expects array indices starting from 1)
  tagIds.forEach((tagId, index) => {
    formData.append(`tags[${index + 1}]`, String(tagId));
  });

  // Add profile image if a new one was selected
  if (selectedImageFile.value) {
    // Validate file again before sending
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (selectedImageFile.value.size > maxSize) {
      showToast({
        type: "error",
        message: t("profile.imageTooLarge"),
      });
      isLoading.value = false;
      return;
    }

    if (!selectedImageFile.value.type.startsWith("image/")) {
      showToast({
        type: "error",
        message: t("profile.invalidImageFile"),
      });
      isLoading.value = false;
      return;
    }

    formData.append("profile_image", selectedImageFile.value);
  }

  try {
    const data = await adminProfileService.updateProfile(formData);

    // Normalize possible response shapes (similar to superadmin profile)
    let updatedUser: any = null;
    let updatedUserData: any = null;

    if (data?.data?.user) {
      updatedUser = data.data.user;
      updatedUserData = updatedUser.data || updatedUser;
    } else if (data?.data?.data) {
      updatedUser = data.data;
      updatedUserData = updatedUser.data || updatedUser;
    } else if (data?.data) {
      updatedUser = data.data;
      updatedUserData = updatedUser.data || updatedUser;
    } else if (data?.user) {
      updatedUser = data.user;
      updatedUserData = updatedUser.data || updatedUser;
    } else if (data) {
      updatedUser = data;
      updatedUserData = updatedUser.data || updatedUser;
    }

    if (updatedUserData) {
      // Persist user in localStorage
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

      // Update local user ref
      user.value = userForStorage as any;

      // Update profile image
      if (userForStorage.profile_image) {
        profileImage.value = userForStorage.profile_image;
      }

      // Refresh tags from updated user data
      const tagIds = extractTagIds(updatedUserData.tags || []);
      profileData.username = updatedUserData.username || profileData.username;
      profileData.name = updatedUserData.name || profileData.name;
      profileData.email = updatedUserData.email || profileData.email;
      profileData.phoneNumber =
        updatedUserData.phone_no ||
        updatedUserData.phone ||
        profileData.phoneNumber;
      profileData.tags = tagIds;

      showToast({
        type: "success",
        message: t("profile.profileSaved"),
      });
    } else {
      console.warn(
        "Admin profile: Could not extract user data from update response",
        data
      );
      showToast({
        type: "error",
        message: "Profile update completed, but some information may not have been saved. Please refresh the page.",
      });
    }
  } catch (error: any) {
    // Parse error for user-friendly message
    let userFriendlyError = t("profile.failedToSaveProfile") + " ";

    // Check for validation errors (Laravel format)
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const fieldErrors: string[] = [];

      // Map field names to user-friendly labels
      const fieldLabels: Record<string, string> = {
        name: "Name",
        username: "Username",
        email: "Email",
        phone_no: "Phone Number",
        tags: "Tag",
        profile_image: "Profile Image",
      };

      // Collect all field errors
      Object.keys(errors).forEach((field) => {
        const fieldLabel = fieldLabels[field] || field;
        const fieldError = Array.isArray(errors[field])
          ? errors[field][0]
          : errors[field];
        fieldErrors.push(`${fieldLabel}: ${fieldError}`);
      });

      if (fieldErrors.length > 0) {
        userFriendlyError += fieldErrors.join("\n");
      } else {
        userFriendlyError += "Please check all fields and try again.";
      }
    } else if (error.response?.data?.message) {
      // Use API error message if available
      userFriendlyError += error.response.data.message;
    } else if (error.response?.status === 422) {
      userFriendlyError +=
        "Please check all fields and make sure they are filled correctly.";
    } else if (error.response?.status === 401) {
      userFriendlyError += "You are not authorized. Please log in again.";
    } else if (error.response?.status === 500) {
      userFriendlyError += "Server error. Please try again later.";
    } else {
      userFriendlyError +=
        "Please try again. If the problem persists, contact support.";
    }

    showToast({
      type: "error",
      message: userFriendlyError,
    });
  } finally {
    isLoading.value = false;
  }
};

// Initial load: tags list + fresh user data (for tags & profile)
onMounted(async () => {
  await fetchTags();
  await fetchUserData();
});
</script>

<template>
  <form
    action=""
    class="flex flex-col justify-between space-y-5 pb-10 xl:mt-10"
  >
    <div class="p-8 flex max-xl:flex-col justify-between max-lg:gap-y-8">
      <div class="flex max-xl:flex-col justify-between xl:gap-2 xl:w-1/3">
        <TextHeading>{{ t("profile.title") }}</TextHeading>
        <div class="mt-4 w-full h-2/3 flex justify-center items-end">
          <div class="relative">
            <img
              :src="profileImage"
              alt="Profile image"
              class="xl:size-60 lg:size-52 md:size-48 size-44 rounded-full object-cover"
            />
            <button
              type="button"
              @click="handleEditClick"
              class="absolute xl:bottom-1 lg:-bottom-1 -bottom-2 right-0 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src="../../assets/icons/edit.svg"
                alt="Edit Icon"
                class="w-6 h-6"
              />
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageChange"
              class="hidden"
            />
          </div>
        </div>
      </div>
      <div class="xl:w-3/5 md:w-4/5 h-full space-y-4">
        <Text
          v-model="profileData.username"
          :label="t('profile.username')"
          :placeholder="t('profile.enterUsername')"
          type="text"
        />
        <Text
          v-model="profileData.name"
          :label="t('profile.name')"
          :placeholder="t('profile.enterName')"
          type="text"
        />
        <Text
          v-model="profileData.email"
          :label="t('profile.email')"
          :placeholder="t('profile.enterEmail')"
          type="email"
        />
        <Text
          v-model="profileData.phoneNumber"
          :label="t('profile.phoneNumber')"
          :placeholder="t('profile.enterPhoneNumber')"
          type="tel"
        />

        <!-- Tag Field (multi-select, similar to superadmin profile) -->
        <div class="flex flex-col gap-y-3" ref="dropdownContainer">
          <label class="block text-gray-700 text-sm font-medium">
            {{ t("profile.tag") }}
          </label>

          <!-- Selected Tags as Badges -->
          <div
            v-if="profileData.tags && profileData.tags.length > 0"
            class="flex flex-wrap gap-2"
          >
            <span
              v-for="tagValue in profileData.tags"
              :key="tagValue"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
            >
              <span>{{ getTagLabel(tagValue) }}</span>
              <button
                type="button"
                @click="removeTag(tagValue)"
                class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 transition-colors focus:outline-none"
                :title="t('profile.removeTag') || 'Remove tag'"
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
          <div v-else class="text-xs text-gray-500">
            {{ t("profile.noTagsSelected") || "No tags selected" }}
          </div>

          <!-- Tags Dropdown -->
          <div class="relative">
            <button
              type="button"
              @click="toggleTagsDropdown"
              class="caret-[#009AFF] w-full px-4 h-[48px] rounded-[10px] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors border-[#009AFF] border-b-2 focus:border-none flex items-center justify-between cursor-pointer"
              :class="{ 'rounded-b-none': isTagsDropdownOpen }"
            >
              <span class="text-gray-400">
                {{ t("profile.selectTags") || "Select tags" }}
              </span>
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
                  <span class="flex-1 text-sm md:text-base">
                    {{ option.label }}
                  </span>
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

          <p class="text-gray-600 text-xs mb-3 pt-1">
            {{ t("profile.tagDescription") }}
          </p>
        </div>
      </div>
    </div>

    <div class="w-[150px] mx-auto">
      <Submit
        :text="t('profile.saveChanges')"
        @click="handleSave"
        :disabled="isLoading"
      />
      <p v-if="isLoading" class="text-center text-gray-600 text-sm mt-2">
        {{ t("profile.saving") }}
      </p>
    </div>
  </form>
</template>
