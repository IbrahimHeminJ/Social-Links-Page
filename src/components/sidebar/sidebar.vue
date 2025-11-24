<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
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
        :class="{ 'bg-[#009AFF4A]': route.name === 'admin.links' }"
        >
            <router-link :to="{ name: 'admin.links' }">{{ t('admin.links') }}</router-link>
        </li>
        <li class="font-medium px-4 rounded-full"
        :class="{ 'bg-[#009AFF4A]': route.name === 'admin.profile' }"
        >
            <router-link :to="{ name: 'admin.profile' }">{{ t('admin.profile') }}</router-link>
        </li>
        <li class="font-medium px-4 rounded-full"
        :class="{ 'bg-[#009AFF4A]': route.name === 'admin.themes' }"
        >
            <router-link :to="{ name: 'admin.themes' }">{{ t('admin.themes') }}</router-link>
        </li>
        <li class="font-medium px-4 rounded-full"
        :class="{ 'bg-[#009AFF4A]': route.name === 'admin.about' }"
        >
            <router-link :to="{ name: 'admin.about' }">{{ t('admin.about') }}</router-link>
        </li>
        <li class="font-medium px-4 rounded-full"
        :class="{ 'bg-[#009AFF4A]': route.name === 'admin.policies' }"
        >
            <router-link :to="{ name: 'admin.policies' }">{{ t('admin.policies') }}</router-link>
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
