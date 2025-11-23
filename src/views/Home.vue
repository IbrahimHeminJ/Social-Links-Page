<script setup lang="ts">
import Footer from '../components/footer.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import Icon from '../assets/icons/icon.svg';

import SearchBar from '../components/inputs/searchBar.vue';

const searchQuery = ref('');
const router = useRouter();
const authStore = useAuthStore();

const goToLogin = () => {
  router.push({ name: 'login' });
};

const handleLogout = async () => {
  await authStore.logout();
};

const handleUserClick = () => {
  const role = authStore.userRole;
  
  if (role === 'user') {
    // User role → redirect to admin links
    router.push({ name: 'admin.links' });
  } else if (role === 'admin' || role === 'superadmin') {
    // Admin or superadmin → redirect to superadmin users
    router.push({ name: 'superAdmin.users' });
  }
};

const goToExplore = () => {
  router.push({ name: 'explore' });
};
const features = [
  {
    icon: "🌐",
    text: "Centralize all your links in one personalized page",
  },
  {
    icon: "🎨",
    text: "Customizable themes and styles",
  },
  {
    icon: "⚡",
    text: "Instant link preview and updates",
  },
  {
    icon: "📱",
    text: "Fully responsive and optimized for all devices",
  },
];

const getNumberOfUsers = () => {

  return 1000;
};
const numberOfUsers = ref(getNumberOfUsers());

</script>
<template>
  <main class="min-h-screen bg-white text-[#111111] max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-12">
    <!-- Top bar (login/user icon + logout + theme toggle) -->
    <header class="flex items-center justify-between py-2 border-b border-gray-200 mb-6">
      <div class="flex items-center gap-3">
        <button 
          v-if="!authStore.isAuthenticated"
          @click="goToLogin"
          class="px-5 py-1.5 rounded-full bg-[#0094ff] text-white text-sm font-semibold shadow-sm hover:bg-[#0094ff]/90 transition-colors cursor-pointer"
        >
          Login
        </button>
        <template v-else>
          <button 
            @click="handleUserClick"
            class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center"
            title="Go to dashboard"
          >
            <!-- User Icon SVG -->
            <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </button>
          <button 
            @click="handleLogout"
            class="px-5 py-1.5 rounded-full bg-red-600 text-white text-sm font-semibold shadow-sm hover:bg-red-700 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </template>
      </div>

      <button class="p-2 rounded-full hover:bg-gray-100 transition text-xl" aria-label="Toggle theme">
        <img src="/src/assets/icons/moon.svg" alt="Toggle Theme" class="w-6 h-auto" />
      </button>
    </header>

    <!-- HERO: illustration + logo + search (mobile-first → 2 columns on md+) -->
    <section class="mt-8 md:mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
      <!-- Illustration -->
      <div class="md:w-1/2 flex justify-center md:justify-start">
        <img src="/src/assets/images/man.png" alt="Explore community illustration"
          class="w-56 sm:w-64 md:w-80 h-auto" />
      </div>

      <!-- Logo + search + text -->
      <div class="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-4">
        <!-- Brand logo -->
        <div class="flex items-center gap-3">
          <img :src="Icon" alt="Social Links Logo" class="w-[200px] h-auto" />
          <p class="text-[0.7rem] lg:text-xs tracking-[0.3em] text-[#0094ff] mt-1">
            PAGE<br />GENERATOR
          </p>
        </div>

        <!-- Search -->
        <SearchBar
        v-model="searchQuery"
        placeholder="Explore Community"
        class="w-full md:max-w-md mt-3"
        @click="goToExplore" />

        <!-- Explore text -->
        <div class="mt-2">
          <h1 class="font-bold text-base lg:text-lg">Explore Community</h1>
          <p class="font-semibold text-xs lg:text-sm mt-1">{{ numberOfUsers }} people</p>
        </div>
      </div>
    </section>

    <!-- About us -->
    <section class="mt-12 md:mt-16 text-center">
      <h2 class="font-bold text-lg mb-4">About us</h2>

      <div class="max-w-3xl mx-auto space-y-4 text-sm leading-relaxed">
        <p>
          The Social Links Page Generator is a simple yet powerful tool designed to help
          users create a personalized landing page that organizes all their important
          links in one place. Whether you’re a content creator, freelancer, business, or
          student, this tool allows you to build a shareable profile that connects all
          your online identities — from social media and portfolios to websites and
          contact links.
        </p>

        <p>
          With an intuitive interface and customizable design, users can easily add, edit,
          or remove links, choose their preferred themes, and instantly preview their
          page. The generator automatically produces a clean, mobile-friendly page that
          can be shared anywhere.
        </p>
      </div>
    </section>

    <!-- Features -->
    <section class="mt-12 md:mt-16">
      <h2 class="font-bold text-lg text-center mb-6">Features we provide</h2>

      <!-- Feature cards: 1 col on mobile, 2 on sm, 4 on lg -->
      <!-- Feature cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 max-w-4xl mx-auto">
        <div v-for="(item, index) in features" :key="index"
          class="rounded-2xl border border-gray-100 shadow-md py-8 px-4 flex flex-col items-center text-center text-sm bg-white">
          <div class="text-3xl mb-3">{{ item.icon }}</div>
          <p class="font-medium leading-snug">
            {{ item.text }}
          </p>
        </div>
      </div>

      <!-- Bullet list -->
      <ul class="list-disc list-inside space-y-1 text-sm leading-relaxed max-w-xl mx-auto">
        <li>🌐 Centralize all your links in one personalized page</li>
        <li>🎨 Customizable themes and styles</li>
        <li>⚡ Instant link preview and updates</li>
        <li>🔒 Secure and lightweight backend</li>
        <li>📱 Fully responsive and optimized for all devices</li>
      </ul>
    </section>
  </main>
  <Footer />
</template>
