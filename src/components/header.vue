<script setup lang="ts"></script>
<template>
  <header class="bg-gray-800 text-white py-4 px-12">
    <nav class="flex justify-between items-center">
        <div>
            <router-link to="/" class="text-2xl font-bold">
                Social Links Page
            </router-link>
        </div>
      <div>
        <ul class="flex items-center gap-x-4">
          <li>
            <router-link :to="{ name: 'home' }">Home</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'about' }">About</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'contact' }">Contact</router-link>
          </li>
        </ul>
      </div>
      <div class="flex items-center gap-x-4">
        <button>
          <router-link :to="{ name: 'login' }">Login</router-link>
        </button>
        <button>
          <router-link :to="{ name: 'signup' }">Register</router-link>
        </button>
      </div>
    </nav>
  </header>
</template>
