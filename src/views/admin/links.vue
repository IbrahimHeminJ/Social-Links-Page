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
    <div class="w-full flex flex-col gap-y-4" @click="handleAddNewLink">
      <TextHeading>Add New Link</TextHeading>
      <div
        class="hover:cursor-pointer h-[91px] w-full bg-[#F5F5F5] flex justify-center items-center gap-x-4 border-2 border-[#009AFF] rounded-[10px] border-dashed"
      >
        <img src="../../assets/icons/plus.svg" alt="plus" class="size-[21px]" />
        <TextHeading>Add New Link</TextHeading>
      </div>
    </div>
    <div class="flex flex-col gap-y-4">
      <TextHeading>Links</TextHeading>
      <div class="flex flex-col gap-y-4">
        <div
          v-if="linkItems.length === 0"
          class="text-center text-gray-400 py-8"
        >
          No links yet. Click "Add New Link" to get started!
        </div>
        <Card
          v-for="(link, index) in linkItems"
          :key="index"
          :icon="getIconForPlatform(link.platform)"
          :title="link.title"
          :handleDelete="() => handleDeleteLink(index)"
        />
      </div>
    </div>
  </div>
  <div
    class="w-full h-auto pb-10 px-12 md:pt-10 pt-5 flex flex-col gap-y-6"
    v-else
  >
    <div class="flex flex-col gap-y-4">
      <div class="flex items-center justify-between">
        <TextHeading>Links</TextHeading>
        <button
          class="text-[#009AFF] cursor-pointer text-sm font-medium"
          @click="handleBack"
        >
          Back
        </button>
      </div>
      <p class="text-justify">
        fill the following form and please consider the
        <span class="text-[#009AFF]">community guideline</span>, and by using
        our services you agree to our
        <span class="text-[#009AFF]">terms</span> and
        <span class="text-[#009AFF]">policies</span>.
      </p>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-y-7">
        <Input
          label="Title"
          type="text"
          placeholder="e.g. My Facebook Page"
          v-model="formData.title"
        />
        <Input
          label="Description"
          type="text"
          placeholder="e.g. my official facebook"
          v-model="formData.description"
        />
        <Input
          label="Link"
          type="text"
          placeholder="e.g. www.facebook.com"
          v-model="formData.link"
        />
        <Select
          label="Platform"
          :options="platforms"
          placeholder="Select a platform"
          v-model="formData.platform"
        />
        <Submit />
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
import { reactive, ref, computed } from "vue";
import Submit from "../../components/buttons/submit.vue";

interface LinkItem {
  title: string;
  description: string;
  link: string;
  platform: string;
}

const platforms = ref([
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
  { label: "GitHub", value: "github" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Twitter", value: "twitter" },
  { label: "YouTube", value: "youtube" },
]);

const addNewLink = ref(true);

const showAlert = ref(false);

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

const getIconForPlatform = (platform: string): string => {
  // Return the platform name as the icon (this should match SVG filename in icons folder)
  // e.g., "facebook" will look for "facebook.svg"
  return platform || "";
};

function handleAddNewLink() {
  addNewLink.value = false;
}

function handleBack() {
  addNewLink.value = true;
}

function handleSubmit() {
  console.log("Form Data:", formData);
  console.log("Platform value:", formData.platform);

  // Add the link to the list
  linkItems.value.push({
    title: formData.title,
    description: formData.description,
    link: formData.link,
    platform: formData.platform,
  });

  // Clear the form
  formData.title = "";
  formData.description = "";
  formData.link = "";
  formData.platform = "";

  // Go back to the links view
  addNewLink.value = true;

  console.log("All Links:", linkItems.value);
  const lastLink = linkItems.value[linkItems.value.length - 1];
  if (lastLink) {
    console.log("Icon for last link:", getIconForPlatform(lastLink.platform));
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

function handleConfirmDelete() {
  if (selectedIndex.value !== null) {
    linkItems.value.splice(selectedIndex.value, 1);
    selectedIndex.value = null;
  }
  handleCloseAlert();
}
</script>
