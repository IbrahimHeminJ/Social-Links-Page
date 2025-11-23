<script setup lang="ts">
import UserCard from '../components/userCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToAllUsers = (category: string) => {
  router.push({ name: 'allUsers', query: { category } });
};

// Dummy data (replace with backend API later)
const categories = [
  {
    title: "Designers",
    users: [
      { id: 1, name: "Halwest", role: "Designer", avatar: "/src/assets/images/user.jpg" },
      { id: 2, name: "Halwest", role: "Designer", avatar: "/src/assets/images/user.jpg" },
      { id: 7, name: "Halwest", role: "Designer", avatar: "/src/assets/images/user.jpg" },
      { id: 7, name: "Halwest", role: "Designer", avatar: "/src/assets/images/user.jpg" },
      { id: 7, name: "Halwest", role: "Designer", avatar: "/src/assets/images/user.jpg" },
    ],
  },
  {
    title: "Software Engineer",
    users: [
      { id: 3, name: "Halwest", role: "Software Engineer", avatar: "/src/assets/images/user.jpg" },
      { id: 4, name: "Halwest", role: "Software Engineer", avatar: "/src/assets/images/user.jpg" },
    ],
  },
  {
    title: "Technology",
    users: [
      { id: 5, name: "Halwest", role: "Technology", avatar: "/src/assets/images/user.jpg" },
      { id: 6, name: "Halwest", role: "Technology", avatar: "/src/assets/images/user.jpg" },
    ],
  },
];
</script>

<template>
  <div class="space-y-10">
    <p class="text-lg font-medium">or explore here</p>

    <section v-for="category in categories" :key="category.title">
      <div class="flex items-center mb-4">

        <h2 class="inline text-xl font-semibold">{{ category.title }}</h2>
        <button
        class="mt-auto mx-2 px-2 py-2 rounded-xl bg-[#3d4f5d] text-white font-semibold text-[10px] shadow-sm
               hover:brightness-110 transition"
        @click="goToAllUsers(category.title)"
      >
        View All
      </button>
      </div>

      <div class="-mx-4 px-4 overflow-x-auto">
        <div class="flex gap-4 pb-4">
          <UserCard
            v-for="u in category.users"
            :key="u.id"
            :id="u.id"
            :name="u.name"
            :role="u.role"
            :avatar="u.avatar"
          />
        </div>
      </div>
    </section>
  </div>
</template>
