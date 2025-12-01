<template>
  <div
    class="w-full h-auto pb-10 px-4 md:px-12 md:pt-10 pt-5 flex flex-col gap-y-6"
  >
    <!-- Header Section -->
    <div class="flex flex-col gap-y-2">
      <TextHeading>{{ t("themes.title") }}</TextHeading>
      <p class="text-gray-600 text-sm md:text-base">
        {{ t("themes.description") }}
      </p>
    </div>

    <!-- Current Theme Section -->
    <div class="flex flex-col gap-y-4">
      <h2 class="text-lg font-bold">{{ t("themes.currentTheme") }}</h2>
      <div
        class="border-2 border-[#009AFF] rounded-lg p-4 md:p-6 text-white"
        :style="getCurrentThemeStyle()"
      >
        <div class="flex items-center justify-center gap-x-3">
          <p class="text-center font-semibold text-lg md:text-xl">
            {{ currentTheme }}
          </p>
        </div>
      </div>
    </div>

    <!-- Choose Theme Section -->
    <div class="flex flex-col gap-y-4">
      <h2 class="text-lg font-bold">{{ t("themes.chooseTheme") }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <!-- Facebook Theme -->
        <button
          @click="selectTheme('Facebook')"
          :disabled="isLoading"
          :class="[
            'relative rounded-lg p-4 md:p-6 text-left text-white transition-all duration-200 hover:scale-105 hover:shadow-lg',
            selectedTheme === 'Facebook'
              ? 'ring-4 ring-[#009AFF] ring-offset-2'
              : '',
            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ]"
          style="background: linear-gradient(to right, #1877f2, #42a5f5)"
        >
          <div class="flex items-center gap-x-3 md:gap-x-4 mb-2">
            <img
              src="../../assets/icons/facebook.svg"
              alt="Facebook"
              class="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full p-1.5"
            />
            <h3 class="text-lg md:text-xl font-bold">
              {{ t("themes.facebook") }}
            </h3>
          </div>
          <p class="text-sm md:text-base text-white/90">
            {{ t("themes.facebookDescription") }}
          </p>
        </button>

        <!-- LinkedIn Theme -->
        <button
          @click="selectTheme('Linkedin')"
          :disabled="isLoading"
          :class="[
            'relative rounded-lg p-4 md:p-6 text-left text-white transition-all duration-200 hover:scale-105 hover:shadow-lg',
            selectedTheme === 'Linkedin'
              ? 'ring-4 ring-[#009AFF] ring-offset-2'
              : '',
            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ]"
          style="background-color: #0a66c2"
        >
          <div class="flex items-center gap-x-3 md:gap-x-4 mb-2">
            <img
              src="../../assets/icons/linkedin.svg"
              alt="LinkedIn"
              class="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full p-1.5"
            />
            <h3 class="text-lg md:text-xl font-bold">
              {{ t("themes.linkedin") }}
            </h3>
          </div>
          <p class="text-sm md:text-base text-white/90">
            {{ t("themes.linkedinDescription") }}
          </p>
        </button>

        <!-- Graphic Designer Theme -->
        <button
          @click="selectTheme('Graphic Designer')"
          :disabled="isLoading"
          :class="[
            'relative rounded-lg p-4 md:p-6 text-left text-white transition-all duration-200 hover:scale-105 hover:shadow-lg',
            selectedTheme === 'Graphic Designer'
              ? 'ring-4 ring-[#009AFF] ring-offset-2'
              : '',
            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ]"
          style="
            background: linear-gradient(to bottom, #8b5cf6, #6366f1, #8b5cf6);
          "
        >
          <div class="flex items-center gap-x-3 md:gap-x-4 mb-2">
            <div
              class="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 md:w-6 md:h-6 text-gray-800"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold">
              {{ t("themes.graphicDesigner") }}
            </h3>
          </div>
          <p class="text-sm md:text-base text-white/90">
            {{ t("themes.graphicDesignerDescription") }}
          </p>
        </button>

        <!-- YouTube Theme -->
        <button
          @click="selectTheme('You tube')"
          :disabled="isLoading"
          :class="[
            'relative rounded-lg p-4 md:p-6 text-left text-white transition-all duration-200 hover:scale-105 hover:shadow-lg',
            selectedTheme === 'You tube'
              ? 'ring-4 ring-[#009AFF] ring-offset-2'
              : '',
            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ]"
          style="background: linear-gradient(to bottom, #ff0000, #cc0000)"
        >
          <div class="flex items-center gap-x-3 md:gap-x-4 mb-2">
            <img
              src="../../assets/icons/youtube.svg"
              alt="YouTube"
              class="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full p-1.5"
            />
            <h3 class="text-lg md:text-xl font-bold">
              {{ t("themes.youtube") }}
            </h3>
          </div>
          <p class="text-sm md:text-base text-white/90">
            {{ t("themes.youtubeDescription") }}
          </p>
        </button>
      </div>
      <p v-if="isLoading" class="text-center text-gray-600 text-sm mt-2">
        {{ t("themes.updatingTheme") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import TextHeading from "../../components/textHeading.vue";
import { useAuthStore } from "../../store/auth";
import { adminThemeService } from "../../services/admin";

const { t } = useI18n();

const authStore = useAuthStore();

// Theme mapping: Facebook = 1, LinkedIn = 2, YouTube = 3, Graphic Designer = 4
const themeNameToIdMap: Record<string, number> = {
  Facebook: 1,
  Linkedin: 2,
  "You tube": 3,
  "Graphic Designer": 4,
};

const themeIdToNameMap: Record<number, string> = {
  1: "Facebook",
  2: "Linkedin",
  3: "You tube",
  4: "Graphic Designer",
};

const currentThemeId = ref<number | null>(null);
const currentTheme = ref("");
const selectedTheme = ref<string | null>(null);
const isLoading = ref(false);

// Fetch current theme from API
const fetchCurrentTheme = async () => {
  try {
    isLoading.value = true;

    // Try to get user ID from auth store, or fetch current user
    let userId = authStore.user?.id;

    // If user ID not available, try to get it from current user endpoint
    if (!userId) {
      try {
        const currentUser = await adminThemeService.getCurrentUser();
        userId = currentUser?.id || (currentUser as any)?.data?.id;

        // Also check theme from current user response
        const themeId =
          currentUser?.theme?.theme_id ||
          (currentUser as any)?.data?.theme?.theme_id;
        if (themeId) {
          currentThemeId.value = parseInt(themeId);
          currentTheme.value =
            themeIdToNameMap[currentThemeId.value] || "Unknown";
          selectedTheme.value = currentTheme.value;
          isLoading.value = false;
          return;
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    }

    if (!userId) {
      alert(t("themes.userNotFound"));
      currentTheme.value = t("themes.notAvailable");
      return;
    }

    // Fetch user info to get theme_id
    const userData = await adminThemeService.getUserById(userId);
    const themeId = userData.theme?.theme_id;

    if (themeId) {
      currentThemeId.value = parseInt(themeId);
      const themeName = themeIdToNameMap[currentThemeId.value];
      if (themeName) {
        // Map theme name to translation key
        let themeKey = themeName.toLowerCase().replace(" ", "");
        if (themeName === "You tube") themeKey = "youtube";
        if (themeName === "Graphic Designer") themeKey = "graphicDesigner";
        currentTheme.value = t(`themes.${themeKey}`);
        selectedTheme.value = themeName;
      } else {
        currentTheme.value = t("themes.notAvailable");
      }
    } else {
      currentTheme.value = t("themes.notSet");
      currentThemeId.value = null;
    }
  } catch (err: any) {
    console.error("Error fetching current theme:", err);
    alert(t("themes.failedToLoadTheme"));
    currentTheme.value = t("themes.errorLoadingTheme");
  } finally {
    isLoading.value = false;
  }

  // Set initial loading text
  if (!currentTheme.value) {
    currentTheme.value = t("themes.loading");
  }
};

// Update theme via API
const selectTheme = async (themeName: string) => {
  try {
    isLoading.value = true;

    // Get theme ID from theme name
    const themeId = themeNameToIdMap[themeName];
    if (!themeId) {
      alert(t("themes.invalidTheme"));
      return;
    }

    // Get current user ID - try auth store first, then fetch from API
    let userId = authStore.user?.id;

    if (!userId) {
      try {
        const currentUser = await adminThemeService.getCurrentUser();
        userId = currentUser?.id || (currentUser as any)?.data?.id;
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    }

    if (!userId) {
      alert(t("themes.userNotFound"));
      return;
    }

    // Update theme via API via admin service
    const response = await adminThemeService.updateTheme(themeId);

    // Update local state
    currentThemeId.value = themeId;
    // Map theme name to translation key
    let themeKey = themeName.toLowerCase().replace(" ", "");
    if (themeName === "You tube") themeKey = "youtube";
    if (themeName === "Graphic Designer") themeKey = "graphicDesigner";
    currentTheme.value = t(`themes.${themeKey}`);
    selectedTheme.value = themeName;
    
    alert(`${t("themes.themeUpdated")} ${t(`themes.${themeKey}`)}!`);

    // Update user data in auth store if response includes user
    if (response?.data?.user) {
      authStore.user = response.data.user;
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  } catch (err: any) {
    console.error("Error updating theme:", err);

    // Parse error for user-friendly message
    let errorMsg = t("themes.failedToUpdateTheme");
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      const errorMessages = Object.values(errors).flat();
      errorMsg = `${t("themes.failedToUpdateTheme")}: ${errorMessages.join(", ")}`;
    } else if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    }
    
    alert(errorMsg);
  } finally {
    isLoading.value = false;
  }
};

// Get current theme style for display (same as SocialLinks)
const getCurrentThemeStyle = () => {
  if (!currentThemeId.value) {
    return "background: #f3f4f6; color: #6b7280;";
  }

  switch (currentThemeId.value) {
    case 1: // Facebook
      return "background: linear-gradient(to right, #1877F2, #42A5F5);";
    case 2: // LinkedIn
      return "background-color: #0A66C2;";
    case 3: // YouTube
      return "background: linear-gradient(to bottom, #FF0000, #CC0000);";
    case 4: // Graphic Designer
      return "background: linear-gradient(to bottom, #8B5CF6, #6366F1, #8B5CF6);";
    default:
      return "background: #f3f4f6; color: #6b7280;";
  }
};

// Fetch current theme when component mounts
onMounted(() => {
  fetchCurrentTheme();
});
</script>
