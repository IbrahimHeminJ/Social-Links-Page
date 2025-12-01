<template>
  <div class="w-full bg-white flex flex-col items-center justify-center px-4 pt-0 relative">
    <!-- Language Switcher - Top Right -->
    <div class="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>
    <!-- Logo and Title Row -->
    <div class="flex flex-col md:flex-row items-center justify-center">
      <img
        src="../../assets/icons/icon.svg"
        alt="logo"
        class="w-40 h-40 md:w-56 md:h-56 mb-4 md:mb-0 md:mr-8"
      />
      <div class="hidden md:block w-px h-20 bg-gray-300 mr-8"></div>
      <h2 class="text-2xl md:text-4xl text-gray-700 text-center md:text-left">
        {{ t("auth.signup") }}
      </h2>
    </div>

    <!-- Signup Form -->
    <div class="w-full max-w-7xl px-4 p">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Left Column -->
        <div class="space-y-8">
          <!-- Username Field -->
          <Text
            v-model="username"
            :label="t('auth.username')"
            :placeholder="t('auth.enterUsername')"
            type="text"
            class="mb-6"
          />

          <!-- Email Field -->
          <Text
            v-model="email"
            :label="t('auth.email')"
            :placeholder="t('auth.enterEmail')"
            type="email"
            class="mb-6"
          />

          <!-- Password Field -->
          <Text
            v-model="password"
            :label="t('auth.password')"
            :placeholder="t('auth.enterPassword')"
            type="password"
            class="mb-6"
          />
        </div>

        <!-- Middle Column -->
        <div class="">
          <!-- Name Field -->
          <Text
            v-model="name"
            :label="t('auth.name')"
            :placeholder="t('auth.enterName')"
            type="text"
            class="mb-6"
          />

          <!-- Phone Number Field -->
          <Text
            v-model="phoneNumber"
            label="Phone Number"
            placeholder="e.g. +1234567890"
            type="tel"
            class="mb-6"
          />

          <!-- Tag Field (styled & functional like superadmin/profile.vue) -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">
              {{ t("profile.tag") }}
            </label>

            <div v-if="isLoadingTags" class="text-gray-500 text-sm py-2">
              Loading tags...
            </div>

            <div v-else class="flex flex-col gap-y-4">
              <!-- Selected Tags as Badges -->
              <div v-if="selectedTags && selectedTags.length > 0" class="flex flex-wrap gap-2 mb-2">
                <span v-for="tagValue in selectedTags" :key="tagValue"
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
              <div v-else class="text-sm text-gray-500 mb-2">
                No tags selected
              </div>

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
                        'bg-blue-50': selectedTags.includes(option.value),
                      }">
                      <span class="flex-1">{{ option.label }}</span>
                      <svg v-if="selectedTags.includes(option.value)" class="w-5 h-5 text-[#009AFF]" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </Transition>
              </div>

              <p class="text-gray-600 text-xs mb-3 pt-2">
                {{ t("profile.tagDescription") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column - Profile Image -->
        <div class="space-y-6">
          <!-- Profile Image Upload -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Profile Image</label>
            <div @click="triggerFileUpload"
              class="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <div class="flex flex-col items-center">
                <div v-if="!profileImage"
                  class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div v-else class="w-16 h-16 rounded-full overflow-hidden mb-4">
                  <img :src="profileImage" alt="Profile" class="w-full h-full object-cover" />
                </div>
                <p class="text-blue-600 font-medium">
                  {{ profileImage ? "Change Image" : "Upload an Image" }}
                </p>
              </div>
            </div>
            <input ref="fileInput" type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
          </div>
        </div>
      </div>

      <!-- Signup Button -->
      <div class="mt-8 flex justify-center">
        <button @click="handleSignup"
          class="cursor-pointer bg-[#009AFF] text-white font-bold rounded-[10px] hover:bg-[#009AFF]/80 transition-colors py-3 px-4 mb-4"
          style="width: 100%; max-width: 300px">
          {{ t("common.signup") }}
        </button>
      </div>

      <!-- Login Link -->
      <div class="text-center">
        <span class="text-gray-600 text-sm">{{ t("auth.haveAccount") }} </span>
        <Hyperlink :text="t('auth.loginHere')" @click="goToLogin" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth";
import { useI18n } from "vue-i18n";
import Text from "../../components/inputs/text.vue";
import Hyperlink from "../../components/buttons/hyperlink.vue";
import LanguageSwitcher from "../../components/LanguageSwitcher.vue";
import { userService } from "../../services/user";
import { useToast } from "../../composables/useToast";

const { t } = useI18n();

const username = ref("");
const email = ref("");
const password = ref("");
const name = ref("");
const phoneNumber = ref("");
const selectedTags = ref<string[]>([]);
const profileImage = ref("");
const profileImageFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const dropdownContainer = ref<HTMLElement | null>(null);
const isTagsDropdownOpen = ref(false);
const isLoadingTags = ref(false);
const tagOptions = ref<Array<{ label: string; value: string }>>([]);

const router = useRouter();
const authStore = useAuthStore();
const { showToast } = useToast();

// Fetch tags from backend (same style as profile.vue)
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
  } finally {
    isLoadingTags.value = false;
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
  const index = selectedTags.value.indexOf(option.value);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(option.value);
  }
};

