<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserCard from "../components/userCard.vue";
import { userService } from "../services/user";
import Icon from "../assets/icons/icon.svg";

const route = useRoute();
const router = useRouter();

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  profile_image: string;
  phone_no: string;
  role: string;
}

const users = ref<User[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const tagName = ref<string>("");

// Get tag from query parameter
const category = computed(() => (route.query.category as string) || "");

const goToHome = () => {
  router.push({ name: "home" });
};

const goBack = () => {
  router.push({ name: "explore" });
};

const fetchAllUsers = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    console.log("Fetching all users for category:", category.value);

    const tagsData = await userService.getAllUsers();
    console.log("Tags data:", tagsData);
    console.log("Available tag keys:", Object.keys(tagsData));

    // Find the tag key that matches the category (formatted name)
    const tagKey = userService.findTagKey(category.value, tagsData);

    console.log("Found tag key:", tagKey);

    if (!tagKey) {
      console.error("Tag not found. Category:", category.value);
      const availableTags = Object.keys(tagsData).map((key) =>
        userService.formatTagName(key)
      );
      console.log("Available formatted tags:", availableTags);
      error.value = `Tag "${
        category.value
      }" not found. Available tags: ${availableTags.join(", ")}`;
      isLoading.value = false;
      return;
    }

    const foundTagData = tagsData[tagKey];
    console.log("Found tag data:", foundTagData);

    // Get all users for this tag (don't limit, show all)
    if (foundTagData && foundTagData.length > 0 && foundTagData[0].users) {
      const allUsers = foundTagData[0].users;
      console.log("All users for tag:", allUsers);
      console.log("Number of users:", allUsers.length);

      users.value = allUsers.map((user: User) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        profile_image: user.profile_image || "/src/assets/images/user.jpg",
        phone_no: user.phone_no,
        role: user.role,
      }));

      tagName.value = userService.formatTagName(tagKey);
      console.log("Users loaded successfully:", users.value.length);
    } else {
      console.error("No users in tag data");
      error.value = "No users found for this tag";
    }
  } catch (err: any) {
    console.error("Error fetching users:", err);
    error.value = err.response?.data?.message || "Failed to fetch users";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  console.log("AllUsers mounted. Category:", category.value);
  console.log("Route query:", route.query);

  if (category.value) {
    fetchAllUsers();
  } else {
    error.value = "No category specified";
    console.error("No category in query params");
  }
});
</script>

<template>
  <main
    class="min-h-screen bg-white text-[#111111] max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-10"
  >
    <!-- Top logo bar -->
    <header
      class="pt-6 pb-4 border-b border-gray-200 flex items-center justify-between"
    >
      <img
        :src="Icon"
        alt="Social Links Logo"
        class="w-25 h-auto cursor-pointer"
        @click="goToHome"
      />
      <button
        @click="goBack"
        class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
      >
        Back to Explore
      </button>
    </header>

    <!-- Title -->
    <section class="mt-6">
      <h1 class="text-2xl font-bold mb-2">
        {{ tagName || category || "All Users" }}
      </h1>
      <p class="text-gray-600" v-if="!isLoading">{{ users.length }} users</p>
    </section>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-12">
      <p class="text-gray-600">Loading users...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600 mb-2">{{ error }}</p>
      <p class="text-sm text-gray-500">Category: {{ category }}</p>
    </div>

    <!-- Users grid -->
    <section v-else class="mt-8">
      <div v-if="users.length === 0" class="text-center py-12">
        <p class="text-gray-600">No users found for this tag</p>
        <p class="text-sm text-gray-500 mt-2">Category: {{ category }}</p>
        <p class="text-sm text-gray-500">
          Users array length: {{ users.length }}
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <UserCard
          v-for="user in users"
          :key="user.id"
          :id="user.id"
          :name="user.name"
          :role="tagName || category"
          :avatar="user.profile_image"
        />
      </div>
    </section>
  </main>
</template>
