<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
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
      <ul class="flex flex-col gap-y-4 text-lg w-full ">
        <li class="font-medium px-4 rounded-full"
        :class="{ 'bg-[#009AFF4A]': route.name === 'superAdmin.users' }"
        >
            <router-link :to="{ name: 'superAdmin.users' }">Users</router-link>
        </li>
        <li class="font-medium px-4 rounded-full"
        :class="{ 'bg-[#009AFF4A]': route.name === 'superAdmin.profile' }"
        >
            <router-link :to="{ name: 'superAdmin.profile' }">Profile</router-link>
        </li>
        <li class="font-medium px-4 rounded-full"
        :class="{ 'bg-[#009AFF4A]': route.name === 'superAdmin.reports' }"
        >
            <router-link :to="{ name: 'superAdmin.reports' }">Reports</router-link>
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

