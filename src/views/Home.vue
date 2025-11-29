<script setup lang="ts">
import Footer from '../components/footer.vue';
import Header from '../components/header.vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { useI18n } from 'vue-i18n';
import Icon from '../assets/icons/icon.svg';

import SearchBar from '../components/inputs/searchBar.vue';

const { t } = useI18n()

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
const features = computed(() => [
  {
    icon: "🌐",
    text: t('home.feature1'),
  },
  {
    icon: "🎨",
    text: t('home.feature2'),
  },
  {
    icon: "⚡",
    text: t('home.feature3'),
  },
  {
    icon: "📱",
    text: t('home.feature4'),
  },
]);

const getNumberOfUsers = () => {

  return 1000;
};
const numberOfUsers = ref(getNumberOfUsers());

</script>
<template>
  <main class="min-h-screen bg-white text-[#111111] max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-12">
    <!-- Header component -->
    <Header class="mb-6" />

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
        :placeholder="t('home.exploreCommunity')"
        class="w-full md:max-w-md mt-3"
        @click="goToExplore" />

        <!-- Explore text -->
        <div class="mt-2">
          <h1 class="font-bold text-base lg:text-lg">{{ t('home.exploreCommunity') }}</h1>
          <p class="font-semibold text-xs lg:text-sm mt-1">{{ numberOfUsers }} {{ t('home.people') }}</p>
        </div>
      </div>
    </section>


    <!-- About us -->
    <section class="mt-12 md:mt-16 text-center">
      <h2 class="font-bold text-lg mb-4">{{ t('home.aboutUs') }}</h2>

      <div class="max-w-3xl mx-auto space-y-4 text-sm leading-relaxed">
        <p>
          {{ t('home.aboutUsDescription1') }}
        </p>

        <p>
          {{ t('home.aboutUsDescription2') }}
        </p>
      </div>
    </section>
    
    <!-- Features -->
    <section class="mt-12 md:mt-16">
      <h2 class="font-bold text-lg text-center mb-6">{{ t('home.featuresWeProvide') }}</h2>

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
        <li>🌐 {{ t('home.feature1') }}</li>
        <li>🎨 {{ t('home.feature2') }}</li>
        <li>⚡ {{ t('home.feature3') }}</li>
        <li>🔒 {{ t('home.feature5') }}</li>
        <li>📱 {{ t('home.feature4') }}</li>
      </ul>
    </section>
  </main>
  <Footer />
</template>