// Remove tag from badges
const removeTag = (tagValue: string) => {
  const index = selectedTags.value.indexOf(tagValue);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
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

const goToLogin = () => {
  router.push({ name: "login" });
};

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    // Store the file object for upload
    profileImageFile.value = file;
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleSignup = async () => {
  // Clear any previous errors
  authStore.clearError();

  // Trim whitespace from all fields
  const trimmedUsername = username.value.trim();
  const trimmedEmail = email.value.trim();
  const trimmedPassword = password.value.trim();
  const trimmedName = name.value.trim();

  // Validate required fields
  if (
    !trimmedUsername ||
    !trimmedEmail ||
    !trimmedPassword ||
    !trimmedName ||
    !phoneNumber.value?.trim()
  ) {
    showToast({
      type: "error",
      title: "Validation Error",
      message:
        "Please fill in all required fields (username, email, password, name, phone number)",
    });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    showToast({
      type: "error",
      title: "Invalid Email",
      message: "Please enter a valid email address",
    });
    return;
  }

  // Validate password length (>= 8 characters)
  if (trimmedPassword.length < 8) {
    showToast({
      type: "error",
      title: "Weak Password",
      message: "Password must be at least 8 characters long",
    });
    return;
  }

  // Convert selected tag IDs (strings) to number array
  let tagIds: number[] | undefined = undefined;
  if (selectedTags.value.length > 0) {
    const parsed = selectedTags.value
      .map((tag) => parseInt(tag))
      .filter((tag) => !isNaN(tag) && tag > 0);

    if (parsed.length > 0) {
      tagIds = parsed;
    }
  }

  // Call signup action with FormData
  const result = await authStore.signup({
    username: trimmedUsername,
    email: trimmedEmail,
    password: trimmedPassword,
    name: trimmedName,
    phone_no: phoneNumber.value.trim(),
    profile_image: profileImageFile.value || undefined,
    tags: tagIds, // Send array of tag IDs (integers)
  });

  if (result.success) {
    // Signup successful, show success message
    showToast({
      type: "success",
      title: "Registration Successful",
      message: "Your account has been created successfully! Welcome aboard!",
    });
    // Redirect to home after showing success message
    setTimeout(() => {
      router.push({ name: "home" });
    }, 500);
  } else {
    // Signup failed, show error
    showToast({
      type: "error",
      title: "Signup Failed",
      message: result.error || "Signup failed",
    });
  }
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  await fetchTags();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
