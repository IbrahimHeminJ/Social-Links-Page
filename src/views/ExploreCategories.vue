<!-- src/views/ExploreView.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const router = useRouter();
const route = useRoute();


const goToSearch = () => {
  router.push({ name: 'explore-search' });
};
// Dummy data – replace avatars and ids with real data later
const categories = [
  {
    title: 'Designers',
    users: [
      {
        id: 1,
        name: 'Halwest',
        role: 'Designer',
        avatar: '/src/assets/images/user.jpg',
      },
      {
        id: 2,
        name: 'Halwest',
        role: 'Designer',
        avatar: '/src/assets/images/user.jpg',
      },
      {
        id: 7,
        name: 'Halwest',
        role: 'Designer',
        avatar: '/src/assets/images/user.jpg',
      },
      {
        id: 8,
        name: 'Halwest',
        role: 'Designer',
        avatar: '/src/assets/images/user.jpg',
      },
      {
        id: 9,
        name: 'Halwest',
        role: 'Designer',
        avatar: '/src/assets/images/user.jpg',
      }
    ],
  },
  {
    title: 'Software Engineer',
    users: [
      {
        id: 3,
        name: 'Halwest',
        role: 'Software Engineer',
        avatar: '/src/assets/images/user.jpg',
      },
      {
        id: 4,
        name: 'Halwest',
        role: 'Software Engineer',
        avatar: '/src/assets/images/user.jpg',
      },
    ],
  },
  {
    title: 'Technology',
    users: [
      {
        id: 5,
        name: 'Halwest',
        role: 'Technology',
        avatar: '/src/assets/images/user.jpg',
      },
      {
        id: 6,
        name: 'Halwest',
        role: 'Technology',
        avatar: '/src/assets/images/user.jpg',
      },
    ],
  },
];



const goToProfile = (user: (typeof categories)[number]['users'][number]) => {
  router.push({
    // 🔁 change this to your actual route name & params
    name: 'social-links',
    params: { id: user.id },
  });
};
</script>

<template>
    <section class="min-h-screen bg-white text-[#111111] max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-10">

    <p class="mt-6 text-lg font-medium">or explore here</p>


    <!-- Categories -->
    <section class="mt-6 space-y-10">
      <div v-for="category in categories" :key="category.title">
        <h2 class="text-xl font-semibold mb-4">
          {{ category.title }}
        </h2>

        <!-- Horizontal scroll list -->
        <div class="-mx-4 px-4 overflow-x-auto">
          <div class="flex gap-4 pb-4">
            <article
              v-for="user in category.users"
              :key="user.id"
              class="min-w-[175px] max-w-[240px] bg-[#f7f7f7] border border-[#0094ff] rounded-3xl flex flex-col items-center text-center py-6 px-4 shadow-sm"
            >
              <img
                :src="user.avatar"
                :alt="user.name"
                class="w-24 h-24 rounded-full object-cover mb-4"
              />

              <h3 class="text-lg font-semibold mb-1">
                {{ user.name }}
              </h3>
              <p class="text-sm text-gray-700 mb-4">
                {{ user.role }}
              </p>

              <button
                class="mt-auto px-8 py-2 rounded-xl bg-[#0094ff] text-white font-semibold text-sm shadow-sm hover:brightness-110 transition"
                @click="goToProfile(user)"
              >
                View
              </button>
            </article>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>
