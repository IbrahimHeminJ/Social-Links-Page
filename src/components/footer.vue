<script setup lang="ts">
import Icon from '../assets/icons/icon.svg';
    const year = new Date().getFullYear() 
</script>
<template>
  <footer class="bg-[#1a1a1a] text-white font-sans">
    <div class="max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">

      <!-- Top Section -->
      <div class="flex flex-col gap-8 md:flex-row md:items-start md:gap-16">

        <!-- Logo + Brand -->
        <div class="flex items-center gap-4">
          <!-- Logo box -->
          <div class="w-16 h-16 rounded-xl bg-white flex items-center justify-center">
            <img :src="Icon" alt="Logo" class="w-10 h-10" />
          </div>

            
          <!-- Brand text -->
          <div class="uppercase">
            <p class="font-extrabold text-lg sm:text-xl leading-[1.1] tracking-wide">
              SOCIAL <br /> LINKS
            </p>
            <p class="text-[0.65rem] sm:text-xs tracking-[0.25em] mt-1">
              PAGE GENERATOR
            </p>
          </div>
        </div>

        <!-- Info Columns -->
        <div class="flex flex-col gap-6 md:flex-row md:items-start md:gap-12 lg:gap-16">
          <!-- Contacts -->
          <div>
            <h3 class="font-bold text-base sm:text-lg mb-3">Contacts</h3>
            <ul class="space-y-1 text-[#e4e4e4] text-sm sm:text-base">
              <li>facebook</li>
              <li>instagram</li>
              <li>customer support</li>
              <li>phoneNo:</li>
              <li>+9640000000000</li>
            </ul>
          </div>

          <!-- Divider: horizontal on mobile, vertical on md+ -->
          <div
            class="bg-gray-400 h-px w-16 mx-0 md:mx-0 md:w-px md:h-24 lg:h-32 self-start md:self-auto"
          ></div>

          <!-- Address -->
          <div>
            <h3 class="font-bold text-base sm:text-lg mb-3">Address</h3>
            <ul class="space-y-1 text-[#e4e4e4] text-sm sm:text-base">
              <li>Iraq - erbil</li>
              <li>Swetzirland - alps</li>
              <li>Uk - london</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Text -->
      <div class="text-center text-xs sm:text-sm text-gray-300 mt-8 sm:mt-10">
        All rights reserved to BroTeam © | copyright 2025
      </div>
    </div>
  </footer>
</template>