<template>
  <Transition name="fade" v-show="showAlert">
    <Alert
      :item="selectedItem"
      @confirm="handleConfirmDelete"
      @close="handleCloseAlert"
    />
  </Transition>
  <div
    class="w-full h-auto pb-10 px-12 md:pt-10 pt-5 flex flex-col gap-y-4"
    v-if="addNewLink"
  >
    <div class="w-full flex flex-col gap-y-4">
      <div class="flex items-center justify-between mb-2">
        <TextHeading>{{ t("links.title") }}</TextHeading>
        <button
          @click.prevent="viewSocialLinksPage"
          type="button"
          class="px-4 py-2 bg-[#009AFF] text-white rounded-lg hover:bg-[#0088e6] transition-colors text-sm font-medium flex items-center gap-x-2"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {{ t("links.viewMySocialLinksPage") }}
        </button>
      </div>
      <div class="w-full flex flex-col gap-y-4" @click="handleAddNewLink">
        <div
          class="hover:cursor-pointer h-[91px] w-full bg-[#F5F5F5] flex justify-center items-center gap-x-4 border-2 border-[#009AFF] rounded-[10px] border-dashed"
        >
          <img
            src="../../assets/icons/plus.svg"
            alt="plus"
            class="size-[21px]"
          />
          <TextHeading>{{ t("links.addNewLink") }}</TextHeading>
        </div>
      </div>
      <div class="flex flex-col gap-y-4">
        <div class="flex flex-col gap-y-4">
          <div v-if="isLoadingLinks" class="text-center text-gray-400 py-8">
            {{ t("links.loadingLinks") }}
          </div>
          <div
            v-else-if="linkItems.length === 0"
            class="text-center text-gray-400 py-8"
          >
            {{ t("links.noLinksYet") }}
          </div>
          <template v-else>
            <div
              v-for="(link, index) in linkItems"
              :key="link.id || index"
              @click="() => handleEditLink(link)"
              class="cursor-pointer"
            >
              <Card
                :icon="link.platform || ''"
                :title="link.title || 'No title'"
                :handleDelete="() => handleDeleteLink(index)"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div
    class="w-full h-auto pb-10 px-12 md:pt-10 pt-5 flex flex-col gap-y-6"
    v-else
  >
    <div class="flex flex-col gap-y-4">
      <div class="flex items-center justify-between">
        <TextHeading>{{
          editingLinkId ? t("links.editLink") : t("links.addNewLink")
        }}</TextHeading>
        <button
          class="text-[#009AFF] cursor-pointer text-sm font-medium"
          @click="handleBack"
        >
          {{ t("links.back") }}
        </button>
      </div>
      <p class="text-justify">
        {{ t("links.formDescription") }}
        <span class="text-[#009AFF]">{{ t("links.communityGuideline") }}</span
        >, {{ t("links.andByUsing") }}
        <span class="text-[#009AFF]">{{ t("links.terms") }}</span>
        {{ t("common.and") }}
        <span class="text-[#009AFF]">{{ t("links.policies") }}</span
        >.
      </p>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-y-7">
        <Input
          :label="t('links.titleLabel')"
          type="text"
          :placeholder="t('links.titlePlaceholder')"
          v-model="formData.title"
        />
        <Input
          :label="t('links.descriptionLabel')"
          type="text"
          :placeholder="t('links.descriptionPlaceholder')"
          v-model="formData.description"
        />
        <Input
          :label="t('links.linkLabel')"
          type="text"
          :placeholder="t('links.linkPlaceholder')"
          v-model="formData.link"
        />
        <Select
          :label="t('links.platformLabel')"
          :options="platforms"
          :placeholder="t('links.platformPlaceholder')"
          v-model="formData.platform"
        />
        <Submit />
        <p v-if="isLoading" class="text-center text-gray-600 text-sm">
          {{ t("links.savingLink") }}
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import TextHeading from "../../components/textHeading.vue";
import Card from "../../components/card.vue";
import Input from "../../components/inputs/text.vue";
import Select from "../../components/inputs/select.vue";
import Alert from "../../components/alerts/alert.vue";
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Submit from "../../components/buttons/submit.vue";
import { useAuthStore } from "../../store/auth";
import { adminLinksService } from "../../services/admin";

