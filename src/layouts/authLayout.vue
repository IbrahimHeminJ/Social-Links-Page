<script setup lang="ts"></script>

<template>
  <main class="min-h-screen bg-gray-50 flex items-center justify-center py-8">
    <div class="w-full max-w-md mx-auto">
      <div class="bg-white rounded-lg shadow-md p-8">
        <div class="mb-6 ">
          <router-link
            to="/"
            class="inline-flex items-center text-white bg-blue-950 px-4 py-2 rounded-lg"
          >
            Back to Home
          </router-link>
        </div>
        <router-view />
      </div>
    </div>
  </main>
</template>
