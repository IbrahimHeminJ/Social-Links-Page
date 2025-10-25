<script setup lang="ts"></script>
<template> 
  <div
    class="max-md:top-[57px] bg-white border-r fixed flex flex-col items-start md:items-center px-4 justify-between left-0 md:w-[263px] w-[221px] h-full border-[#9F9F9F]"
  >
    <div class="flex md:mt-10 mt-5 flex-col items-start justify-start gap-y-8">
      <img
        src="../../assets/icons/icon.svg"
        alt="logo"
        class="w-[137.44px] h-[47.88px] max-md:hidden"
      />
      <ul class="flex flex-col gap-y-4 text-lg">
        <li class="font-medium">
            <router-link :to="{ name: 'admin.links' }">Links</router-link>
        </li>
        <li class="font-medium">
            <router-link :to="{ name: 'admin.profile' }">Profile</router-link>
        </li>
        <li class="font-medium">
            <router-link :to="{ name: 'admin.about' }">About</router-link>
        </li>
        <li class="font-medium">
            <router-link :to="{ name: 'admin.policies' }">Policies</router-link>
        </li>
      </ul> 
    </div>
    <div>
      <img
        src="../../assets/icons/moon.svg"
        alt="moon"
        class="size-[21px] mb-20 md:hidden"
      />
    </div>
  </div>
</template>