const { t } = useI18n();

interface LinkItem {
  id?: number;
  title: string;
  description: string;
  link: string;
  platform: string;
}

const authStore = useAuthStore();
const router = useRouter();

const platforms = ref([
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
  { label: "GitHub", value: "github" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Twitter", value: "twitter" },
  { label: "YouTube", value: "youtube" },
]);

const addNewLink = ref(true);
const editingLinkId = ref<number | null>(null);

const showAlert = ref(false);
const isLoading = ref(false);
const isLoadingLinks = ref(false);

const formData = reactive({
  title: "",
  description: "",
  link: "",
  platform: "",
});

const linkItems = ref<LinkItem[]>([]);

const selectedIndex = ref<number | null>(null);
const selectedItem = computed<LinkItem | null>(() => {
  if (selectedIndex.value === null) return null;
  return linkItems.value[selectedIndex.value] ?? null;
});

// Fetch user's links from API (same structure as SocialLinks.vue)
const fetchLinks = async () => {
  try {
    isLoadingLinks.value = true;

    // Get user ID from auth store
    let userId = authStore.user?.id;

    // If user ID not available, try to get it from current user endpoint
    if (!userId) {
      try {
        const currentUser = await adminLinksService.getCurrentUser();
        userId = currentUser?.id || (currentUser as any)?.data?.id;
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    }

    if (!userId) {
      alert(t("themes.userNotFound"));
      linkItems.value = [];
      return;
    }

    // Use same endpoint as SocialLinks: /user/{id}/button-links
    const linksData = await adminLinksService.getUserButtonLinks(userId);

    if (linksData.length > 0) {
      // Map buttons from relationship.button_link (same structure as SocialLinks)
      // Sort by order field
      const sortedLinks = [...linksData].sort(
        (a: any, b: any) => (a.order || 0) - (b.order || 0)
      );

      // Map to local LinkItem structure
      linkItems.value = sortedLinks
        .filter((item: any) => item.relationship?.button_link?.is_visible === 1) // Only show visible buttons
        .map((item: any) => {
          const buttonLink = item.relationship.button_link || {};
          return {
            id: buttonLink.id || item.id,
            title: buttonLink.title || "",
            description: buttonLink.description || "",
            link: buttonLink.link || "",
            platform: buttonLink.icon || "", // Map 'icon' from API to 'platform' for local use
          };
        });
    } else {
      linkItems.value = [];
    }
  } catch (err: any) {
    console.error("Error fetching links:", err);

    // Parse error for user-friendly message
    const errorMsg = err.response?.data?.message
      ? `${t("links.failedToLoadLinks")}: ${err.response.data.message}`
      : t("links.failedToLoadLinks");
    
    alert(errorMsg);

    // Clear links on error
    linkItems.value = [];
  } finally {
    isLoadingLinks.value = false;
  }
};

function handleAddNewLink() {
  editingLinkId.value = null;
  // Clear form
  formData.title = "";
  formData.description = "";
  formData.link = "";
  formData.platform = "";
  addNewLink.value = false;
}

function handleBack() {
  editingLinkId.value = null;
  // Clear form
  formData.title = "";
  formData.description = "";
  formData.link = "";
  formData.platform = "";
  addNewLink.value = true;
}

// Handle edit link - use existing link data to fill form
const handleEditLink = async (link: LinkItem) => {
  if (!link.id) {
    alert("Cannot edit link: Missing link ID.");
    return;
  }

  try {

    // Pre-fill form with link data directly from the link object
    formData.title = link.title || "";
    formData.description = link.description || "";
    formData.link = link.link || "";
    formData.platform = link.platform || ""; // Use platform directly

    // Set editing mode
    editingLinkId.value = link.id;

    // Open form
    addNewLink.value = false;
  } catch (err: any) {
    console.error("Error setting up edit form:", err);
    alert("Failed to open edit form. Please try again.");
  }
};

// Navigate to social links page with current user's ID
const viewSocialLinksPage = async () => {
  try {
    // Get user ID from auth store
    let userId = authStore.user?.id;

    // If user ID not available, try to get it from current user endpoint
    if (!userId) {
      try {
        const currentUser = await adminLinksService.getCurrentUser();
        userId = currentUser?.id || (currentUser as any)?.data?.id;
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    }

    if (!userId) {
      alert(t("themes.userNotFound"));
      console.error("No user ID found");
      return;
    }
    // Navigate to social-links route with user ID
    await router.push({
      name: "social-links",
      params: { id: userId.toString() },
    });
  } catch (err: any) {
    console.error("Error navigating to social links page:", err);
    alert("Failed to open social links page. Please try again.");
  }
};

async function handleSubmit() {
  try {
    isLoading.value = true;

    // Validate form
    if (!formData.title.trim() || !formData.link.trim() || !formData.platform) {
      alert(t("links.pleaseFillRequired"));
      return;
    }

    // Prepare API payload (map platform to icon)
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || "",
      icon: formData.platform, // API expects 'icon' not 'platform'
      link: formData.link.trim(),
    };

    // Check if we're editing or creating
    if (editingLinkId.value) {
      // Update existing link
      await adminLinksService.updateLink(editingLinkId.value, payload);
      alert(t("links.linkUpdated"));
    } else {
      // Create new link
      await adminLinksService.createLink(payload);
      alert(t("links.linkSaved"));
    }

    // Refresh links from API
    await fetchLinks();

    // Clear the form and reset editing mode
    formData.title = "";
    formData.description = "";
    formData.link = "";
    formData.platform = "";
    editingLinkId.value = null;

    // Go back to the links view
    addNewLink.value = true;
  } catch (err: any) {
    console.error("Error saving link:", err);

    // Parse error for user-friendly message
    let errorMsg = t("links.failedToSaveLink");
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      const errorMessages = Object.values(errors).flat();
      errorMsg = `${t("links.failedToSaveLink")}: ${errorMessages.join(", ")}`;
    } else if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    }
    
    alert(errorMsg);
  } finally {
    isLoading.value = false;
  }
}

function handleShowAlert() {
  showAlert.value = true;
}

function handleCloseAlert() {
  showAlert.value = false;
}

function handleDeleteLink(index: number) {
  selectedIndex.value = index;
  handleShowAlert();
}

async function handleConfirmDelete() {
  try {
    if (selectedIndex.value === null) {
      handleCloseAlert();
      return;
    }

    const linkToDelete = linkItems.value[selectedIndex.value];

    // Safety check: ensure we have a valid ID
    if (!linkToDelete || !linkToDelete.id) {
      alert("Cannot delete link: Missing link ID.");
      handleCloseAlert();
      return;
    }

    isLoading.value = true;

    await adminLinksService.deleteLink(linkToDelete.id);

    // Close alert immediately after successful deletion
    handleCloseAlert();

    // Remove from local list
    linkItems.value.splice(selectedIndex.value, 1);
    selectedIndex.value = null;

    alert(t("links.linkDeleted") || "Link deleted successfully.");

    // Optionally refresh from API to stay in sync
    await fetchLinks();
  } catch (err: any) {
    console.error("Error deleting link:", err);
    const errorMsg = err.response?.data?.message || "Failed to delete link. Please try again.";
    alert(errorMsg);
    // Close alert on error too
    handleCloseAlert();
  } finally {
    isLoading.value = false;
  }
}

// Fetch links when component mounts
onMounted(() => {
  fetchLinks();
});
</script>
